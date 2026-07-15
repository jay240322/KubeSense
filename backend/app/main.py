from fastapi import FastAPI

app = FastAPI (
    title="KubeSense API",
    version="0.1.0"
)

@app.get("/health")
def dealth():
    return {
        "status":"healthy",
        "service":"KubeSense API",
        "version":"0.1.0"
    }