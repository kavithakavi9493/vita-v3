import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials

load_dotenv()

# ── Firebase Admin Init ───────────────────────────────────
if not firebase_admin._apps:
    # Option A: service account JSON file (put in backend/serviceAccountKey.json)
    sa_path = os.path.join(os.path.dirname(__file__), "serviceAccountKey.json")
    if os.path.exists(sa_path):
        cred = credentials.Certificate(sa_path)
    else:
        # Option B: environment variables
        cred = credentials.Certificate({
            "type": "service_account",
            "project_id":                os.getenv("FIREBASE_PROJECT_ID"),
            "private_key_id":            os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key":               os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
            "client_email":              os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id":                 os.getenv("FIREBASE_CLIENT_ID"),
            "auth_uri":                  "https://accounts.google.com/o/oauth2/auth",
            "token_uri":                 "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url":      f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_CLIENT_EMAIL','')}",
        })
    firebase_admin.initialize_app(cred)

# ── Routes ────────────────────────────────────────────────
from routes.quiz     import router as quiz_router
from routes.orders   import router as orders_router
from routes.payments import router as payments_router
from routes.users    import router as users_router

app = FastAPI(
    title="VI — Vita Intelligence API",
    description="Backend for the VI sexual wellness platform",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Include routers ───────────────────────────────────────
app.include_router(quiz_router)
app.include_router(orders_router)
app.include_router(payments_router)
app.include_router(users_router)

@app.get("/")
def root():
    return {"status": "VI API running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"healthy": True}

# ── Run locally ───────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
