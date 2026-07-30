from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google import genai

from app.database import get_db
from app.models.settings import Settings
from app.schemas.settings import (
    GeminiKeyRequest,
    SettingsResponse,
)
from app.auth.dependencies import get_current_user

router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"],
)


@router.get("")
def get_settings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    settings = db.query(Settings).first()

    return {
        "geminiConfigured": (
            settings is not None
            and bool(settings.gemini_api_key)
        ),
        "geminiApiKey": settings.gemini_api_key if settings else ""
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

    settings = db.query(Settings).first()

    if settings is None:
        settings = Settings(
            gemini_api_key=request.gemini_api_key,
        )
        db.add(settings)
    else:
        settings.gemini_api_key = request.gemini_api_key

    db.commit()

    return SettingsResponse(
        message="Gemini API key saved successfully.",
    )