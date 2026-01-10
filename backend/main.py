from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database, models
from routers import user, authentication, deadline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
models.Base.metadata.create_all(database.engine)
app.include_router(user.router)
app.include_router(authentication.router)
app.include_router(deadline.router)