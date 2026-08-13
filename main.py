from contextlib import asynccontextmanager
import asyncio
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .state import AppState
from .simulator import IndustrialSimulator
from .routes import router_for as api_router
from .websockets import router_for as ws_router

settings = get_settings()
logging.basicConfig(level=getattr(logging, settings.log_level.upper(), logging.INFO))

state = AppState(settings.telemetry_history_limit)
simulator = IndustrialSimulator(state, seed=42, interval=1.0)

@asynccontextmanager
async def lifespan(app: FastAPI):
    task = asyncio.create_task(simulator.run())
    yield
    task.cancel()
    try:
        await task
    except asyncio.CancelledError:
        pass

app = FastAPI(
    title="ForgeTwin AI Backend",
    version="1.0.0",
    description="Real device telemetry ingestion and clearly-labelled industrial simulation.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

app.include_router(api_router(state))
app.include_router(ws_router(state))

@app.get("/")
async def root():
    return {
        "name": "ForgeTwin AI",
        "service": "backend",
        "docs": "/docs",
        "health": "/api/v1/health",
        "industrial_data_is_simulated": True,
    }
