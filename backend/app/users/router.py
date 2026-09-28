from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.movies.models import DimMovie, MovieReview
from app.users.models import AppUser, WatchlistItem
from app.users.schemas import (
    UserCreate,
    UserProfileResponse,
    UserResponse,
    UserReviewResponse,
    UserStats,
    UserUpdate,
    WatchlistEntryResponse,
)

router = APIRouter()


async def _get_user_or_404(username: str, db: AsyncSession) -> AppUser:
    result = await db.execute(select(AppUser).filter(AppUser.username == username))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def _build_stats(user: AppUser, db: AsyncSession) -> UserStats:
    films_watched = (
        await db.execute(
            select(func.count(func.distinct(MovieReview.sk_movie_id))).filter(
                MovieReview.nome == user.username
            )
        )
    ).scalar_one()
    reviews_count = (
        await db.execute(
            select(func.count()).select_from(MovieReview).filter(MovieReview.nome == user.username)
        )
    ).scalar_one()
    average_rating = (
        await db.execute(
            select(func.avg(MovieReview.nota)).filter(MovieReview.nome == user.username)
        )
    ).scalar_one()
    watchlist_count = (
        await db.execute(
            select(func.count())
            .select_from(WatchlistItem)
            .filter(WatchlistItem.sk_user_id == user.sk_user_id)
        )
    ).scalar_one()

    return UserStats(
        films_watched=films_watched,
        reviews_count=reviews_count,
        watchlist_count=watchlist_count,
        average_rating=round(average_rating, 2) if average_rating is not None else None,
    )


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def login_or_create_user(user_in: UserCreate, db: AsyncSession = Depends(get_db)) -> Any:
    """Retorna o usuário existente ou cria um novo (login simplificado)."""

    username = user_in.username.strip()
    result = await db.execute(select(AppUser).filter(AppUser.username == username))
    user = result.scalars().first()
    if not user:
        user = AppUser(username=username)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    return user


@router.get("/{username}", response_model=UserProfileResponse)
async def get_user_profile(username: str, db: AsyncSession = Depends(get_db)) -> Any:
    user = await _get_user_or_404(username, db)
    stats = await _build_stats(user, db)
    return UserProfileResponse(
        sk_user_id=user.sk_user_id,
        username=user.username,
        bio=user.bio,
        location=user.location,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
        stats=stats,
    )


@router.put("/{username}", response_model=UserResponse)
async def update_user_profile(
    username: str, user_in: UserUpdate, db: AsyncSession = Depends(get_db)
) -> Any:
    user = await _get_user_or_404(username, db)
    update_data = user_in.model_dump(exclude_unset=True)

    new_username = update_data.pop("username", None)
    if new_username:
        new_username = new_username.strip()
        if new_username != user.username:
            existing = await db.execute(
                select(AppUser).filter(AppUser.username == new_username)
            )
            if existing.scalars().first():
                raise HTTPException(status_code=400, detail="Username already taken")
            # Mantém as reviews vinculadas ao novo nome do usuário.
            reviews = await db.execute(
                select(MovieReview).filter(MovieReview.nome == user.username)
            )
            for review in reviews.scalars().all():
                review.nome = new_username
            user.username = new_username

    for field, value in update_data.items():
        setattr(user, field, value)

    await db.commit()
    await db.refresh(user)
    return user


@router.get("/{username}/reviews", response_model=list[UserReviewResponse])
async def get_user_reviews(username: str, db: AsyncSession = Depends(get_db)) -> Any:
    result = await db.execute(
        select(MovieReview)
        .options(selectinload(MovieReview.movie))
        .filter(MovieReview.nome == username)
        .order_by(MovieReview.created_at.desc())
    )
    return list(result.scalars().all())


@router.get("/{username}/watchlist", response_model=list[WatchlistEntryResponse])
async def get_watchlist(username: str, db: AsyncSession = Depends(get_db)) -> Any:
    user = await _get_user_or_404(username, db)
    result = await db.execute(
        select(WatchlistItem)
        .options(selectinload(WatchlistItem.movie))
        .filter(WatchlistItem.sk_user_id == user.sk_user_id)
        .order_by(WatchlistItem.created_at.desc())
    )
    return list(result.scalars().all())


@router.post(
    "/{username}/watchlist/{sk_movie_id}",
    response_model=WatchlistEntryResponse,
    status_code=status.HTTP_201_CREATED,
)
async def add_to_watchlist(
    username: str, sk_movie_id: str, db: AsyncSession = Depends(get_db)
) -> Any:
    user = await _get_user_or_404(username, db)

    movie_result = await db.execute(select(DimMovie).filter(DimMovie.sk_movie_id == sk_movie_id))
    if not movie_result.scalars().first():
        raise HTTPException(status_code=404, detail="Movie not found")

    existing = await db.execute(
        select(WatchlistItem)
        .options(selectinload(WatchlistItem.movie))
        .filter(
            WatchlistItem.sk_user_id == user.sk_user_id,
            WatchlistItem.sk_movie_id == sk_movie_id,
        )
    )
    item = existing.scalars().first()
    if item:
        return item

    item = WatchlistItem(sk_user_id=user.sk_user_id, sk_movie_id=sk_movie_id)
    db.add(item)
    await db.commit()

    result = await db.execute(
        select(WatchlistItem)
        .options(selectinload(WatchlistItem.movie))
        .filter(WatchlistItem.sk_watchlist_id == item.sk_watchlist_id)
    )
    return result.scalars().first()


@router.delete("/{username}/watchlist/{sk_movie_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_watchlist(
    username: str, sk_movie_id: str, db: AsyncSession = Depends(get_db)
) -> None:
    user = await _get_user_or_404(username, db)
    result = await db.execute(
        select(WatchlistItem).filter(
            WatchlistItem.sk_user_id == user.sk_user_id,
            WatchlistItem.sk_movie_id == sk_movie_id,
        )
    )
    item = result.scalars().first()
    if not item:
        raise HTTPException(status_code=404, detail="Movie is not in the watchlist")

    await db.delete(item)
    await db.commit()
