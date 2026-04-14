import os, hmac, hashlib
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from firebase_admin import firestore
from middleware.auth import get_current_user
import razorpay

router = APIRouter(prefix="/payments", tags=["payments"])
db = firestore.client()

def get_rzp():
    return razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

class CreateOrderReq(BaseModel):
    amount: int          # in rupees
    planType: str
    vitaScore: int

class VerifyReq(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@router.post("/create-order")
async def create_razorpay_order(req: CreateOrderReq, user: dict = Depends(get_current_user)):
    """Creates a Razorpay order. Frontend uses this to initialise the payment modal."""
    rzp = get_rzp()
    order = rzp.order.create({
        "amount": req.amount * 100,   # paise
        "currency": "INR",
        "notes": {"userId": user["uid"], "planType": req.planType, "vitaScore": req.vitaScore},
    })
    return {"orderId": order["id"], "amount": order["amount"], "currency": order["currency"]}

@router.post("/verify")
async def verify_payment(req: VerifyReq, user: dict = Depends(get_current_user)):
    """Verifies payment signature after successful Razorpay payment."""
    secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    msg = f"{req.razorpay_order_id}|{req.razorpay_payment_id}"
    expected = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, req.razorpay_signature):
        raise HTTPException(status_code=400, detail="Payment verification failed")
    # Mark payment verified in Firestore
    db.collection("payments").document(req.razorpay_payment_id).set({
        "userId": user["uid"],
        "orderId": req.razorpay_order_id,
        "paymentId": req.razorpay_payment_id,
        "status": "verified",
        "verifiedAt": firestore.SERVER_TIMESTAMP,
    })
    return {"verified": True, "paymentId": req.razorpay_payment_id}

@router.post("/webhook")
async def razorpay_webhook(request: Request):
    """Razorpay webhook — configure in Razorpay Dashboard."""
    body = await request.body()
    sig = request.headers.get("X-Razorpay-Signature", "")
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    expected = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(expected, sig):
        raise HTTPException(status_code=400, detail="Invalid webhook signature")
    payload = await request.json()
    event = payload.get("event")
    if event == "payment.captured":
        payment = payload["payload"]["payment"]["entity"]
        db.collection("payments").document(payment["id"]).set({
            "status": "captured", "amount": payment["amount"],
            "capturedAt": firestore.SERVER_TIMESTAMP,
        }, merge=True)
    return {"received": True}
