from fastapi import APIRouter
from app.movies.router import router as movies_router
from app.users.router import router as users_router

api_router = APIRouter()

api_router.include_router(movies_router, prefix="/movies", tags=["movies"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
