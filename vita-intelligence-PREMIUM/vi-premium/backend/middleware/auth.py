from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin.auth as fb_auth

bearer = HTTPBearer(auto_error=False)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing auth token")
    try:
        decoded = fb_auth.verify_id_token(credentials.credentials)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

async def optional_user(credentials: HTTPAuthorizationCredentials = Security(bearer)) -> dict | None:
    if not credentials:
        return None
    try:
        return fb_auth.verify_id_token(credentials.credentials)
    except:
        return None
