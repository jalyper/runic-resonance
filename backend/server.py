from fastapi import FastAPI, APIRouter, HTTPException, status
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
import uuid
from datetime import datetime, timezone

from riot_api import RiotAPI
from personality_engine import PersonalityEngine
from bedrock_ai import BedrockAI


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(
    title="Runic Resonance API",
    description="Discover your League of Legends spirit champion through AI-powered personality analysis",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Initialize services
riot_api = RiotAPI()
personality_engine = PersonalityEngine()
bedrock_ai = BedrockAI()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


# Define Models
class AnalysisRequest(BaseModel):
    """Request model for personality analysis."""
    riot_id: str = Field(..., description="Riot ID in format GameName#TagLine")
    region: str = Field(default="na", description="Region code (na, euw, kr, etc.)")
    match_count: int = Field(default=50, ge=5, le=100, description="Number of recent matches to analyze")


class TraitData(BaseModel):
    """Individual personality trait data."""
    name: str
    score: int
    description: str
    champions: List[str]
    lore: str
    data_source: str


class TraitDetail(BaseModel):
    """Detailed trait information for slot matching."""
    name: str
    score: int
    lore: str


class ChampionResonance(BaseModel):
    """Individual champion resonance data."""
    rank: int
    champion: str
    slots_filled: int
    matching_traits: List[str]
    trait_details: List[TraitDetail]
    resonance_strength: float
    play_bonus: str
    games_played: int
    play_rate: float


class SpiritChampion(BaseModel):
    """Spirit champion resonance data with runner-ups."""
    primary: ChampionResonance
    runner_ups: List[ChampionResonance]


class AnalysisResponse(BaseModel):
    """Complete personality analysis response."""
    summoner_name: str
    region: str
    summoner_level: int
    games_analyzed: int
    win_rate: float
    kda: float
    traits: List[TraitData]
    spirit_champion: SpiritChampion
    narrative: str
    champions_played: Dict[str, int]
    analysis_id: str
    timestamp: datetime


class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# API Routes
@api_router.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "operational",
        "service": "Runic Resonance",
        "message": "The Runes await your call, Summoner"
    }


@api_router.post("/analyze", response_model=AnalysisResponse)
async def analyze_summoner(request: AnalysisRequest):
    """
    Analyze a summoner's personality and discover their spirit champion.
    
    This endpoint:
    1. Fetches match data from Riot API
    2. Calculates 10 personality traits
    3. Determines spirit champion resonance
    4. Generates AI narrative using AWS Bedrock
    5. Stores results in database
    """
    try:
        logger.info(f"Starting analysis for {request.riot_id} in {request.region}")
        
        # Parse Riot ID (GameName#TagLine)
        if '#' not in request.riot_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid Riot ID format. Use GameName#TagLine (e.g., Player#NA1)"
            )
        
        game_name, tag_line = request.riot_id.split('#', 1)
        
        # Step 1: Fetch player stats from Riot API
        try:
            stats = riot_api.get_player_stats(
                game_name=game_name,
                tag_line=tag_line,
                region=request.region,
                match_count=request.match_count
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Account not found: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Riot API error: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to fetch data from Riot API. Please try again later."
            )
        
        # Step 2: Calculate personality traits
        traits = personality_engine.calculate_traits(stats)
        logger.info(f"Calculated {len(traits)} traits for {stats['summoner_name']}")
        
        # Step 3: Determine spirit champion
        spirit_champion = personality_engine.determine_spirit_champion(traits, stats)
        logger.info(f"Spirit champion: {spirit_champion['primary']['champion']} ({spirit_champion['primary']['resonance_strength']:.0f}% resonance)")
        
        # Step 4: Generate AI narrative
        try:
            narrative = bedrock_ai.generate_runic_narrative(
                summoner_name=stats['summoner_name'],
                traits=traits,
                spirit_champion=spirit_champion['primary'],
                stats=stats
            )
        except Exception as e:
            logger.error(f"Bedrock AI error: {e}")
            # Use fallback narrative
            narrative = f"""The Runes shimmer with recognition, {stats['summoner_name']}. 
            Your spirit resonates with {spirit_champion['primary']['champion']}, a champion of legend. 
            Through {stats['total_games']} battles, you have forged your path with determination and skill."""
        
        # Step 5: Create response
        analysis_id = str(uuid.uuid4())
        timestamp = datetime.now(timezone.utc)
        
        response = AnalysisResponse(
            summoner_name=stats['summoner_name'],
            region=request.region,
            summoner_level=stats['summoner_level'],
            games_analyzed=stats['total_games'],
            win_rate=stats['win_rate'],
            kda=stats['kda'],
            traits=[TraitData(**trait) for trait in traits],
            spirit_champion=SpiritChampion(**spirit_champion),
            narrative=narrative,
            champions_played=stats.get('champions_played', {}),
            analysis_id=analysis_id,
            timestamp=timestamp
        )
        
        # Step 6: Store in database
        try:
            doc = response.model_dump()
            doc['timestamp'] = doc['timestamp'].isoformat()
            await db.analyses.insert_one(doc)
            logger.info(f"Saved analysis {analysis_id} to database")
        except Exception as e:
            logger.error(f"Database error: {e}")
            # Continue even if DB save fails
        
        logger.info(f"Analysis complete for {stats['summoner_name']}")
        return response
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error during analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected error occurred during analysis"
        )


@api_router.get("/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Retrieve a previously completed analysis by ID."""
    try:
        analysis = await db.analyses.find_one({"analysis_id": analysis_id}, {"_id": 0})
        
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        # Convert ISO timestamp back to datetime
        if isinstance(analysis['timestamp'], str):
            analysis['timestamp'] = datetime.fromisoformat(analysis['timestamp'])
        
        return analysis
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving analysis: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error retrieving analysis"
        )


@api_router.get("/champions")
async def get_champions_reference():
    """Get reference data for all trait-champion mappings."""
    return {
        "traits": personality_engine.TRAIT_CHAMPIONS
    }


@api_router.get("/trait-images/{trait_name}")
async def get_trait_image(trait_name: str):
    """
    Get or generate artistic image for a specific trait.
    Returns base64 encoded image.
    """
    from image_generator import TraitImageGenerator, TRAIT_IMAGE_FALLBACKS
    from fastapi.responses import Response
    import base64
    
    # Try to load from static files first
    import os
    safe_name = trait_name.replace(' ', '_').replace('The_', '').lower()
    static_path = f"/app/backend/static/traits/{safe_name}.png"
    
    if os.path.exists(static_path):
        with open(static_path, 'rb') as f:
            image_data = f.read()
        return Response(content=image_data, media_type="image/png")
    
    # If not cached, generate on-demand (expensive!)
    try:
        generator = TraitImageGenerator()
        base64_image = generator.generate_trait_image(trait_name, static_path)
        
        if base64_image:
            image_data = base64.b64decode(base64_image)
            return Response(content=image_data, media_type="image/png")
    except Exception as e:
        logger.error(f"Error generating trait image: {e}")
    
    # Fallback to placeholder
    from fastapi.responses import RedirectResponse
    fallback_url = TRAIT_IMAGE_FALLBACKS.get(trait_name, "https://via.placeholder.com/400")
    return RedirectResponse(url=fallback_url)


@api_router.get("/health")
async def health_check():
    """Comprehensive health check for all services."""
    health_status = {
        "api": "healthy",
        "database": "unknown",
        "riot_api": "unknown",
        "bedrock_ai": "unknown"
    }
    
    # Check database
    try:
        await db.command("ping")
        health_status["database"] = "healthy"
    except:
        health_status["database"] = "unhealthy"
    
    # Check Riot API
    try:
        if riot_api.api_key:
            health_status["riot_api"] = "configured"
        else:
            health_status["riot_api"] = "not configured"
    except:
        health_status["riot_api"] = "error"
    
    # Check Bedrock
    try:
        if bedrock_ai.client and bedrock_ai.model_id:
            health_status["bedrock_ai"] = "configured"
        else:
            health_status["bedrock_ai"] = "not configured"
    except:
        health_status["bedrock_ai"] = "error"
    
    return health_status


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler."""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred"}
    )


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()