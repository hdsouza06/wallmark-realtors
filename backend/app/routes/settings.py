from typing import Dict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.models.setting import SiteSetting
from app.models.user import User
from app.site_defaults import DEFAULT_SETTINGS

router = APIRouter(prefix="/settings", tags=["settings"])


def _all_settings(db: Session) -> Dict[str, str]:
    stored = {s.key: s.value for s in db.query(SiteSetting).all()}
    merged = {**DEFAULT_SETTINGS}
    merged.update({k: v for k, v in stored.items()})
    return merged


@router.get("", response_model=Dict[str, str])
def get_settings(db: Session = Depends(get_db)):
    """Public: returns all site settings (defaults merged with stored values)."""
    return _all_settings(db)


@router.put("", response_model=Dict[str, str])
def update_settings(
    payload: Dict[str, str],
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    """Admin: upsert one or more settings. Send only the keys you want to change."""
    for key, value in payload.items():
        row = db.query(SiteSetting).filter(SiteSetting.key == key).first()
        if row is None:
            db.add(SiteSetting(key=key, value=value))
        else:
            row.value = value
    db.commit()
    return _all_settings(db)


def ensure_default_settings(db: Session) -> None:
    """Insert any default settings keys that don't yet exist."""
    existing = {s.key for s in db.query(SiteSetting).all()}
    added = False
    for key, value in DEFAULT_SETTINGS.items():
        if key not in existing:
            db.add(SiteSetting(key=key, value=value))
            added = True
    if added:
        db.commit()
