from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.models import AnalyzeRequest
from app.ai.cluster_analyzer import analyze_cluster
from app.ai.analyzer import analyze_pod

from app.kubernetes.pods import (
    list_pods,
    get_pod_details,
    get_pod_logs,
    get_pod_events,
)

app = FastAPI(
    title="KubeSense API",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        "version": "0.1.0"
    }


@app.get("/api/v1/pods")
def get_pods():
    return {
        "pods": list_pods()
    }


@app.get("/api/v1/pods/{namespace}/{pod_name}")
def pod_details(namespace: str, pod_name: str):
    return get_pod_details(namespace, pod_name)


@app.get("/api/v1/pods/{namespace}/{pod_name}/logs")
def pod_logs(namespace: str, pod_name: str):
    return get_pod_logs(namespace, pod_name)


@app.get("/api/v1/pods/{namespace}/{pod_name}/events")
def pod_events(namespace: str, pod_name: str):
    return get_pod_events(namespace, pod_name)


@app.post("/api/v1/analyze")
def analyze(request: AnalyzeRequest):
    return analyze_pod(
        namespace=request.namespace,
        pod_name=request.pod_name,
    )

@app.post("/api/v1/analyze-cluster")
def analyze_entire_cluster():
    return analyze_cluster()