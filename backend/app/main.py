from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import mortgage
from app.core.errors import register_error_handlers

app = FastAPI(title="Mortgage API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

register_error_handlers(app)
app.include_router(mortgage.router)

@app.get("/healthz")
def health():
    return {"status": "ok"}
