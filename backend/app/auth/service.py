from sqlalchemy.orm import Session

from app.models.user import User

from app.auth.security import (
    verify_password,
)

from app.auth.jwt import create_access_token


def login_user(
    db: Session,
    username: str,
    password: str,
):

    user = (
        db.query(User)
        .filter(User.username == username)
        .first()
    )

    if not user:
        raise ValueError("Invalid username or password")

    if not verify_password(
        password,
        user.password_hash,
    ):
        raise ValueError("Invalid username or password")

    token = create_access_token(
        {
            "sub": str(user.id),
            "username": user.username,
        }
    )

    return token