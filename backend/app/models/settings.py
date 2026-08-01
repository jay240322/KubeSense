from sqlalchemy import Column, Integer, Text
from app.database import Base


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)

    gemini_api_key = Column(Text, nullable=True)