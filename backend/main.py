from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database, models
from routers import user, authentication, deadline, dashboard, ai

app = FastAPI()

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