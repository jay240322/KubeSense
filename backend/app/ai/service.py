from app.ai.client import client, GEMINI_MODEL


def generate_ai_response(prompt: str) -> str:
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
    )

    return response.text