from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.database import get_db

from app.auth.schemas import LoginRequest
from app.auth.service import login_user

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"],
)


@router.post("/login")
def login(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    try:
        token = login_user(
            db=db,
            username=request.username,
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