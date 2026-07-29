from sqlalchemy.orm import Session

from app.ai.client import (
    get_gemini_client,
    GEMINI_MODEL,
)

from app.settings.service import get_gemini_api_key


def generate_ai_response(
    db: Session,
    prompt: str,
) -> str:
    api_key = get_gemini_api_key(db)

    client = get_gemini_client(api_key)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text