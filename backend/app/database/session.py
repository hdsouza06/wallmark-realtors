import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# Normalise the database URL. Some providers (Neon, Heroku, Railway) hand out
# "postgres://..." which SQLAlchemy 2.0 doesn't accept — it expects
# "postgresql://...". Rewrite it transparently so any copy-pasted URL works.
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = "postgresql://" + DATABASE_URL[len("postgres://"):]

# SQLite (used for zero-setup local dev and free-tier hosting) needs
# check_same_thread disabled so it can be shared across FastAPI's threadpool.
# Other databases ignore this.
_is_sqlite = DATABASE_URL.startswith("sqlite")
_connect_args = {"check_same_thread": False} if _is_sqlite else {}

# Ensure the directory holding the SQLite file exists (e.g. when pointing the
# DB at a mounted disk path like sqlite:////var/data/wallmark.db).
if _is_sqlite:
    _db_path = DATABASE_URL.split("sqlite:///", 1)[-1]
    _db_dir = os.path.dirname(_db_path)
    if _db_dir:
        os.makedirs(_db_dir, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    future=True,
    connect_args=_connect_args,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
