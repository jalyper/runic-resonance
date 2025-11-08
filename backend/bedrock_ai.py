"""
AWS Bedrock Integration for AI-Generated Narratives
"""
import json
import logging
import boto3
import os
from typing import List, Dict
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()


class BedrockAI:
    """Handles AI narrative generation using AWS Bedrock and Claude."""
    
    def __init__(self):
        """Initialize Bedrock client with AWS credentials."""
        self.client = boto3.client(
            service_name='bedrock-runtime',
            region_name=os.environ.get('AWS_REGION', 'us-east-1'),
            aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY')
        )
        self.model_id = os.environ.get('BEDROCK_MODEL_ID', 'anthropic.claude-3-5-sonnet-20241022-v2:0')
    
    def generate_runic_narrative(
        self,
        summoner_name: str,
        traits: List[Dict],
        spirit_champion: Dict,
        stats: Dict
    ) -> str:
        """
        Generate a mystical, lore-rich narrative about the player's personality.
        
        Args:
            summoner_name: Player's summoner name
            traits: List of personality traits with scores
            spirit_champion: Spirit champion resonance data
            stats: Player statistics
            
        Returns:
            AI-generated narrative string
        """
        # Format traits for the prompt
        traits_description = self._format_traits(traits)
        
        # Get top 3 traits
        sorted_traits = sorted(traits, key=lambda x: x['score'], reverse=True)
        top_traits = sorted_traits[:3]
        top_traits_names = [t['name'] for t in top_traits]
        
        # Build the system prompt
        system_prompt = """You are an ancient Lore Keeper of Runeterra, keeper of the mystical Runes of Resonance. 
        Your sacred duty is to divine the spiritual essence of summoners and reveal which champion's soul resonates 
        within them. You speak in mystical, poetic language befitting the League of Legends universe, weaving 
        references to regions, champions, and cosmic forces. Your readings are both celebratory and insightful, 
        making each summoner feel like a legendary figure in Runeterra's tapestry."""
        
        # Build the user message
        user_message = f"""The Runes have spoken. Perform a Runic Resonance reading for the summoner known as "{summoner_name}".

**Their Resonance Pattern:**
{traits_description}

**Spirit Champion Revealed:** {spirit_champion['champion']}
- Resonance Strength: {spirit_champion['resonance_strength']:.0f}%
- Matching Traits: {', '.join(spirit_champion['matching_traits'])}
- Runic Slots Filled: {spirit_champion['slots_filled']}/3

**Playstyle Essence:**
- Win Rate: {stats.get('win_rate', 0)}%
- KDA: {stats.get('kda', 0)}
- Champion Pool: {stats.get('champion_pool_size', 0)} champions mastered
- Games Analyzed: {stats.get('total_games', 0)} battles

Create a mystical narrative (300-350 words) that:
1. Opens with a dramatic revelation about their Runic Resonance
2. Describes how their top 3 traits ({', '.join(top_traits_names)}) manifest like their spirit champion {spirit_champion['champion']}
3. References specific lore from {spirit_champion['champion']}'s story and how it mirrors the summoner's playstyle
4. Mentions other champions from their strong traits as "echoes" in their essence
5. Includes references to Runeterra's regions, cosmic forces, or ancient magic
6. Ends with an empowering declaration about their legend in the making
7. Uses phrases like "Runic Resonance," "the Runes speak," "essence," "spirit," "destiny"

Make it feel EPIC, MYSTICAL, and PERSONAL. Use poetic language but stay grounded in actual League of Legends lore."""

        try:
            # Construct the request body for Claude 3.5
            request_body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1500,
                "temperature": 0.9,
                "top_p": 0.95,
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": f"{system_prompt}\n\n{user_message}"
                            }
                        ]
                    }
                ]
            })
            
            logger.info(f"Invoking Bedrock for {summoner_name}")
            
            # Invoke the model
            response = self.client.invoke_model(
                modelId=self.model_id,
                contentType="application/json",
                accept="application/json",
                body=request_body
            )
            
            # Parse response
            response_body = json.loads(response['body'].read())
            narrative = response_body['content'][0]['text']
            
            logger.info(f"Successfully generated narrative for {summoner_name}")
            return narrative
            
        except Exception as e:
            logger.error(f"Error generating narrative with Bedrock: {e}")
            # Fallback narrative if AI fails
            return self._generate_fallback_narrative(summoner_name, spirit_champion, top_traits)
    
    def _format_traits(self, traits: List[Dict]) -> str:
        """Format traits into readable description."""
        formatted = ""
        sorted_traits = sorted(traits, key=lambda x: x['score'], reverse=True)
        
        for trait in sorted_traits:
            bars = "█" * trait['score'] + "░" * (10 - trait['score'])
            formatted += f"• {trait['name']}: {bars} ({trait['score']}/10)\n"
            formatted += f"  {trait['description']}\n\n"
        
        return formatted
    
    def _generate_fallback_narrative(
        self,
        summoner_name: str,
        spirit_champion: Dict,
        top_traits: List[Dict]
    ) -> str:
        """Generate a fallback narrative if AI service fails."""
        champion = spirit_champion['champion']
        trait_names = [t['name'] for t in top_traits]
        
        narrative = f"""The ancient Runes of Runeterra shimmer with recognition as they reveal your essence, {summoner_name}.

Through the mystical veil of Runic Resonance, a champion's spirit calls to yours across the planes of existence: **{champion}**. The resonance is undeniable, a cosmic thread binding your destinies together.

Your essence burns brightest with the qualities of {trait_names[0]}, {trait_names[1]}, and {trait_names[2]}. Like {champion} who walks the paths of legend, you embody these ancient virtues in every battle you wage upon the Rift.

The Runes speak of your journey through {spirit_champion['slots_filled']} sacred trials, each revealing another facet of your warrior spirit. Your resonance with {champion} grows stronger with every victory, every defeat, every moment you stand against the tide of chaos.

The Summoner's Rift trembles when you enter, for you carry within you the same fire that burns in {champion}'s heart. Your legend is still being written, summoner, and the Runes themselves watch with anticipation to see what destiny you will forge."""

        return narrative
