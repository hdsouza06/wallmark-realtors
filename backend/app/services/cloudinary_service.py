"""Cloudinary image upload helper.

Falls back gracefully (raises a clear error) when Cloudinary credentials are
not configured so the rest of the app keeps working in local/dev mode.
"""
from typing import BinaryIO, Optional

import cloudinary
import cloudinary.uploader

from app.config import settings

_configured = False


def _ensure_configured() -> bool:
    global _configured
    if _configured:
        return True
    if not (
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    ):
        return False
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )
    _configured = True
    return True


def is_enabled() -> bool:
    return _ensure_configured()


def upload_image(file: BinaryIO, folder: str = "wallmark") -> dict:
    """Upload a file-like object to Cloudinary, return {url, public_id}."""
    if not _ensure_configured():
        raise RuntimeError(
            "Cloudinary is not configured. Set CLOUDINARY_* environment variables."
        )
    result = cloudinary.uploader.upload(
        file,
        folder=folder,
        resource_type="image",
        transformation=[{"quality": "auto", "fetch_format": "auto"}],
    )
    return {"url": result.get("secure_url"), "public_id": result.get("public_id")}


def delete_image(public_id: Optional[str]) -> None:
    if not public_id or not _ensure_configured():
        return
    try:
        cloudinary.uploader.destroy(public_id)
    except Exception:
        # Deletion failures should not break the API flow.
        pass
