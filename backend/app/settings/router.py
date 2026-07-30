from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google import genai
import uuid

from app.database import get_db
from app.schemas.settings import (
    GeminiKeyRequest,
    SettingsResponse,
)
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"],
)

# Random instance ID generated fresh on every server startup
SERVER_INSTANCE_ID = str(uuid.uuid4())


@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return {
        "geminiConfigured": False,
        "geminiApiKey": "",
        "serverInstanceId": SERVER_INSTANCE_ID
    }


@router.post("/gemini", response_model=SettingsResponse)
def save_gemini_key(
    request: GeminiKeyRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    try:
        client = genai.Client(
            api_key=request.gemini_api_key,
        )

        client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents="Reply with OK",
        )

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid Gemini API key.",
        )

    return SettingsResponse(
        message="Gemini API key validated successfully.",
    )