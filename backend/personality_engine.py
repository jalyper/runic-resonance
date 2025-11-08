"""
Personality Trait Calculation Engine - Maps gameplay to lore-based traits
"""
import logging
from typing import Dict, List

logger = logging.getLogger(__name__)


class PersonalityEngine:
    """
    Calculates 10 lore-based personality traits from League of Legends gameplay data.
    Each trait maps to specific champions and their lore characteristics.
    """
    
    # Data sources for each trait calculation
    TRAIT_DATA_SOURCES = {
        "The Protector": "Based on: Assist ratio, Damage taken for team, Supporting plays",
        "The Tactician": "Based on: Vision score per minute, Ward placement, Map awareness",
        "The Disciplined": "Based on: CS consistency, Gold efficiency, Mechanical precision",
        "The Fearless": "Based on: Fight participation rate, First blood involvement, Aggression",
        "The Resilient": "Based on: Low death rate, Comeback wins, Survival rate",
        "The Wanderer": "Based on: Solo kill frequency, Independent plays, Roaming patterns",
        "The Adaptive": "Based on: Champion pool diversity, Versatile playstyle",
        "The Enlightened": "Based on: High KDA ratio, Smart decisions, Win rate",
        "The Relentless": "Based on: Kill participation, Multikills, Never giving up",
        "The Healer": "Based on: High assist ratio, Team-focused play, Enabling allies"
    }
    
    # Champion mappings for each trait (based on lore, not mechanics)
    TRAIT_CHAMPIONS = {
        "The Protector": ["Braum", "Taric", "Shen", "Galio", "Poppy"],
        "The Tactician": ["Swain", "Twisted Fate", "Gangplank", "Ryze", "Zilean"],
        "The Disciplined": ["Garen", "Jarvan IV", "Fiora", "Xin Zhao", "Irelia"],
        "The Fearless": ["Leona", "Pantheon", "Darius", "Sett", "Olaf"],
        "The Resilient": ["Sion", "Ornn", "Mundo", "Nasus", "Maokai"],
        "The Wanderer": ["Yasuo", "Taliyah", "Kayn", "Jhin", "Rakan"],
        "The Adaptive": ["Neeko", "Sylas", "LeBlanc", "Zoe", "Seraphine"],
        "The Enlightened": ["Karma", "Jhin", "Ivern", "Bard", "Soraka"],
        "The Relentless": ["Viego", "Kalista", "Kled", "Aatroz", "Mordekaiser"],
        "The Healer": ["Soraka", "Shen", "Janna", "Lulu", "Nami"]
    }
    
    def calculate_traits(self, stats: Dict) -> List[Dict]:
        """
        Calculate all 10 personality traits from player statistics.
        
        Args:
            stats: Dictionary of aggregated player statistics
            
        Returns:
            List of trait dictionaries with name, score, description, and champions
        """
        traits = []
        
        # 1. The Protector - Assists, shields/heals, damage taken for team
        protector_score = self._calculate_protector(stats)
        traits.append({
            "name": "The Protector",
            "score": protector_score,
            "description": "Shield-bearer of allies, standing guard against the darkness",
            "champions": self.TRAIT_CHAMPIONS["The Protector"],
            "lore": "Like Braum with his unbreakable shield, you stand between danger and your companions",
            "data_source": self.TRAIT_DATA_SOURCES["The Protector"]
        })
        
        # 2. The Tactician - Vision score, strategic play, map awareness
        tactician_score = self._calculate_tactician(stats)
        traits.append({
            "name": "The Tactician",
            "score": tactician_score,
            "description": "Master strategist who sees the battlefield's hidden patterns",
            "champions": self.TRAIT_CHAMPIONS["The Tactician"],
            "lore": "Like Swain's ravens, your vision extends across Runeterra, anticipating every move"
        })
        
        # 3. The Disciplined - CS consistency, gold efficiency, mechanical precision
        disciplined_score = self._calculate_disciplined(stats)
        traits.append({
            "name": "The Disciplined",
            "score": disciplined_score,
            "description": "Unwavering dedication to perfecting your craft through endless practice",
            "champions": self.TRAIT_CHAMPIONS["The Disciplined"],
            "lore": "Like Garen's devotion to Demacia, your discipline never wavers"
        })
        
        # 4. The Fearless - Fight participation, first bloods, aggression
        fearless_score = self._calculate_fearless(stats)
        traits.append({
            "name": "The Fearless",
            "score": fearless_score,
            "description": "Warrior who charges into battle without hesitation or doubt",
            "champions": self.TRAIT_CHAMPIONS["The Fearless"],
            "lore": "Like Leona basking in the sun's glory, you embrace combat with radiant courage"
        })
        
        # 5. The Resilient - Damage taken, deaths avoided, comeback potential
        resilient_score = self._calculate_resilient(stats)
        traits.append({
            "name": "The Resilient",
            "score": resilient_score,
            "description": "Indomitable spirit that endures through the harshest trials",
            "champions": self.TRAIT_CHAMPIONS["The Resilient"],
            "lore": "Like Sion who conquered death itself, you refuse to stay down"
        })
        
        # 6. The Wanderer - Solo plays, roaming patterns, independence
        wanderer_score = self._calculate_wanderer(stats)
        traits.append({
            "name": "The Wanderer",
            "score": wanderer_score,
            "description": "Lone traveler following their own path across the Rift",
            "champions": self.TRAIT_CHAMPIONS["The Wanderer"],
            "lore": "Like Yasuo's journey for redemption, you forge your own destiny"
        })
        
        # 7. The Adaptive - Champion diversity, versatile builds, flexible play
        adaptive_score = self._calculate_adaptive(stats)
        traits.append({
            "name": "The Adaptive",
            "score": adaptive_score,
            "description": "Shapeshifter who thrives by embracing change and variety",
            "champions": self.TRAIT_CHAMPIONS["The Adaptive"],
            "lore": "Like Neeko who becomes anyone, you master every form and strategy"
        })
        
        # 8. The Enlightened - High KDA, smart decisions, wisdom in combat
        enlightened_score = self._calculate_enlightened(stats)
        traits.append({
            "name": "The Enlightened",
            "score": enlightened_score,
            "description": "Seeker of perfect balance between aggression and restraint",
            "champions": self.TRAIT_CHAMPIONS["The Enlightened"],
            "lore": "Like Karma who weighs every action, you achieve harmony through wisdom"
        })
        
        # 9. The Relentless - Kill participation, never giving up, persistence
        relentless_score = self._calculate_relentless(stats)
        traits.append({
            "name": "The Relentless",
            "score": relentless_score,
            "description": "Unstoppable force bound by singular purpose and determination",
            "champions": self.TRAIT_CHAMPIONS["The Relentless"],
            "lore": "Like Viego's endless pursuit, you never rest until victory is yours"
        })
        
        # 10. The Healer - Support patterns, enabler, team-focused
        healer_score = self._calculate_healer(stats)
        traits.append({
            "name": "The Healer",
            "score": healer_score,
            "description": "Guardian spirit who mends wounds and lifts fallen allies",
            "champions": self.TRAIT_CHAMPIONS["The Healer"],
            "lore": "Like Soraka who sacrifices herself for others, you embody compassion"
        })
        
        return traits
    
    def _normalize_score(self, value: float, min_val: float = 1, max_val: float = 10) -> int:
        """Normalize a score to 1-10 range."""
        normalized = max(min_val, min(max_val, value))
        return round(normalized)
    
    def _calculate_protector(self, stats: Dict) -> int:
        """Calculate Protector trait score."""
        assists_ratio = stats.get('avg_assists', 0) / max(stats.get('avg_kills', 1), 1)
        damage_taken = stats.get('avg_damage_taken', 0) / 1000  # Normalize
        
        score = (assists_ratio * 4) + (damage_taken / 5)
        return self._normalize_score(score)
    
    def _calculate_tactician(self, stats: Dict) -> int:
        """Calculate Tactician trait score."""
        vision = stats.get('avg_vision_score', 0) / 10
        wards = stats.get('avg_wards_placed', 0) / 2
        
        score = vision + wards
        return self._normalize_score(score)
    
    def _calculate_disciplined(self, stats: Dict) -> int:
        """Calculate Disciplined trait score."""
        cs_score = stats.get('avg_cs', 0) / 30
        gold_efficiency = stats.get('avg_gold', 0) / 1200
        
        score = cs_score + gold_efficiency
        return self._normalize_score(score)
    
    def _calculate_fearless(self, stats: Dict) -> int:
        """Calculate Fearless trait score."""
        kill_participation = (stats.get('kills', 0) + stats.get('assists', 0)) / max(stats.get('total_games', 1), 1)
        first_blood_rate = (stats.get('first_bloods', 0) / max(stats.get('total_games', 1), 1)) * 10
        
        score = (kill_participation / 2) + first_blood_rate
        return self._normalize_score(score)
    
    def _calculate_resilient(self, stats: Dict) -> int:
        """Calculate Resilient trait score."""
        low_death_score = 10 - (stats.get('avg_deaths', 5) * 0.8)
        win_rate_contribution = stats.get('win_rate', 50) / 10
        
        score = (low_death_score * 0.6) + (win_rate_contribution * 0.4)
        return self._normalize_score(score)
    
    def _calculate_wanderer(self, stats: Dict) -> int:
        """Calculate Wanderer trait score."""
        solo_kill_rate = (stats.get('solo_kills', 0) / max(stats.get('total_games', 1), 1)) * 5
        kill_focus = stats.get('avg_kills', 0) / max(stats.get('avg_assists', 1), 1)
        
        score = solo_kill_rate + (kill_focus * 2)
        return self._normalize_score(score)
    
    def _calculate_adaptive(self, stats: Dict) -> int:
        """Calculate Adaptive trait score."""
        champion_diversity = stats.get('champion_pool_size', 1)
        
        score = champion_diversity / 2
        return self._normalize_score(score)
    
    def _calculate_enlightened(self, stats: Dict) -> int:
        """Calculate Enlightened trait score."""
        kda = stats.get('kda', 2)
        win_rate = stats.get('win_rate', 50) / 10
        
        score = (kda * 0.7) + (win_rate * 0.3)
        return self._normalize_score(score)
    
    def _calculate_relentless(self, stats: Dict) -> int:
        """Calculate Relentless trait score."""
        kill_participation = (stats.get('kills', 0) + stats.get('assists', 0)) / max(stats.get('total_games', 1) * 15, 1) * 10
        multikill_rate = (stats.get('multikills', 0) / max(stats.get('total_games', 1), 1)) * 5
        
        score = kill_participation + multikill_rate
        return self._normalize_score(score)
    
    def _calculate_healer(self, stats: Dict) -> int:
        """Calculate Healer trait score."""
        assist_focus = stats.get('avg_assists', 0) / max(stats.get('avg_kills', 1), 1)
        team_orientation = stats.get('avg_assists', 0) / 2
        
        score = (assist_focus * 3) + (team_orientation / 3)
        return self._normalize_score(score)
    
    def determine_spirit_champion(self, traits: List[Dict], stats: Dict) -> Dict:
        """
        Determine the player's spirit champion based on traits and play patterns.
        Uses a 3-slot system where champions need 3 matching traits to be assigned.
        
        Args:
            traits: List of calculated personality traits
            stats: Player statistics including champions played
            
        Returns:
            Dictionary with spirit champion info and runner-ups
        """
        # Count how many traits match each champion
        champion_scores = {}
        
        for trait in traits:
            # Only count traits with score >= 7 (strong traits)
            if trait['score'] >= 7:
                for champion in trait['champions']:
                    if champion not in champion_scores:
                        champion_scores[champion] = {
                            'slots_filled': 0,
                            'traits': [],
                            'trait_details': [],
                            'total_score': 0
                        }
                    champion_scores[champion]['slots_filled'] += 1
                    champion_scores[champion]['traits'].append(trait['name'])
                    champion_scores[champion]['trait_details'].append({
                        'name': trait['name'],
                        'score': trait['score'],
                        'lore': trait['lore']
                    })
                    champion_scores[champion]['total_score'] += trait['score']
        
        # Apply play-rate multiplier
        champions_played = stats.get('champions_played', {})
        total_games = stats.get('total_games', 1)
        
        for champion, games in champions_played.items():
            play_rate = (games / total_games) * 100
            if champion in champion_scores:
                # Bonus for playing the champion
                if play_rate >= 25:
                    champion_scores[champion]['total_score'] += 30
                    champion_scores[champion]['play_bonus'] = 'High'
                elif play_rate >= 15:
                    champion_scores[champion]['total_score'] += 20
                    champion_scores[champion]['play_bonus'] = 'Medium'
                elif play_rate >= 10:
                    champion_scores[champion]['total_score'] += 10
                    champion_scores[champion]['play_bonus'] = 'Low'
        
        # Sort all champions by total score
        sorted_champions = sorted(
            champion_scores.items(), 
            key=lambda x: (x[1]['slots_filled'], x[1]['total_score']), 
            reverse=True
        )
        
        # Get top 3 champions
        top_champions = []
        for i, (champ, data) in enumerate(sorted_champions[:3]):
            resonance = min(100, (data['total_score'] / 30) * 100)
            top_champions.append({
                'rank': i + 1,
                'champion': champ,
                'slots_filled': data['slots_filled'],
                'matching_traits': data['traits'],
                'trait_details': data['trait_details'],
                'resonance_strength': resonance,
                'play_bonus': data.get('play_bonus', 'None')
            })
        
        # Ensure we have at least 1 champion
        if not top_champions:
            # Fallback: Find highest scoring trait and pick a champion from it
            highest_trait = max(traits, key=lambda x: x['score'])
            top_champions = [{
                'rank': 1,
                'champion': highest_trait['champions'][0],
                'slots_filled': 1,
                'matching_traits': [highest_trait['name']],
                'trait_details': [{
                    'name': highest_trait['name'],
                    'score': highest_trait['score'],
                    'lore': highest_trait['lore']
                }],
                'resonance_strength': highest_trait['score'] * 10,
                'play_bonus': 'None'
            }]
        
        # Return primary champion and runner-ups
        return {
            'primary': top_champions[0],
            'runner_ups': top_champions[1:] if len(top_champions) > 1 else []
        }
