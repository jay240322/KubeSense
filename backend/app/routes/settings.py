from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.settings import Settings
from app.schemas.settings import GeminiKeyRequest, SettingsResponse

router = APIRouter(
    prefix="/api/v1/settings",
    tags=["Settings"],
)


@router.post("/gemini", response_model=SettingsResponse)
def save_gemini_key(data: GeminiKeyRequest, db: Session = Depends(get_db)):
    settings = db.query(Settings).first()

    if settings is None:
        settings = Settings(
            gemini_api_key=data.gemini_api_key
        )
        db.add(settings)
    else:
        settings.gemini_api_key = data.gemini_api_key

    db.commit()

    return {
        "message": "Gemini API key saved successfully."
    }