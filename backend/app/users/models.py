"""Modelos de usuário e watchlist do RottenBoxdbd."""

from datetime import datetime

from sqlalchemy import ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.movies.models import DimMovie, generate_surrogate_key


class AppUser(Base):
    """Perfil do usuário da aplicação (informações editáveis)."""

    __tablename__ = "app_users"

    sk_user_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=generate_surrogate_key
    )
    username: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    bio: Mapped[str | None] = mapped_column(String(500), default=None)
    location: Mapped[str | None] = mapped_column(String(120), default=None)
    avatar_url: Mapped[str | None] = mapped_column(String(2048), default=None)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    watchlist: Mapped[list["WatchlistItem"]] = relationship(
        back_populates="user", cascade="all, delete-orphan", order_by="WatchlistItem.created_at"
    )


class WatchlistItem(Base):
    """Filme que o usuário deseja assistir."""

    __tablename__ = "watchlist_items"
    __table_args__ = (
        UniqueConstraint("sk_user_id", "sk_movie_id", name="uq_watchlist_user_movie"),
    )

    sk_watchlist_id: Mapped[str] = mapped_column(
        String(64), primary_key=True, default=generate_surrogate_key
    )
    sk_user_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("app_users.sk_user_id", ondelete="CASCADE"), index=True
    )
    sk_movie_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("dim_movies.sk_movie_id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    user: Mapped[AppUser] = relationship(back_populates="watchlist")
    movie: Mapped[DimMovie] = relationship()
