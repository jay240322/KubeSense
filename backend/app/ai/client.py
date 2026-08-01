import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_MODEL = os.getenv(
    "GEMINI_MODEL",
    "gemini-3.5-flash",
)


def get_gemini_client(api_key: str):
    return genai.Client(api_key=api_key)