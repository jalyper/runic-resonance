# Runic Resonance - Project Notes

## Inspiration

Every League of Legends player has that one champion that just *feels right* - the one where everything clicks. But what if your playstyle could reveal which champion you truly embody, even if you've never played them?

We were inspired by personality tests like Myers-Briggs and the Enneagram, but reimagined for League of Legends. Instead of answering questions, your gameplay speaks for itself. Every ward placed, every risky engage, every comeback win - these moments reveal your true essence.

The "trait farming" concept came from wanting to influence player behavior positively. What if players could actively work toward embodying their favorite champion's traits? What if chasing "The Fearless" trait made you a more aggressive, confident player? We wanted to gamify personal growth and make reflection fun.

## What it does

**Runic Resonance** is an AI-powered personality analysis tool for League of Legends players that:

1. **Analyzes Match History**: Pulls your last 20 ranked games via Riot Games API and extracts behavioral patterns beyond just K/D/A - vision score, objective control, comeback potential, solo play vs team play, and more.

2. **Calculates 10 Personality Traits**: Scores you on 10 lore-based traits (The Protector, The Tactician, The Fearless, etc.) using realistic, balanced thresholds that reward good play without being impossible.

3. **Discovers Your Spirit Champion**: Each champion has 3 "trait slots" that unlock when you score 7+ on matching traits. The more slots filled, the stronger your resonance. Champions you actually play get bonus resonance, creating a satisfying feedback loop.

4. **Generates AI Narratives**: Uses AWS Bedrock (Claude 3.5 Sonnet) to craft mystical, personalized readings that weave your stats into epic Runeterra lore.

5. **Creates Beautiful Artwork**: Features AI-generated trait artwork (Amazon Titan Image Generator) in Arcane's animated style, making each unlocked slot visually stunning.

## How we built it

**Backend (Python + FastAPI):**
- Riot Games API integration handling the new Riot ID format (GameName#TAG)
- Custom personality engine calculating 10 traits from 20+ behavioral metrics
- AWS Bedrock integration for both text (Claude 3.5 Sonnet) and image generation (Titan Image Generator v2)
- MongoDB for storing analysis results
- Sophisticated champion matching algorithm with 3-slot system and play-rate multipliers

**Frontend (React + Tailwind CSS):**
- Beautiful mystical UI with Inter + Rajdhani fonts
- Animated loading states with Runic imagery
- Interactive trait slots displaying AI-generated artwork
- Perfect Resonance achievement system for 3/3 slots
- Comprehensive results page showing top 3 champion matches

**AI Integration:**
- **Text Generation**: Claude 3.5 Sonnet generates 300-350 word mystical narratives weaving player stats into Runeterra lore
- **Image Generation**: Titan Image Generator v2 creates 10 unique 512x512px Arcane-style trait artworks with custom prompts for each personality trait

**Key Technical Decisions:**
- Balanced all 10 traits through iterative testing with real player profiles
- Implemented champion play-rate multipliers to break ties and reward mains
- Created fallback systems for both AI generation and image loading
- Used consistent seeding for trait images to maintain visual identity

## Challenges we ran into

**1. Riot API Changes:**
The old summoner-by-name endpoint was deprecated. We had to pivot to the new ACCOUNT-V1 API using Riot IDs (GameName#TAG), which required restructuring our entire data flow mid-development.

**2. Trait Balancing Hell:**
Initial trait formulas were wildly unbalanced. "The Adaptive" required 10+ champions for a 5/10 score (impossible for most players!), while "The Disciplined" gave 10/10 for basic CS. We spent hours testing with different player profiles (support mains, assassin mains, one-tricks) to find realistic thresholds.

**3. Multi-Way Ties:**
Players with similar trait scores kept tying for spirit champion, making results feel random. We solved this by heavily weighting games played - if you main a champion, that should matter! This made results much more satisfying.

**4. AWS Content Filters:**
Our initial prompts for "The Disciplined" (warrior training) and "The Healer" (person healing) got blocked by AWS content filters. We pivoted to more abstract, symbolic imagery while maintaining artistic quality.

**5. Cognitive Load:**
Early UI had too much information at once. We added progressive disclosure (collapsible trait lists, hover tooltips) and visual hierarchy (Perfect Resonance banners, trait artwork) to guide attention.

## Accomplishments that we're proud of

🏆 **The "Trait Farming" Mechanic**: Creating a system where players actively want to improve specific behaviors to unlock champions. This could genuinely influence how people play!

🎨 **AI-Generated Artwork**: Successfully generated 10 unique, beautiful trait images in Arcane style using AWS Bedrock. Each one captures the essence of its trait perfectly.

⚖️ **Balanced Trait System**: After extensive testing, all 10 traits are achievable, fair, and meaningful across different playstyles. Support mains and assassin mains both get satisfying results.

✨ **Perfect Resonance**: The achievement system for filling all 3 slots feels genuinely epic and gives players a clear goal to work toward.

📊 **Realistic Thresholds**: Using actual player data to set benchmarks (3.0 KDA is good, 60% win rate is elite) rather than arbitrary numbers that don't match reality.

🎭 **Lore Integration**: Every trait and champion mapping is based on actual League of Legends lore, not just game mechanics. Braum is The Protector because of his heart and shield, not just his kit.

## What we learned

**Technical:**
- AWS Bedrock's content filters require abstract, symbolic prompts for sensitive topics
- Riot's new API structure with routing values (americas, europe, asia) and PUUID system
- The importance of iterative balancing with real data - spreadsheets and player profiles were essential
- Trait calculation is harder than it looks - every formula needs careful weighting and normalization

**Design:**
- Visual feedback is crucial - the slot system only clicked when we added beautiful artwork and hover states
- Progressive disclosure prevents cognitive overload - hiding complexity until needed
- Typography matters - switching to display fonts made everything feel more premium
- Achievement moments (Perfect Resonance) create emotional peaks that players remember

**Game Psychology:**
- Players care deeply about their mains - ignoring champion play rate made results feel "wrong"
- Positive reinforcement works - framing traits as achievements rather than deficits
- Mystery and discovery drive engagement - the loading screen build anticipation
- People want *both* accuracy and aspiration - good balance between current skill and potential

**AI Integration:**
- Claude 3.5 Sonnet is incredible at generating mystical, lore-rich narratives when given structured data
- Image generation needs semantic prompts, not mechanical descriptions
- Caching AI-generated content (trait images) makes the app fast and cheap to run
- Fallback strategies are essential - AI services can fail

## What's next for Runic Resonance

**Short-term (Post-Hackathon):**
- 🎮 **ARAM & Normal Games Support**: Currently only analyzes ranked games
- 📊 **Historical Tracking**: See how your traits evolve over time, seasonal comparisons
- 🏆 **Achievement Badges**: Unlock special badges for rare combinations (3 perfect resonances, etc.)
- 🎨 **Custom Champion Artwork**: AI-generated portraits of YOUR spirit champion
- 📱 **Mobile Optimization**: Better responsive design for phone users

**Medium-term:**
- 🤝 **Duo Synergy Analysis**: Compare two players and see which champions complement each other
- 🎯 **Trait Recommendations**: "To unlock Yasuo, increase your Wanderer score by playing more solo lanes"
- 📈 **Progress Tracking**: Dashboard showing trait improvements week-over-week
- 🌍 **Regional Leaderboards**: See who has the highest resonance scores by region
- 🎭 **Role-Specific Analysis**: Different trait weights for ADC vs Support vs Jungle

**Long-term Vision:**
- 💬 **AI Coach**: "Your Protector score is low - try warding more aggressively"
- 🎪 **Social Features**: Share your results, challenge friends to trait competitions
- 🎬 **Match Replay Integration**: Highlight specific moments that showcase your traits
- 🌟 **Skin Recommendations**: Based on your personality, suggest skins you'd love
- 🎲 **Champion Recommendations**: Suggest new champions based on unfilled trait combinations

**Moonshot:**
- 🧬 **Cross-Game Personality**: Extend to other Riot games (Valorant, TFT, Wild Rift)
- 🎓 **Research Partnership**: Work with behavioral psychologists to validate personality models
- 🏅 **In-Game Integration**: Imagine if this was an official Riot feature with special rewards

---

**The ultimate goal**: Make Runic Resonance a tool that helps players understand themselves better, discover new champions they'll love, and actively work on becoming the player they want to be - all while having fun exploring the mystical world of Runeterra.

*May the Runes guide your path, Summoner.* ✨
