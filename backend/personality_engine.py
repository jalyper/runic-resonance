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
        "The Protector": "Based on: Assist/Kill ratio (2.0+ is good), Damage taken (20k+ is good)",
        "The Tactician": "Based on: Vision score (40+ is good), Ward placement (12+ is good)",
        "The Disciplined": "Based on: CS per game (200+ is good), Gold earned (11k+ is good)",
        "The Fearless": "Based on: Kill participation (12+ per game), First blood rate",
        "The Resilient": "Based on: Low death rate (under 4.5), Win rate (55%+)",
        "The Wanderer": "Based on: Solo kill frequency, Kill-focused playstyle",
        "The Adaptive": "Based on: Champion pool size (5+ champs is good)",
        "The Enlightened": "Based on: KDA ratio (3.0+ is good), Win rate (55%+ is good)",
        "The Relentless": "Based on: Total kill participation (15+ per game), Multikills",
        "The Healer": "Based on: Assist ratio (high assists), Team-enabling plays"
    }
    
    # Champion mappings for each trait (based on lore, not mechanics)
    TRAIT_CHAMPIONS = {
        "The Protector": ["Braum", "Taric", "Shen", "Galio", "Poppy", "Alistar", "Leona"],
        "The Tactician": ["Swain", "Twisted Fate", "Gangplank", "Ryze", "Zilean", "Azir", "Viktor"],
        "The Disciplined": ["Garen", "Jarvan IV", "Fiora", "Xin Zhao", "Irelia", "Camille", "Yasuo"],
        "The Fearless": ["Leona", "Pantheon", "Darius", "Sett", "Olaf", "Tryndamere", "Draven"],
        "The Resilient": ["Sion", "Ornn", "Mundo", "Nasus", "Maokai", "Volibear", "Trundle"],
        "The Wanderer": ["Yasuo", "Taliyah", "Kayn", "Jhin", "Rakan", "Ekko", "Ezreal"],
        "The Adaptive": ["Neeko", "Sylas", "LeBlanc", "Zoe", "Seraphine", "Shaco", "Kindred"],
        "The Enlightened": ["Karma", "Jhin", "Ivern", "Bard", "Soraka", "Sona", "Lux"],
        "The Relentless": ["Viego", "Kalista", "Kled", "Aatrox", "Mordekaiser", "Tryndamere", "Warwick"],
        "The Healer": ["Soraka", "Shen", "Janna", "Lulu", "Nami", "Yuumi", "Sona"]
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
            "lore": "Like Swain's ravens, your vision extends across Runeterra, anticipating every move",
            "data_source": self.TRAIT_DATA_SOURCES["The Tactician"]
        })
        
        # 3. The Disciplined - CS consistency, gold efficiency, mechanical precision
        disciplined_score = self._calculate_disciplined(stats)
        traits.append({
            "name": "The Disciplined",
            "score": disciplined_score,
            "description": "Unwavering dedication to perfecting your craft through endless practice",
            "champions": self.TRAIT_CHAMPIONS["The Disciplined"],
            "lore": "Like Garen's devotion to Demacia, your discipline never wavers",
            "data_source": self.TRAIT_DATA_SOURCES["The Disciplined"]
        })
        
        # 4. The Fearless - Fight participation, first bloods, aggression
        fearless_score = self._calculate_fearless(stats)
        traits.append({
            "name": "The Fearless",
            "score": fearless_score,
            "description": "Warrior who charges into battle without hesitation or doubt",
            "champions": self.TRAIT_CHAMPIONS["The Fearless"],
            "lore": "Like Leona basking in the sun's glory, you embrace combat with radiant courage",
            "data_source": self.TRAIT_DATA_SOURCES["The Fearless"]
        })
        
        # 5. The Resilient - Damage taken, deaths avoided, comeback potential
        resilient_score = self._calculate_resilient(stats)
        traits.append({
            "name": "The Resilient",
            "score": resilient_score,
            "description": "Indomitable spirit that endures through the harshest trials",
            "champions": self.TRAIT_CHAMPIONS["The Resilient"],
            "lore": "Like Sion who conquered death itself, you refuse to stay down",
            "data_source": self.TRAIT_DATA_SOURCES["The Resilient"]
        })
        
        # 6. The Wanderer - Solo plays, roaming patterns, independence
        wanderer_score = self._calculate_wanderer(stats)
        traits.append({
            "name": "The Wanderer",
            "score": wanderer_score,
            "description": "Lone traveler following their own path across the Rift",
            "champions": self.TRAIT_CHAMPIONS["The Wanderer"],
            "lore": "Like Yasuo's journey for redemption, you forge your own destiny",
            "data_source": self.TRAIT_DATA_SOURCES["The Wanderer"]
        })
        
        # 7. The Adaptive - Champion diversity, versatile builds, flexible play
        adaptive_score = self._calculate_adaptive(stats)
        traits.append({
            "name": "The Adaptive",
            "score": adaptive_score,
            "description": "Shapeshifter who thrives by embracing change and variety",
            "champions": self.TRAIT_CHAMPIONS["The Adaptive"],
            "lore": "Like Neeko who becomes anyone, you master every form and strategy",
            "data_source": self.TRAIT_DATA_SOURCES["The Adaptive"]
        })
        
        # 8. The Enlightened - High KDA, smart decisions, wisdom in combat
        enlightened_score = self._calculate_enlightened(stats)
        traits.append({
            "name": "The Enlightened",
            "score": enlightened_score,
            "description": "Seeker of perfect balance between aggression and restraint",
            "champions": self.TRAIT_CHAMPIONS["The Enlightened"],
            "lore": "Like Karma who weighs every action, you achieve harmony through wisdom",
            "data_source": self.TRAIT_DATA_SOURCES["The Enlightened"]
        })
        
        # 9. The Relentless - Kill participation, never giving up, persistence
        relentless_score = self._calculate_relentless(stats)
        traits.append({
            "name": "The Relentless",
            "score": relentless_score,
            "description": "Unstoppable force bound by singular purpose and determination",
            "champions": self.TRAIT_CHAMPIONS["The Relentless"],
            "lore": "Like Viego's endless pursuit, you never rest until victory is yours",
            "data_source": self.TRAIT_DATA_SOURCES["The Relentless"]
        })
        
        # 10. The Healer - Support patterns, enabler, team-focused
        healer_score = self._calculate_healer(stats)
        traits.append({
            "name": "The Healer",
            "score": healer_score,
            "description": "Guardian spirit who mends wounds and lifts fallen allies",
            "champions": self.TRAIT_CHAMPIONS["The Healer"],
            "lore": "Like Soraka who sacrifices herself for others, you embody compassion",
            "data_source": self.TRAIT_DATA_SOURCES["The Healer"]
        })
        
        return traits
    
    def _normalize_score(self, value: float, min_val: float = 1, max_val: float = 10) -> int:
        """Normalize a score to 1-10 range."""
        normalized = max(min_val, min(max_val, value))
        return round(normalized)
    
    def _calculate_protector(self, stats: Dict) -> int:
        """
        Calculate Protector trait score.
        Balanced for: 5/10 = baseline support, 7/10 = good support, 10/10 = elite
        """
        assists_ratio = stats.get('avg_assists', 0) / max(stats.get('avg_kills', 1), 1)
        damage_taken = stats.get('avg_damage_taken', 0) / 1000
        
        # Score from assists: 1.0 ratio = 5pts, 2.0 = 7pts, 4.0 = 10pts
        assist_score = 5 + (assists_ratio - 1.0) * 1.5
        
        # Score from tanking: 15k dmg = 5pts, 20k = 7pts, 30k = 10pts
        tank_score = 5 + (damage_taken - 15) / 5
        
        # Average the two
        score = (assist_score * 0.7) + (tank_score * 0.3)
        return self._normalize_score(score)
    
    def _calculate_tactician(self, stats: Dict) -> int:
        """
        Calculate Tactician trait score.
        Balanced: 5/10 = 25 vision, 7/10 = 40 vision, 10/10 = 60+ vision
        """
        vision = stats.get('avg_vision_score', 0)
        wards = stats.get('avg_wards_placed', 0)
        
        # Vision score is primary (60%): 25 = 5pts, 40 = 7pts, 60 = 10pts
        vision_score = 5 + (vision - 25) / 7
        
        # Wards placed is secondary (40%): 8 = 5pts, 12 = 7pts, 20 = 10pts
        ward_score = 5 + (wards - 8) / 3
        
        score = (vision_score * 0.6) + (ward_score * 0.4)
        return self._normalize_score(score)
    
    def _calculate_disciplined(self, stats: Dict) -> int:
        """
        Calculate Disciplined trait score.
        Balanced: 5/10 = 150cs, 7/10 = 200cs, 10/10 = 250+ cs
        """
        cs = stats.get('avg_cs', 0)
        gold = stats.get('avg_gold', 0)
        
        # CS is primary (70%): 150 = 5pts, 200 = 7pts, 250 = 10pts
        cs_score = 5 + (cs - 150) / 20
        
        # Gold efficiency (30%): 9k = 5pts, 11k = 7pts, 13k = 10pts  
        gold_score = 5 + (gold - 9000) / 800
        
        score = (cs_score * 0.7) + (gold_score * 0.3)
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
        """
        Calculate Adaptive trait score.
        Balanced: 5/10 = 3 champs, 7/10 = 5 champs, 10/10 = 8+ champs
        More forgiving for players with smaller pools
        """
        champion_diversity = stats.get('champion_pool_size', 1)
        
        # 1 champ = 1pt, 3 champs = 5pts, 5 champs = 7pts, 8 champs = 10pts
        if champion_diversity <= 1:
            score = 1
        else:
            score = 1 + (champion_diversity - 1) * 1.3
        
        return self._normalize_score(score)
    
    def _calculate_enlightened(self, stats: Dict) -> int:
        """
        Calculate Enlightened trait score.
        Rebalanced for realistic thresholds:
        - 5/10: Average (50% WR, 2.0 KDA)
        - 7/10: Good (55% WR, 3.5 KDA) - unlocks slot
        - 9/10: Very Good (60% WR, 4.5 KDA)
        - 10/10: Elite (65% WR, 5+ KDA)
        """
        kda = stats.get('kda', 2)
        win_rate = stats.get('win_rate', 50)
        
        # Scale KDA: 2.0 = baseline, each 0.5 KDA above = +1 point
        kda_score = 5 + ((kda - 2.0) * 2)
        
        # Scale Win Rate: 50% = baseline, each 5% above = +1 point
        wr_score = 5 + ((win_rate - 50) / 5)
        
        # Weighted average: 60% KDA, 40% Win Rate
        score = (kda_score * 0.6) + (wr_score * 0.4)
        
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
        
        # Apply play-rate multiplier and track games played
        champions_played = stats.get('champions_played', {})
        total_games = stats.get('total_games', 1)
        
        for champion in champion_scores:
            games_played = champions_played.get(champion, 0)
            play_rate = (games_played / total_games) * 100
            
            champion_scores[champion]['games_played'] = games_played
            champion_scores[champion]['play_rate'] = play_rate
            
            if games_played > 0:
                # Significant bonus for actually playing the champion
                # Scale: 1 game = +5, 5 games = +25, 10 games = +50
                play_bonus_points = min(50, games_played * 5)
                champion_scores[champion]['total_score'] += play_bonus_points
                
                if play_rate >= 25:
                    champion_scores[champion]['play_bonus'] = 'High'
                elif play_rate >= 15:
                    champion_scores[champion]['play_bonus'] = 'Medium'
                elif play_rate >= 5:
                    champion_scores[champion]['play_bonus'] = 'Low'
                else:
                    champion_scores[champion]['play_bonus'] = 'Played'
            else:
                champion_scores[champion]['play_bonus'] = 'None'
        
        # Sort all champions by slots filled, then total score, then games played
        sorted_champions = sorted(
            champion_scores.items(), 
            key=lambda x: (
                x[1]['slots_filled'],           # Primary: Most slots filled
                x[1]['total_score'],            # Secondary: Highest trait scores
                x[1].get('games_played', 0)     # Tertiary: Most games played (tie-breaker)
            ), 
            reverse=True
        )
        
        # Get top 3 champions
        top_champions = []
        for i, (champ, data) in enumerate(sorted_champions[:3]):
            # Calculate resonance based on slots filled + trait strength + play rate
            slots_filled = data['slots_filled']
            
            # Base resonance depends on slots filled:
            # 1/3 slots = max 40% (weak connection)
            # 2/3 slots = max 70% (strong connection)
            # 3/3 slots = 70-100% (only perfect resonance can hit 100%)
            if slots_filled == 1:
                base_resonance = min(40, (data['total_score'] / 30) * 40)
            elif slots_filled == 2:
                base_resonance = 40 + min(30, (data['total_score'] / 50) * 30)
            else:  # 3/3 slots
                base_resonance = 70 + min(30, (data['total_score'] / 60) * 30)
            
            resonance = min(100, base_resonance)
            
            top_champions.append({
                'rank': i + 1,
                'champion': champ,
                'slots_filled': data['slots_filled'],
                'matching_traits': data['traits'],
                'trait_details': data['trait_details'],
                'resonance_strength': resonance,
                'play_bonus': data.get('play_bonus', 'None'),
                'games_played': data.get('games_played', 0),
                'play_rate': data.get('play_rate', 0)
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
