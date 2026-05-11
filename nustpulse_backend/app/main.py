from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, authentication, deadline, dashboard, sync, google_auth

app = FastAPI(title="NustPulse API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080", 
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(deadline.router)
app.include_router(dashboard.router)
app.include_router(sync.router)
app.include_router(google_auth.router)

@app.get("/")
def root():
    return {"message": "Welcome to NustPulse API"}