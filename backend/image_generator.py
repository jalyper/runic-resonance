"""
AWS Bedrock Image Generation for Trait Artwork
"""
import json
import logging
import boto3
import os
import base64
from typing import Optional
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()


class TraitImageGenerator:
    """Generates artistic images for personality traits using AWS Bedrock."""
    
    def __init__(self):
        """Initialize Bedrock client for image generation."""
        self.client = boto3.client(
            service_name='bedrock-runtime',
            region_name=os.environ.get('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
        )
        # Using Amazon Titan Image Generator v2 for high-quality artistic images
        self.model_id = "amazon.titan-image-generator-v2:0"
    
    # Artistic prompts for each trait in Arcane style
    TRAIT_PROMPTS = {
        "The Protector": """A powerful guardian figure with ornate shield and armor, standing protectively in front of ethereal allies. 
        Arcane animated series art style, painterly textures, dramatic lighting with blue and cyan magical auras. 
        Heroic composition, detailed armor engravings, protective stance. Fantasy illustration, digital painting, cinematic.""",
        
        "The Tactician": """A strategic mastermind surrounded by holographic maps and glowing runes, eyes gleaming with intelligence. 
        Arcane animated series style, purple and blue color palette, mystical symbols floating in the air. 
        Wise expression, tactical brilliance, magical war room. High detail, painterly style, atmospheric lighting.""",
        
        "The Disciplined": """An abstract representation of discipline and mastery, geometric patterns forming perfect order. 
        Steel and silver tones, precise lines and sacred geometry, meditation and focus visualized. 
        Arcane animated series style, artistic patterns showing dedication and perfection. Symbolic illustration.""",
        
        "The Fearless": """A brave warrior charging into battle, surrounded by explosive magical energy, fearless expression. 
        Arcane animated series style, fiery red and orange auras, lightning crackling around them. 
        Action pose, courageous stance, battlefield chaos. Dramatic lighting, painterly textures, heroic composition.""",
        
        "The Resilient": """An unbreakable warrior standing amidst destruction, glowing with regenerative green energy, unyielding. 
        Arcane animated series aesthetic, emerald and forest green tones, cracks healing with light. 
        Determined expression, rising from adversity, phoenix-like rebirth. Powerful illustration, epic scale.""",
        
        "The Wanderer": """A lone traveler on a mystical path, silhouetted against magical twilight sky, independent spirit. 
        Arcane animated series style, purple and indigo color palette, ethereal atmosphere. 
        Solitary figure, open road ahead, sense of freedom. Atmospheric perspective, painterly clouds, journey aesthetic.""",
        
        "The Adaptive": """A shapeshifting mage surrounded by swirling transformative magic, multiple forms visible in aura. 
        Arcane animated series aesthetic, rainbow prismatic colors, fluid transformation energy. 
        Versatile poses merging together, kaleidoscope effect, magical versatility. High detail, mystical illustration.""",
        
        "The Enlightened": """A serene sage meditating with perfect balance, surrounded by golden yin-yang symbols and cosmic energy. 
        Arcane animated series style, warm gold and amber tones, peaceful aura radiating wisdom. 
        Zen composition, floating in lotus position, harmonious balance. Spiritual illustration, soft lighting.""",
        
        "The Relentless": """A determined fighter with intense eyes, surrounded by crimson combat energy, never backing down. 
        Arcane animated series aesthetic, deep red and rose color palette, aggressive magical aura. 
        Fierce expression, battle-worn but unstoppable, warrior's resolve. Dynamic pose, powerful illustration.""",
        
        "The Healer": """Ethereal healing magic manifestation, soft emerald green energy particles flowing in serene patterns. 
        Arcane animated series aesthetic, gentle glowing auras and restorative light, peaceful energy visualization. 
        Abstract life force and compassion, hope embodied in magical essence. Tranquil illustration, healing essence."""
    }
    
    def generate_trait_image(self, trait_name: str, output_path: Optional[str] = None) -> Optional[str]:
        """
        Generate an artistic image for a specific trait.
        
        Args:
            trait_name: Name of the trait (e.g., "The Protector")
            output_path: Optional path to save the image
            
        Returns:
            Base64 encoded image string or None if generation fails
        """
        if trait_name not in self.TRAIT_PROMPTS:
            logger.error(f"No prompt defined for trait: {trait_name}")
            return None
        
        prompt = self.TRAIT_PROMPTS[trait_name]
        
        try:
            logger.info(f"Generating image for trait: {trait_name}")
            
            # Construct request for Amazon Titan Image Generator v2
            request_body = json.dumps({
                "taskType": "TEXT_IMAGE",
                "textToImageParams": {
                    "text": prompt,
                },
                "imageGenerationConfig": {
                    "numberOfImages": 1,
                    "height": 512,
                    "width": 512,
                    "cfgScale": 8.0,
                    "seed": hash(trait_name) % (2**31)
                }
            })
            
            # Invoke the model
            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=request_body
            )
            
            # Parse response
            response_body = json.loads(response['body'].read())
            
            # Extract base64 image
            if 'images' in response_body and len(response_body['images']) > 0:
                base64_image = response_body['images'][0]
                logger.info(f"Successfully generated image for {trait_name}")
                
                # Optionally save to file
                if output_path:
                    image_data = base64.b64decode(base64_image)
                    with open(output_path, 'wb') as f:
                        f.write(image_data)
                    logger.info(f"Saved image to {output_path}")
                
                return base64_image
            else:
                logger.error(f"No image in response for {trait_name}")
                return None
                
        except Exception as e:
            logger.error(f"Error generating image for {trait_name}: {e}")
            return None
    
    def generate_all_trait_images(self, output_dir: str = "/app/backend/static/traits") -> dict:
        """
        Generate images for all 10 traits and save them.
        
        Args:
            output_dir: Directory to save images
            
        Returns:
            Dictionary mapping trait names to base64 image data
        """
        import os
        os.makedirs(output_dir, exist_ok=True)
        
        results = {}
        for trait_name in self.TRAIT_PROMPTS.keys():
            # Create safe filename
            safe_name = trait_name.replace(' ', '_').replace('The_', '').lower()
            output_path = os.path.join(output_dir, f"{safe_name}.png")
            
            base64_image = self.generate_trait_image(trait_name, output_path)
            if base64_image:
                results[trait_name] = base64_image
            
            # Small delay to avoid rate limiting
            import time
            time.sleep(1)
        
        logger.info(f"Generated {len(results)}/10 trait images")
        return results


# Fallback: Pre-generated trait image URLs (in case generation fails or for caching)
TRAIT_IMAGE_FALLBACKS = {
    "The Protector": "https://via.placeholder.com/400x400/3b82f6/ffffff?text=Protector",
    "The Tactician": "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Tactician",
    "The Disciplined": "https://via.placeholder.com/400x400/6b7280/ffffff?text=Disciplined",
    "The Fearless": "https://via.placeholder.com/400x400/ef4444/ffffff?text=Fearless",
    "The Resilient": "https://via.placeholder.com/400x400/10b981/ffffff?text=Resilient",
    "The Wanderer": "https://via.placeholder.com/400x400/6366f1/ffffff?text=Wanderer",
    "The Adaptive": "https://via.placeholder.com/400x400/14b8a6/ffffff?text=Adaptive",
    "The Enlightened": "https://via.placeholder.com/400x400/f59e0b/ffffff?text=Enlightened",
    "The Relentless": "https://via.placeholder.com/400x400/ec4899/ffffff?text=Relentless",
    "The Healer": "https://via.placeholder.com/400x400/22c55e/ffffff?text=Healer"
}
