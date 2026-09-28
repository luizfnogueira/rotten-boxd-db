from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from typing import Any

from app.db.session import get_db
from app.movies.models import DimMovie, MovieReview, DimReview
from app.movies.schemas import (
    MovieCreate,
    MovieUpdate,
    MovieResponse,
    MovieDetailResponse,
    PaginatedMovieResponse,
    ReviewCreate,
    ReviewResponse,
)

router = APIRouter()

@router.get("", response_model=PaginatedMovieResponse)
async def list_movies(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    title: str | None = Query(None)
) -> Any:
    query = select(DimMovie)
    if title:
        query = query.filter(DimMovie.titulo.ilike(f"%{title}%"))
    
    # Calculate total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    # Apply pagination
    query = query.offset((page - 1) * size).limit(size)
    result = await db.execute(query)
    movies = result.scalars().all()
    
    return PaginatedMovieResponse(
        items=list(movies),
        total=total,
        page=page,
        size=size
    )

@router.post("", response_model=MovieResponse, status_code=status.HTTP_201_CREATED)
async def create_movie(
    movie_in: MovieCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    # Check if movie already exists
    result = await db.execute(select(DimMovie).filter(DimMovie.id_filme == movie_in.id_filme))
    if result.scalars().first():
        raise HTTPException(
            status_code=400,
            detail="The movie with this id_filme already exists in the system."
        )
    
    movie = DimMovie(**movie_in.model_dump())
    db.add(movie)
    await db.commit()
    await db.refresh(movie)
    return movie

@router.get("/{sk_movie_id}", response_model=MovieDetailResponse)
async def get_movie(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(DimMovie).filter(DimMovie.sk_movie_id == sk_movie_id))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    # Fetch reviews summary and reviews manually due to async nature, or use options if relationships were eagerly loaded. 
    # Since we did not add lazy='selectin', let's just query them.
    reviews_summary_result = await db.execute(select(DimReview).filter(DimReview.sk_movie_id == sk_movie_id))
    reviews_summary = reviews_summary_result.scalars().first()
    
    reviews_result = await db.execute(select(MovieReview).filter(MovieReview.sk_movie_id == sk_movie_id).order_by(MovieReview.created_at.desc()))
    reviews = reviews_result.scalars().all()
    
    response_data = movie.__dict__.copy()
    response_data["reviews_summary"] = reviews_summary
    response_data["reviews"] = list(reviews)
    
    return response_data

@router.put("/{sk_movie_id}", response_model=MovieResponse)
async def update_movie(
    sk_movie_id: str,
    movie_in: MovieUpdate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(DimMovie).filter(DimMovie.sk_movie_id == sk_movie_id))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    update_data = movie_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(movie, field, value)
        
    await db.commit()
    await db.refresh(movie)
    return movie

@router.delete("/{sk_movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_movie(
    sk_movie_id: str,
    db: AsyncSession = Depends(get_db)
) -> None:
    result = await db.execute(select(DimMovie).filter(DimMovie.sk_movie_id == sk_movie_id))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    await db.delete(movie)
    await db.commit()

@router.post("/{sk_movie_id}/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    sk_movie_id: str,
    review_in: ReviewCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    result = await db.execute(select(DimMovie).filter(DimMovie.sk_movie_id == sk_movie_id))
    movie = result.scalars().first()
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    review = MovieReview(
        sk_movie_id=sk_movie_id,
        nome=review_in.nome,
        nota=review_in.nota,
        comentario=review_in.comentario
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    
    # Update or create review summary
    summary_result = await db.execute(select(DimReview).filter(DimReview.sk_movie_id == sk_movie_id))
    summary = summary_result.scalars().first()
    
    if summary:
        total_score = summary.nota_media_usuarios * summary.qtd_avaliacoes_usuarios + review.nota
        summary.qtd_avaliacoes_usuarios += 1
        summary.nota_media_usuarios = total_score / summary.qtd_avaliacoes_usuarios
    else:
        summary = DimReview(
            sk_movie_id=sk_movie_id,
            qtd_avaliacoes_usuarios=1,
            nota_media_usuarios=review.nota
        )
        db.add(summary)
    
    await db.commit()
    return review
