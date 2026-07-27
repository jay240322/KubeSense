from sqlalchemy.orm import Session

from app.models.user import User

from app.auth.security import (
    hash_password,
    verify_password,
)

from app.auth.jwt import create_access_token


def register_user(
    db: Session,
    username: str,
    email: str,
    password: str,
):

    existing_user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        username=username,
        email=email,
        password_hash=hash_password(password),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(
    db: Session,
    email: str,
    password: str,
):

    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise ValueError("Invalid email or password")

    if not verify_password(
        password,
        user.password_hash,
    ):
        raise ValueError("Invalid email or password")

    token = create_access_token(
        {
            "sub": str(user.id),
            "email": user.email,
        }
    )

    return token