import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.models.property import ListingType, Property, PropertyStatus
from app.models.user import User
from app.schemas.common import Message, Paginated
from app.schemas.property import PropertyCreate, PropertyOut, PropertyUpdate
from app.utils import unique_slug

router = APIRouter(prefix="/properties", tags=["properties"])


@router.get("", response_model=Paginated[PropertyOut])
def list_properties(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None, description="Free text search"),
    listing_type: Optional[ListingType] = None,
    property_type: Optional[str] = None,
    location: Optional[str] = None,
    city: Optional[str] = None,
    bhk: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    status_filter: Optional[PropertyStatus] = Query(None, alias="status"),
    featured: Optional[bool] = None,
    sort: str = Query("newest", pattern="^(newest|price_asc|price_desc)$"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=60),
):
    query = db.query(Property).filter(Property.is_published.is_(True))

    if q:
        like = f"%{q}%"
        query = query.filter(
            or_(
                Property.title.ilike(like),
                Property.description.ilike(like),
                Property.location.ilike(like),
                Property.city.ilike(like),
            )
        )
    if listing_type:
        query = query.filter(Property.listing_type == listing_type)
    if property_type:
        query = query.filter(Property.property_type == property_type)
    if location:
        query = query.filter(Property.location.ilike(f"%{location}%"))
    if city:
        query = query.filter(Property.city.ilike(f"%{city}%"))
    if bhk is not None:
        query = query.filter(Property.bhk == bhk)
    if min_price is not None:
        query = query.filter(Property.price >= min_price)
    if max_price is not None:
        query = query.filter(Property.price <= max_price)
    if status_filter:
        query = query.filter(Property.status == status_filter)
    if featured is not None:
        query = query.filter(Property.is_featured.is_(featured))

    if sort == "price_asc":
        query = query.order_by(Property.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Property.price.desc())
    else:
        query = query.order_by(Property.created_at.desc())

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()
    return Paginated[PropertyOut](
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pages=math.ceil(total / page_size) if total else 0,
    )


@router.get("/{slug}", response_model=PropertyOut)
def get_property(slug: str, db: Session = Depends(get_db)):
    prop = db.query(Property).filter(Property.slug == slug).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return prop


# ---------------- Admin CRUD ----------------
@router.post("", response_model=PropertyOut, status_code=status.HTTP_201_CREATED)
def create_property(
    payload: PropertyCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    prop = Property(**payload.model_dump())
    prop.slug = unique_slug(db, Property, payload.title)
    db.add(prop)
    db.commit()
    db.refresh(prop)
    return prop


@router.put("/{property_id}", response_model=PropertyOut)
def update_property(
    property_id: int,
    payload: PropertyUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(prop, key, value)
    if "title" in data and data["title"]:
        prop.slug = unique_slug(db, Property, data["title"])
    db.commit()
    db.refresh(prop)
    return prop


@router.delete("/{property_id}", response_model=Message)
def delete_property(
    property_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    prop = db.query(Property).filter(Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    db.delete(prop)
    db.commit()
    return Message(detail="Property deleted")
