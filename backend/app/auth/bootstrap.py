import os

from sqlalchemy.orm import Session

from app.models.user import User
from app.auth.security import hash_password


def create_default_user(db: Session):
    existing_user = db.query(User).first()

    if existing_user:
        return

    username = os.getenv(
        "KUBESENSE_USERNAME",
        "admin",
    )

    password = os.getenv(
        "KUBESENSE_PASSWORD",
        "KubeSense@123",
    )

    email = f"{username}@kubesense.local"

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
    )

    db.add(user)
    db.commit()

    print("✅ Default KubeSense user created.")