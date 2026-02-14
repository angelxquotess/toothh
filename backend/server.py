"""
========================================
🐉 TOOTHLESS Dashboard API v3.0.0
========================================
FastAPI backend per la dashboard del bot Discord Toothless
"""

import os
import json
import uuid
import httpx
from datetime import datetime, timezone
from pathlib import Path
from fastapi import FastAPI, HTTPException, Request, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="Toothless Dashboard API", version="3.0.0")
api_router = APIRouter(prefix="/api")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurazione Discord
CLIENT_ID = os.environ.get("CLIENT_ID", "")
CLIENT_SECRET = os.environ.get("CLIENT_SECRET", "")
TOKEN = os.environ.get("TOKEN", "")
DASHBOARD_URL = os.environ.get("DASHBOARD_URL", "")

# Data storage (JSON files)
DATA_PATH = ROOT_DIR / "data"
DATA_PATH.mkdir(exist_ok=True)

# Load/Save JSON helpers
def load_json(filename: str, default=None):
    filepath = DATA_PATH / filename
    if filepath.exists():
        try:
            return json.loads(filepath.read_text())
        except:
            pass
    return default if default is not None else {}

def save_json(filename: str, data):
    filepath = DATA_PATH / filename
    filepath.write_text(json.dumps(data, indent=2))

# Initialize data
welcome_data = load_json("welcome.json")
log_data = load_json("log.json")
tickets_data = load_json("tickets.json")
level_settings_data = load_json("levelSettings.json")
economy_data = load_json("economy.json")
levels_data = load_json("levels.json")

# Pydantic models
class WelcomerSettings(BaseModel):
    enabled: bool = True
    channelId: Optional[str] = ""
    message: Optional[str] = ""
    embed: Optional[Dict[str, Any]] = None
    roleId: Optional[str] = ""
    leaveEnabled: bool = False
    leaveMessage: Optional[str] = ""

class LogSettings(BaseModel):
    enabled: bool = True
    channelId: Optional[str] = ""

class TicketSettings(BaseModel):
    enabled: bool = True
    categoryId: Optional[str] = ""
    supportRoleId: Optional[str] = ""
    welcomeMessage: Optional[str] = ""

class LevelSettings(BaseModel):
    enabled: bool = True
    announceChannelId: Optional[str] = ""
    xpPerMessage: Optional[Dict[str, int]] = None

# Health check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "toothless-dashboard", "version": "3.0.0"}

# Discord OAuth2
@api_router.get("/auth/discord")
async def get_discord_auth_url(request: Request):
    # Use frontend URL from environment or request origin
    frontend_url = DASHBOARD_URL or str(request.base_url).rstrip('/')
    redirect_uri = f"{frontend_url}/callback"
    scope = "identify guilds"
    url = f"https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={redirect_uri}&response_type=code&scope={scope}"
    return {"url": url}

@api_router.post("/auth/callback")
async def auth_callback(request: Request):
    data = await request.json()
    code = data.get("code")
    
    if not code:
        raise HTTPException(status_code=400, detail="Code required")
    
    if not CLIENT_ID or not CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Discord credentials not configured")
    
    frontend_url = DASHBOARD_URL or str(request.base_url).rstrip('/')
    redirect_uri = f"{frontend_url}/callback"
    
    async with httpx.AsyncClient() as client:
        # Exchange code for token
        token_response = await client.post(
            "https://discord.com/api/oauth2/token",
            data={
                "client_id": CLIENT_ID,
                "client_secret": CLIENT_SECRET,
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        if token_response.status_code != 200:
            error_data = token_response.json()
            raise HTTPException(status_code=400, detail=error_data.get("error_description", "Token exchange failed"))
        
        token_data = token_response.json()
        access_token = token_data.get("access_token")
        
        # Get user info
        user_response = await client.get(
            "https://discord.com/api/users/@me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user = user_response.json()
        
        # Get user guilds
        guilds_response = await client.get(
            "https://discord.com/api/users/@me/guilds",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        guilds = guilds_response.json()
        
        # Filter admin guilds (permission 0x8 = Administrator)
        admin_guilds = [g for g in guilds if (int(g.get("permissions", 0)) & 0x8) == 0x8]
        
        return {
            "user": {
                "id": user.get("id"),
                "username": user.get("username"),
                "discriminator": user.get("discriminator"),
                "avatar": user.get("avatar")
            },
            "guilds": [
                {
                    "id": g.get("id"),
                    "name": g.get("name"),
                    "icon": g.get("icon"),
                    "hasBot": True  # In demo mode, show all
                }
                for g in admin_guilds
            ],
            "accessToken": access_token
        }

# Command categories with exact counts
COMMAND_CATEGORIES = {
    "moderation": {"name": "Moderazione", "emoji": "🛡️", "color": "#ED4245", "count": 11},
    "economy": {"name": "Economia", "emoji": "💰", "color": "#FFD700", "count": 12},
    "fun": {"name": "Fun", "emoji": "🎮", "color": "#9B59B6", "count": 12},
    "utility": {"name": "Utility", "emoji": "🔧", "color": "#3498DB", "count": 13},
    "tickets": {"name": "Tickets", "emoji": "🎫", "color": "#E91E63", "count": 5},
    "giveaway": {"name": "Giveaway", "emoji": "🎉", "color": "#FF69B4", "count": 3},
    "levels": {"name": "Livelli", "emoji": "⭐", "color": "#FFD700", "count": 5},
    "admin": {"name": "Admin", "emoji": "⚙️", "color": "#2C3E50", "count": 8}
}

def get_total_commands():
    """Calculate total commands from categories"""
    return sum(cat["count"] for cat in COMMAND_CATEGORIES.values())

# Bot info
@api_router.get("/bot/info")
async def get_bot_info():
    return {
        "name": "Toothless",
        "avatar": None,
        "guilds": 10,
        "users": 1500,
        "commands": get_total_commands(),
        "commandCategories": COMMAND_CATEGORIES,
        "uptime": 86400000  # 24h in ms
    }

# Get command categories
@api_router.get("/bot/commands")
async def get_bot_commands():
    return {
        "total": get_total_commands(),
        "categories": COMMAND_CATEGORIES
    }

# Bot invite URL
@api_router.get("/bot/invite")
async def get_invite_url():
    permissions = "8"  # Administrator
    url = f"https://discord.com/api/oauth2/authorize?client_id={CLIENT_ID}&permissions={permissions}&scope=bot%20applications.commands"
    return {"url": url}

# Guild info - Get guild data
@api_router.get("/guild/{guild_id}")
async def get_guild(guild_id: str):
    return {
        "id": guild_id,
        "name": "Server Demo",
        "icon": None,
        "memberCount": 150,
        "channels": [
            {"id": "1", "name": "generale"},
            {"id": "2", "name": "benvenuto"},
            {"id": "3", "name": "annunci"},
            {"id": "4", "name": "moderazione-log"},
            {"id": "5", "name": "ticket-support"}
        ],
        "roles": [
            {"id": "r1", "name": "Admin", "color": "#ED4245"},
            {"id": "r2", "name": "Moderatore", "color": "#FEE75C"},
            {"id": "r3", "name": "VIP", "color": "#9B59B6"},
            {"id": "r4", "name": "Membro", "color": "#57F287"},
            {"id": "r5", "name": "Support Team", "color": "#3498DB"}
        ],
        "categories": [
            {"id": "c1", "name": "GENERALE"},
            {"id": "c2", "name": "TICKET"},
            {"id": "c3", "name": "ADMIN"}
        ],
        "settings": {
            "welcome": welcome_data.get(guild_id),
            "log": log_data.get(guild_id),
            "tickets": tickets_data.get(guild_id),
            "levels": level_settings_data.get(guild_id)
        }
    }

# Welcomer settings
@api_router.post("/guild/{guild_id}/welcomer")
async def update_welcomer(guild_id: str, settings: WelcomerSettings):
    welcome_data[guild_id] = settings.dict()
    save_json("welcome.json", welcome_data)
    return {"success": True, "data": welcome_data[guild_id]}

# Log settings
@api_router.post("/guild/{guild_id}/log")
async def update_log(guild_id: str, settings: LogSettings):
    log_data[guild_id] = settings.dict()
    save_json("log.json", log_data)
    return {"success": True, "data": log_data[guild_id]}

# Ticket settings
@api_router.post("/guild/{guild_id}/tickets")
async def update_tickets(guild_id: str, settings: TicketSettings):
    tickets_data[guild_id] = settings.dict()
    save_json("tickets.json", tickets_data)
    return {"success": True, "data": tickets_data[guild_id]}

# Level settings
@api_router.post("/guild/{guild_id}/levels")
async def update_levels(guild_id: str, settings: LevelSettings):
    level_settings_data[guild_id] = settings.dict()
    save_json("levelSettings.json", level_settings_data)
    return {"success": True, "data": level_settings_data[guild_id]}

# Economy leaderboard
@api_router.get("/guild/{guild_id}/economy/leaderboard")
async def get_economy_leaderboard(guild_id: str):
    guild_economy = economy_data.get(guild_id, {})
    leaderboard = [
        {
            "userId": uid,
            "total": data.get("wallet", 0) + data.get("bank", 0),
            "wallet": data.get("wallet", 0),
            "bank": data.get("bank", 0)
        }
        for uid, data in guild_economy.items()
    ]
    leaderboard.sort(key=lambda x: x["total"], reverse=True)
    return {"leaderboard": leaderboard[:20]}

# Levels leaderboard
@api_router.get("/guild/{guild_id}/levels/leaderboard")
async def get_levels_leaderboard(guild_id: str):
    guild_levels = levels_data.get(guild_id, {})
    leaderboard = [
        {
            "userId": uid,
            "level": data.get("level", 0),
            "xp": data.get("xp", 0),
            "totalXp": data.get("totalXp", 0)
        }
        for uid, data in guild_levels.items()
    ]
    leaderboard.sort(key=lambda x: x["totalXp"], reverse=True)
    return {"leaderboard": leaderboard[:20]}

# Include router
app.include_router(api_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
