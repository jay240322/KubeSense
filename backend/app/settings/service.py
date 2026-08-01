from sqlalchemy.orm import Session

from app.models.settings import Settings


def get_gemini_api_key(db: Session) -> str:
    settings = db.query(Settings).first()

    if settings is None or not settings.gemini_api_key:
        raise Exception("Gemini API key is not configured.")

    return settings.gemini_api_key