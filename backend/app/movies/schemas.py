from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field

class MovieBase(BaseModel):
    id_filme: str = Field(..., max_length=50)
    titulo: str = Field(..., max_length=500)
    data_lancamento: Optional[date] = None
    ano_lancamento: Optional[int] = None
    duracao_minutos: Optional[int] = None
    status_filme: Optional[str] = Field(None, max_length=50)
    sinopse: Optional[str] = Field(None, max_length=4000)
    url_poster: Optional[str] = Field(None, max_length=2048)
    url_backdrop: Optional[str] = Field(None, max_length=2048)
    diretor: Optional[str] = Field(None, max_length=255)
    genero: Optional[str] = Field(None, max_length=255)

class MovieCreate(MovieBase):
    pass

class MovieUpdate(BaseModel):
    titulo: Optional[str] = Field(None, max_length=500)
    data_lancamento: Optional[date] = None
    ano_lancamento: Optional[int] = None
    duracao_minutos: Optional[int] = None
    status_filme: Optional[str] = Field(None, max_length=50)
    sinopse: Optional[str] = Field(None, max_length=4000)
    url_poster: Optional[str] = Field(None, max_length=2048)
    url_backdrop: Optional[str] = Field(None, max_length=2048)
    diretor: Optional[str] = Field(None, max_length=255)
    genero: Optional[str] = Field(None, max_length=255)

class MovieResponse(MovieBase):
    sk_movie_id: str
    
    model_config = ConfigDict(from_attributes=True)

class ReviewBase(BaseModel):
    nome: str = Field(..., max_length=120)
    nota: float = Field(..., ge=1.0, le=5.0, multiple_of=0.5)
    comentario: str = Field(..., max_length=4000)

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    sk_movie_review_id: str
    sk_movie_id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ReviewSummaryResponse(BaseModel):
    qtd_avaliacoes_usuarios: int
    nota_media_usuarios: Optional[float]
    
    model_config = ConfigDict(from_attributes=True)

class MovieDetailResponse(MovieResponse):
    reviews_summary: Optional[ReviewSummaryResponse] = None
    reviews: list[ReviewResponse] = []
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedMovieResponse(BaseModel):
    items: list[MovieResponse]
    total: int
    page: int
    size: int
