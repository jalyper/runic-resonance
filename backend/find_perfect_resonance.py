#!/usr/bin/env python3
"""
Helper script to analyze which trait combinations can achieve 3/3 slots
and suggest players to test with.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from personality_engine import PersonalityEngine

def analyze_trait_requirements():
    """Show which champions need which traits for 3/3 slots."""
    engine = PersonalityEngine()
    
    print("=" * 80)
    print("CHAMPION TRAIT REQUIREMENTS (for 3/3 Perfect Resonance)")
    print("=" * 80)
    print("\nTo unlock 3 slots, you need scores of 7+ on 3 traits the champion embodies.\n")
    
    # Invert the mapping: champion -> traits
    champion_traits = {}
    for trait_name, champions in engine.TRAIT_CHAMPIONS.items():
        for champion in champions:
            if champion not in champion_traits:
                champion_traits[champion] = []
            champion_traits[champion].append(trait_name)
    
    # Show popular champions and their requirements
    popular_champions = [
        'Yasuo', 'Lee Sin', 'Thresh', 'Ahri', 'Zed', 'Lux', 'Jinx', 
        'Vayne', 'Ezreal', 'Braum', 'Leona', 'Janna', 'Draven',
        'Tryndamere', 'Garen', 'Darius', 'Katarina'
    ]
    
    for champion in sorted(popular_champions):
        if champion in champion_traits:
            traits = champion_traits[champion]
            print(f"\n🎯 {champion} ({len(traits)} possible traits):")
            for trait in traits:
                data_source = engine.TRAIT_DATA_SOURCES.get(trait, "")
                print(f"   • {trait}")
                print(f"     └─ {data_source}")

def suggest_test_profiles():
    """Suggest player profiles that would achieve 3/3 slots."""
    print("\n" + "=" * 80)
    print("TEST PROFILES TO FIND 3/3 PERFECT RESONANCE")
    print("=" * 80)
    
    profiles = [
        {
            "name": "Support Main (Braum/Janna Perfect)",
            "traits": ["The Protector", "The Tactician", "The Healer"],
            "stats": "High assists (10+), high vision score (50+), low deaths (under 4)",
            "likely_champions": ["Braum", "Janna", "Thresh", "Lulu", "Nami"]
        },
        {
            "name": "Aggressive Fighter (Tryndamere/Darius Perfect)",
            "traits": ["The Fearless", "The Relentless", "The Disciplined"],
            "stats": "High kill participation, 200+ CS, aggressive plays",
            "likely_champions": ["Tryndamere", "Darius", "Draven", "Lee Sin"]
        },
        {
            "name": "Elite Mid Laner (Yasuo Perfect)",
            "traits": ["The Disciplined", "The Wanderer", "The Enlightened"],
            "stats": "High CS (220+), good KDA (3.5+), solo kills, 55%+ win rate",
            "likely_champions": ["Yasuo", "Zed", "Ahri"]
        },
        {
            "name": "Tank/Frontline (Leona/Sion Perfect)",
            "traits": ["The Protector", "The Fearless", "The Resilient"],
            "stats": "High damage taken (25k+), low deaths, high assists, aggressive",
            "likely_champions": ["Leona", "Sion", "Ornn", "Braum"]
        },
        {
            "name": "Strategic Support (Swain/TF Perfect)",
            "traits": ["The Tactician", "The Enlightened", "The Relentless"],
            "stats": "High vision (45+), good KDA (3.5+), kill participation",
            "likely_champions": ["Swain", "Twisted Fate", "Zilean"]
        }
    ]
    
    for profile in profiles:
        print(f"\n📊 {profile['name']}")
        print(f"   Required Traits: {', '.join(profile['traits'])}")
        print(f"   Player Stats: {profile['stats']}")
        print(f"   Champions: {', '.join(profile['likely_champions'])}")

def show_trait_score_requirements():
    """Show what stats you need for 7+ on each trait."""
    print("\n" + "=" * 80)
    print("TRAIT UNLOCK REQUIREMENTS (Score 7+)")
    print("=" * 80)
    
    requirements = {
        "The Protector": "2.0+ Assist/Kill ratio + 20k+ damage taken",
        "The Tactician": "40+ vision score + 12+ wards placed",
        "The Disciplined": "200+ CS per game + 11k+ gold",
        "The Fearless": "12+ kill participation per game + first bloods",
        "The Resilient": "Under 4.5 deaths per game + 55%+ win rate",
        "The Wanderer": "Solo kills + high kill-to-assist ratio",
        "The Adaptive": "5+ different champions played",
        "The Enlightened": "3.0+ KDA + 55%+ win rate",
        "The Relentless": "15+ total K+A per game + multikills",
        "The Healer": "8+ assists per game + high assist ratio"
    }
    
    for trait, req in requirements.items():
        print(f"\n✓ {trait}")
        print(f"  {req}")

def main():
    print("\n🔍 PERFECT RESONANCE FINDER\n")
    
    analyze_trait_requirements()
    suggest_test_profiles()
    show_trait_score_requirements()
    
    print("\n" + "=" * 80)
    print("💡 TESTING TIPS:")
    print("=" * 80)
    print("""
1. Look for OTP (One-Trick-Pony) players with 100+ games on one champion
2. Check high elo support mains (often have 3+ strong traits)
3. Search for players with 55%+ win rates in their role
4. Use op.gg or similar sites to find players matching profiles above
5. Test with Riot IDs like: PlayerName#NA1, PlayerName#EUW

Example searches on op.gg:
- Top rated Braum players (likely Protector + Tactician + Healer)
- Top rated Yasuo players (likely Disciplined + Wanderer + Enlightened)
- High win rate support mains (often unlock 3 traits)
""")
    
    print("=" * 80)

if __name__ == "__main__":
    main()
