from pydantic import BaseModel


class GeminiKeyRequest(BaseModel):
    gemini_api_key: str


class SettingsResponse(BaseModel):
    message: str