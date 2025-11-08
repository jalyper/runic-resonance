#!/usr/bin/env python3
"""
Script to pre-generate all trait images using AWS Bedrock.
Run this once to create static image assets.

Usage: python generate_trait_images.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from image_generator import TraitImageGenerator
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def main():
    print("🎨 Generating trait images using AWS Bedrock...")
    print("=" * 60)
    
    generator = TraitImageGenerator()
    results = generator.generate_all_trait_images()
    
    print("\n" + "=" * 60)
    print(f"✅ Successfully generated {len(results)}/10 trait images!")
    print(f"📁 Images saved to: /app/backend/static/traits/")
    
    for trait_name in results.keys():
        safe_name = trait_name.replace(' ', '_').replace('The_', '').lower()
        print(f"   ✓ {trait_name} -> {safe_name}.png")
    
    if len(results) < 10:
        print(f"\n⚠️  Warning: Only {len(results)} images generated. Check logs for errors.")
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())
