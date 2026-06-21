from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, field_validator

from app.models.property import ListingType, PropertyStatus


class PropertyImageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    url: str
    public_id: Optional[str] = None
    position: int = 0


class PropertyBase(BaseModel):
    title: str
    description: str = ""
    price: float = 0
    location: str
    city: Optional[str] = None
    bhk: Optional[int] = None
    area_sqft: Optional[float] = None
    property_type: Optional[str] = None
    listing_type: ListingType = ListingType.BUY
    status: PropertyStatus = PropertyStatus.AVAILABLE
    amenities: Optional[str] = ""
    youtube_url: Optional[str] = None
    is_featured: bool = False
    is_published: bool = True


class PropertyCreate(PropertyBase):
    pass


class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    location: Optional[str] = None
    city: Optional[str] = None
    bhk: Optional[int] = None
    area_sqft: Optional[float] = None
    property_type: Optional[str] = None
    listing_type: Optional[ListingType] = None
    status: Optional[PropertyStatus] = None
    amenities: Optional[str] = None
    youtube_url: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None


class PropertyOut(PropertyBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None
    images: List[PropertyImageOut] = []
    amenities_list: List[str] = []

    @field_validator("amenities_list", mode="before")
    @classmethod
    def _split_amenities(cls, v, info):
        return v or []
