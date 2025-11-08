"""
Riot Games API Integration for League of Legends Data
"""
import os
import requests
import logging
from typing import Dict, List, Optional
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
load_dotenv()

RIOT_API_KEY = os.environ.get('RIOT_API_KEY')


class RiotAPI:
    """Handles all Riot API interactions for summoner and match data."""
    
    def __init__(self):
        self.api_key = RIOT_API_KEY
        self.headers = {"X-Riot-Token": self.api_key}
        
        # Regional routing values
        self.region_to_platform = {
            'na': 'na1',
            'euw': 'euw1',
            'eune': 'eun1',
            'kr': 'kr',
            'jp': 'jp1',
            'br': 'br1',
            'las': 'la2',
            'lan': 'la1',
            'oce': 'oc1',
            'tr': 'tr1',
            'ru': 'ru'
        }
        
        self.region_to_routing = {
            'na': 'americas',
            'br': 'americas',
            'las': 'americas',
            'lan': 'americas',
            'euw': 'europe',
            'eune': 'europe',
            'tr': 'europe',
            'ru': 'europe',
            'kr': 'asia',
            'jp': 'asia',
            'oce': 'sea'
        }
    
    def get_account_by_riot_id(self, game_name: str, tag_line: str, region: str = 'na') -> Optional[Dict]:
        """
        Get account information using Riot ID (GameName#TagLine).
        
        Args:
            game_name: The game name part of Riot ID
            tag_line: The tag line part of Riot ID (after #)
            region: Region code (na, euw, kr, etc.)
            
        Returns:
            Dictionary with account data including puuid
        """
        routing = self.region_to_routing.get(region.lower(), 'americas')
        url = f"https://{routing}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Successfully fetched account data for {game_name}#{tag_line}")
            return data
        except requests.exceptions.HTTPError as e:
            if e.response.status_code == 404:
                logger.error(f"Account {game_name}#{tag_line} not found in region {region}")
                return None
            logger.error(f"HTTP error fetching account: {e}")
            raise
        except Exception as e:
            logger.error(f"Error fetching account {game_name}#{tag_line}: {e}")
            raise
    
    def get_summoner_by_puuid(self, puuid: str, region: str = 'na') -> Optional[Dict]:
        """
        Get summoner information by PUUID.
        
        Args:
            puuid: Player's unique identifier
            region: Region code (na, euw, kr, etc.)
            
        Returns:
            Dictionary with summoner data including summonerId, level, etc.
        """
        platform = self.region_to_platform.get(region.lower(), 'na1')
        url = f"https://{platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            logger.info(f"Successfully fetched summoner data by PUUID")
            return data
        except Exception as e:
            logger.error(f"Error fetching summoner by PUUID: {e}")
            raise
    
    def get_match_ids(self, puuid: str, region: str = 'na', count: int = 20) -> List[str]:
        """
        Get list of match IDs for a player.
        
        Args:
            puuid: Player's unique identifier
            region: Region code
            count: Number of matches to retrieve (max 100)
            
        Returns:
            List of match IDs
        """
        routing = self.region_to_routing.get(region.lower(), 'americas')
        url = f"https://{routing}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids"
        params = {"count": min(count, 100)}
        
        try:
            response = requests.get(url, headers=self.headers, params=params, timeout=10)
            response.raise_for_status()
            match_ids = response.json()
            logger.info(f"Retrieved {len(match_ids)} match IDs for puuid")
            return match_ids
        except Exception as e:
            logger.error(f"Error fetching match IDs: {e}")
            raise
    
    def get_match_details(self, match_id: str, region: str = 'na') -> Optional[Dict]:
        """
        Get detailed match information.
        
        Args:
            match_id: Match identifier
            region: Region code
            
        Returns:
            Dictionary with complete match data
        """
        routing = self.region_to_routing.get(region.lower(), 'americas')
        url = f"https://{routing}.api.riotgames.com/lol/match/v5/matches/{match_id}"
        
        try:
            response = requests.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            return data
        except Exception as e:
            logger.error(f"Error fetching match {match_id}: {e}")
            return None
    
    def get_player_stats(self, game_name: str, tag_line: str, region: str = 'na', match_count: int = 20) -> Dict:
        """
        Get aggregated player statistics from recent matches.
        
        Args:
            game_name: Player's game name (before #)
            tag_line: Player's tag line (after #)
            region: Region code
            match_count: Number of recent matches to analyze
            
        Returns:
            Dictionary with aggregated statistics
        """
        # Get account info using Riot ID
        account = self.get_account_by_riot_id(game_name, tag_line, region)
        if not account:
            raise ValueError(f"Account {game_name}#{tag_line} not found")
        
        puuid = account['puuid']
        
        # Get summoner info for level
        summoner = self.get_summoner_by_puuid(puuid, region)
        if not summoner:
            raise ValueError(f"Summoner data not found for {game_name}#{tag_line}")
        
        # Get match IDs
        match_ids = self.get_match_ids(puuid, region, match_count)
        if not match_ids:
            raise ValueError("No matches found")
        
        # Aggregate stats from matches
        stats = {
            'total_games': 0,
            'wins': 0,
            'kills': 0,
            'deaths': 0,
            'assists': 0,
            'total_cs': 0,
            'vision_score': 0,
            'damage_dealt': 0,
            'damage_taken': 0,
            'gold_earned': 0,
            'wards_placed': 0,
            'wards_killed': 0,
            'total_game_duration': 0,
            'champions_played': {},
            'first_bloods': 0,
            'solo_kills': 0,
            'multikills': 0
        }
        
        for match_id in match_ids:
            match_data = self.get_match_details(match_id, region)
            if not match_data:
                continue
            
            # Find player in participants
            participant = None
            for p in match_data['info']['participants']:
                if p['puuid'] == puuid:
                    participant = p
                    break
            
            if not participant:
                continue
            
            # Aggregate stats
            stats['total_games'] += 1
            stats['wins'] += 1 if participant['win'] else 0
            stats['kills'] += participant['kills']
            stats['deaths'] += participant['deaths']
            stats['assists'] += participant['assists']
            stats['total_cs'] += participant['totalMinionsKilled'] + participant.get('neutralMinionsKilled', 0)
            stats['vision_score'] += participant.get('visionScore', 0)
            stats['damage_dealt'] += participant['totalDamageDealtToChampions']
            stats['damage_taken'] += participant['totalDamageTaken']
            stats['gold_earned'] += participant['goldEarned']
            stats['wards_placed'] += participant.get('wardsPlaced', 0)
            stats['wards_killed'] += participant.get('wardsKilled', 0)
            stats['total_game_duration'] += match_data['info']['gameDuration']
            stats['first_bloods'] += 1 if participant.get('firstBloodKill', False) else 0
            
            # Track champion diversity
            champion = participant['championName']
            stats['champions_played'][champion] = stats['champions_played'].get(champion, 0) + 1
            
            # Solo kills (kills without assists from team in small timeframe - approximated)
            if participant['kills'] > participant['assists']:
                stats['solo_kills'] += 1
            
            # Multikills
            if participant.get('doubleKills', 0) > 0 or participant.get('tripleKills', 0) > 0:
                stats['multikills'] += 1
        
        # Calculate averages
        if stats['total_games'] > 0:
            stats['avg_kills'] = round(stats['kills'] / stats['total_games'], 2)
            stats['avg_deaths'] = round(stats['deaths'] / stats['total_games'], 2)
            stats['avg_assists'] = round(stats['assists'] / stats['total_games'], 2)
            stats['avg_cs'] = round(stats['total_cs'] / stats['total_games'], 1)
            stats['avg_vision_score'] = round(stats['vision_score'] / stats['total_games'], 1)
            stats['avg_damage_dealt'] = round(stats['damage_dealt'] / stats['total_games'], 0)
            stats['avg_damage_taken'] = round(stats['damage_taken'] / stats['total_games'], 0)
            stats['avg_gold'] = round(stats['gold_earned'] / stats['total_games'], 0)
            stats['avg_wards_placed'] = round(stats['wards_placed'] / stats['total_games'], 1)
            stats['avg_game_duration'] = round(stats['total_game_duration'] / stats['total_games'] / 60, 1)  # in minutes
            stats['win_rate'] = round((stats['wins'] / stats['total_games']) * 100, 1)
            stats['kda'] = round((stats['kills'] + stats['assists']) / max(stats['deaths'], 1), 2)
            stats['champion_pool_size'] = len(stats['champions_played'])
        
        stats['summoner_name'] = f"{game_name}#{tag_line}"
        stats['game_name'] = game_name
        stats['tag_line'] = tag_line
        stats['region'] = region
        stats['puuid'] = puuid
        stats['summoner_level'] = summoner.get('summonerLevel', 0)
        
        logger.info(f"Successfully aggregated stats for {game_name}#{tag_line}: {stats['total_games']} games")
        return stats
