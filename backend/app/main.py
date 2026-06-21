import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.config import settings
from app.database.session import Base, engine
from app.middleware.rate_limit import limiter
from app.routes import auth, content, enquiries, properties, settings as settings_routes, uploads
from app import seo

logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Backend API for the Wallmark Realtors premium real estate platform.",
)

# Rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    _ensure_admin_user()
    _ensure_settings()


def _ensure_settings():
    from app.database.session import SessionLocal
    from app.routes.settings import ensure_default_settings

    db = SessionLocal()
    try:
        ensure_default_settings(db)
    finally:
        db.close()


def _ensure_admin_user():
    """Guarantee the configured admin account exists so login always works."""
    from app.auth.security import get_password_hash
    from app.database.session import SessionLocal
    from app.models.user import User

    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == settings.ADMIN_EMAIL).first()
        if existing is None:
            db.add(
                User(
                    name=settings.ADMIN_NAME,
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                    is_admin=True,
                )
            )
            db.commit()
            logging.info("Bootstrapped admin user: %s", settings.ADMIN_EMAIL)
    finally:
        db.close()


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok", "service": settings.APP_NAME}


# API routes
api = settings.API_V1_PREFIX
app.include_router(auth.router, prefix=api)
app.include_router(properties.router, prefix=api)
app.include_router(uploads.router, prefix=api)
app.include_router(enquiries.router, prefix=api)
app.include_router(content.router, prefix=api)
app.include_router(settings_routes.router, prefix=api)

# SEO (served at root)
app.include_router(seo.router)
