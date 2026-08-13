from fastapi import Header, HTTPException, status
from .config import get_settings

def require_api_key(x_api_key: str | None = Header(default=None)):
    if not x_api_key or x_api_key != get_settings().api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing API key",
        )
