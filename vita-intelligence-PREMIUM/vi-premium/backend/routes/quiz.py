from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from firebase_admin import firestore
from middleware.auth import get_current_user

router = APIRouter(prefix="/quiz", tags=["quiz"])
db = firestore.client()

class QuizResult(BaseModel):
    ageGroup: str
    quizAnswers: dict
    vitaScore: int
    lifestyleScore: int
    physicalScore: int
    mentalScore: int
    performanceScore: int
    bodyTypeId: str
    stressLevel: Optional[str] = ""
    anxietyLevel: Optional[str] = ""
    libidoLevel: Optional[str] = ""
    timingControl: Optional[str] = ""
    erectionQuality: Optional[str] = ""

@router.post("/save")
async def save_quiz(result: QuizResult, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    data = result.dict()
    data["userId"] = uid
    data["hasCompletedQuiz"] = True
    data["completedAt"] = firestore.SERVER_TIMESTAMP
    db.collection("quizResults").document(uid).set(data, merge=True)
    db.collection("users").document(uid).set({"hasCompletedQuiz": True, "vitaScore": result.vitaScore}, merge=True)
    return {"success": True, "vitaScore": result.vitaScore}

@router.get("/result")
async def get_quiz_result(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    doc = db.collection("quizResults").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="No quiz result found")
    return doc.to_dict()
