from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, authentication, deadline, dashboard, ai, stress

app = FastAPI(title="LoadAlert API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(deadline.router)
app.include_router(dashboard.router)
app.include_router(ai.router)
app.include_router(stress.router)

@app.get("/")
def root():
    return {"message": "Welcome to LoadAlert API"}