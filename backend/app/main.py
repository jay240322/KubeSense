from fastapi import FastAPI
from app.kubernetes.pods import list_pods
from fastapi.middleware.cors import CORSMiddleware

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