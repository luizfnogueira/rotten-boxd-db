from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.movies.schemas import MovieResponse


class UserCreate(BaseModel):
    username: str = Field(..., min_length=1, max_length=120)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, max_length=120)
    bio: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=120)
    avatar_url: Optional[str] = Field(None, max_length=2048)


class UserStats(BaseModel):
    films_watched: int
    reviews_count: int
    watchlist_count: int
    average_rating: Optional[float] = None


class UserResponse(BaseModel):
    sk_user_id: str
    username: str
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(UserResponse):
    stats: UserStats


class UserReviewResponse(BaseModel):
    """Review do usuário acompanhada dos dados do filme para exibição no perfil."""

    sk_movie_review_id: str
    sk_movie_id: str
    nome: str
    nota: float
    comentario: str
    created_at: datetime
    movie: MovieResponse

    model_config = ConfigDict(from_attributes=True)


class WatchlistEntryResponse(BaseModel):
    sk_watchlist_id: str
    created_at: datetime
    movie: MovieResponse

    model_config = ConfigDict(from_attributes=True)
