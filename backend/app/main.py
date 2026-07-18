from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.kubernetes.pods import (
    list_pods,
    get_pod_details,
    get_pod_logs,
)

app = FastAPI (
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
        "message":"welcome to KubeSense"
    }

@app.get("/health")
def health():
    return {
        "status":"healthy",
        "service":"KubeSense API",
        "version":"0.1.0"
    }

@app.get("/api/v1/pods")
def get_pods():
    return {
        "pods":list_pods()
    }

@app.get("/api/v1/pods/{namespace}/{pod_name}")
def pod_details(namespace: str, pod_name: str):
    return get_pod_details(namespace, pod_name)

@app.get("/api/v1/pods/{namespace}/{pod_name}/logs")
def pod_logs(namespace: str, pod_name: str):
    return get_pod_logs(namespace, pod_name)