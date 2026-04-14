from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from firebase_admin import firestore
from middleware.auth import get_current_user
import time

router = APIRouter(prefix="/orders", tags=["orders"])
db = firestore.client()

class OrderCreate(BaseModel):
    planType: str
    amount: int
    vitaScore: int
    productCount: int
    address: dict
    paymentId: Optional[str] = None

@router.post("/create")
async def create_order(order: OrderCreate, user: dict = Depends(get_current_user)):
    uid = user["uid"]
    order_id = f"VI{int(time.time() * 1000)}"
    data = order.dict()
    data.update({
        "orderId": order_id,
        "userId": uid,
        "status": "placed",
        "createdAt": firestore.SERVER_TIMESTAMP,
    })
    db.collection("orders").document(order_id).set(data)
    db.collection("users").document(uid).set({
        "hasPurchased": True,
        "lastOrderId": order_id,
        "orderDate": firestore.SERVER_TIMESTAMP,
    }, merge=True)
    return {"success": True, "orderId": order_id}

@router.get("/my-orders")
async def get_my_orders(user: dict = Depends(get_current_user)):
    uid = user["uid"]
    orders = db.collection("orders").where("userId", "==", uid).order_by("createdAt", direction=firestore.Query.DESCENDING).get()
    return {"orders": [o.to_dict() for o in orders]}

@router.get("/{order_id}")
async def get_order(order_id: str, user: dict = Depends(get_current_user)):
    doc = db.collection("orders").document(order_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Order not found")
    order = doc.to_dict()
    if order.get("userId") != user["uid"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    return order
