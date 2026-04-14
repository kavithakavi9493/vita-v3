from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from firebase_admin import firestore
from middleware.auth import get_current_user

router = APIRouter(prefix="/users", tags=["users"])
db = firestore.client()

class UserProfile(BaseModel):
    userName: str
    email: Optional[str] = ""
    phone: Optional[str] = ""

@router.get("/me")
async def get_profile(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        return {"userId": uid, "isNew": True}
    return {**doc.to_dict(), "userId": uid}

@router.put("/me")
async def update_profile(profile: UserProfile, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    db.collection("users").document(uid).set(profile.dict(), merge=True)
    return {"success": True}

@router.get("/dashboard")
async def get_dashboard(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    user_doc  = db.collection("users").document(uid).get()
    quiz_doc  = db.collection("quizResults").document(uid).get()
    orders    = db.collection("orders").where("userId","==",uid).limit(5).get()
    return {
        "user":   user_doc.to_dict()  if user_doc.exists  else {},
        "quiz":   quiz_doc.to_dict()  if quiz_doc.exists  else {},
        "orders": [o.to_dict() for o in orders],
    }

@router.delete("/me")
async def delete_account(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    db.collection("users").document(uid).delete()
    db.collection("quizResults").document(uid).delete()
    return {"success": True, "message": "Account data deleted. Contact support to fully remove your account."}
