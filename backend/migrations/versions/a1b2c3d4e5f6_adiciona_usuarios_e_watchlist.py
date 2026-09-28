"""adiciona_usuarios_e_watchlist

Revision ID: a1b2c3d4e5f6
Revises: 9fc02719ae33
Create Date: 2026-09-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '9fc02719ae33'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'app_users',
        sa.Column('sk_user_id', sa.String(length=64), nullable=False),
        sa.Column('username', sa.String(length=120), nullable=False),
        sa.Column('bio', sa.String(length=500), nullable=True),
        sa.Column('location', sa.String(length=120), nullable=True),
        sa.Column('avatar_url', sa.String(length=2048), nullable=True),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.PrimaryKeyConstraint('sk_user_id'),
    )
    op.create_index(op.f('ix_app_users_username'), 'app_users', ['username'], unique=True)

    op.create_table(
        'watchlist_items',
        sa.Column('sk_watchlist_id', sa.String(length=64), nullable=False),
        sa.Column('sk_user_id', sa.String(length=64), nullable=False),
        sa.Column('sk_movie_id', sa.String(length=64), nullable=False),
        sa.Column('created_at', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
        sa.ForeignKeyConstraint(['sk_user_id'], ['app_users.sk_user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['sk_movie_id'], ['dim_movies.sk_movie_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('sk_watchlist_id'),
        sa.UniqueConstraint('sk_user_id', 'sk_movie_id', name='uq_watchlist_user_movie'),
    )
    op.create_index(op.f('ix_watchlist_items_sk_user_id'), 'watchlist_items', ['sk_user_id'], unique=False)
    op.create_index(op.f('ix_watchlist_items_sk_movie_id'), 'watchlist_items', ['sk_movie_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_watchlist_items_sk_movie_id'), table_name='watchlist_items')
    op.drop_index(op.f('ix_watchlist_items_sk_user_id'), table_name='watchlist_items')
    op.drop_table('watchlist_items')
    op.drop_index(op.f('ix_app_users_username'), table_name='app_users')
    op.drop_table('app_users')
