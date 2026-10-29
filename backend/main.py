from ai_routes import router as ai_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from safety_routes import router as safety_router
from crack_routes import router as crack_router
from planning_routes import router as planning_router
from valuation_routes import router as valuation_router
from site_assistant_routes import router as site_assistant_router
from weather_routes import router as weather_router

app = FastAPI(
    title="AI Construction Intelligence Platform",
    description="AI-powered construction analysis and planning API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(safety_router)
app.include_router(ai_router)
app.include_router(crack_router)
app.include_router(planning_router)
app.include_router(valuation_router)
app.include_router(site_assistant_router)
app.include_router(weather_router)

@app.get("/")
def home():
    return {
        "message": "Construction Intelligence API is running!",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}
