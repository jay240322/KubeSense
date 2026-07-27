from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.auth.schemas import (
    RegisterRequest,
    LoginRequest,
)

from app.auth.service import (
    register_user,
    login_user,
)

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post("/register")
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    try:
        user = register_user(
            db=db,
            username=request.username,
            email=request.email,
            password=request.password,
        )

        return {
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
        }

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        token = login_user(
            db=db,
            email=request.email,
            password=request.password,
        )

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )