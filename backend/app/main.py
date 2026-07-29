from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import (
    Base,
    engine,
    get_db,
    SessionLocal,
)

# SQLAlchemy Models
from app.models.user import User
from app.models.settings import Settings

# Authentication
from app.auth.router import router as auth_router
from app.auth.dependencies import get_current_user
from app.auth.bootstrap import create_default_user

# AI
from app.schemas import AnalyzeRequest
from app.ai.cluster_analyzer import analyze_cluster
from app.ai.analyzer import analyze_pod
from app.settings.router import router as settings_router

# Kubernetes
from app.kubernetes.pods import (
    list_pods,
    get_pod_details,
    get_pod_logs,
    get_pod_events,
)

# Create Database Tables & Bootstrap Default User

try:
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created successfully.")

    db = SessionLocal()

    try:
        create_default_user(db)
    finally:
        db.close()

except Exception as e:
    print(f"❌ Database connection error: {e}")

# FastAPI Application

app = FastAPI(
    title="KubeSense API",
    version="0.1.0",
)

# CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers

app.include_router(auth_router)

app.include_router(settings_router)

# Basic Endpoints

@app.get("/")
def root():
    return {
        "message": "Welcome to KubeSense"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "KubeSense API",
        "version": "0.1.0",
    }


@app.get("/db-health")
def database_health(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))

        return {
            "status": "connected",
            "database": "PostgreSQL",
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e),
        }

# Kubernetes Endpoints

@app.get("/api/v1/pods")
def get_pods():
    return {
        "pods": list_pods()
    }


@app.get("/api/v1/pods/{namespace}/{pod_name}")
def pod_details(
    namespace: str,
    pod_name: str,
):
    return get_pod_details(
        namespace,
        pod_name,
    )


@app.get("/api/v1/pods/{namespace}/{pod_name}/logs")
def pod_logs(
    namespace: str,
    pod_name: str,
):
    return get_pod_logs(
        namespace,
        pod_name,
    )


@app.get("/api/v1/pods/{namespace}/{pod_name}/events")
def pod_events(
    namespace: str,
    pod_name: str,
):
    return get_pod_events(
        namespace,
        pod_name,
    )

# AI Endpoints (Protected)

@app.post("/api/v1/analyze")
def analyze(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analyze_pod(
        db=db,
        namespace=request.namespace,
        pod_name=request.pod_name,
    )


from sqlalchemy.orm import Session

@app.post("/api/v1/analyze-cluster")
def analyze_entire_cluster(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return analyze_cluster(
        db=db,
    )