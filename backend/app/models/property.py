import enum
from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.session import Base


class ListingType(str, enum.Enum):
    BUY = "buy"
    LEASE = "lease"


class PropertyStatus(str, enum.Enum):
    AVAILABLE = "available"
    UNDER_OFFER = "under_offer"
    SOLD = "sold"
    RENTED = "rented"


class Property(Base):
    __tablename__ = "properties"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False, default="")

    price = Column(Float, nullable=False, default=0)
    location = Column(String(255), nullable=False, index=True)
    city = Column(String(120), nullable=True, index=True)

    bhk = Column(Integer, nullable=True, index=True)
    area_sqft = Column(Float, nullable=True)
    property_type = Column(String(80), nullable=True, index=True)  # apartment, villa, plot, commercial...
    listing_type = Column(Enum(ListingType), nullable=False, default=ListingType.BUY, index=True)
    status = Column(Enum(PropertyStatus), nullable=False, default=PropertyStatus.AVAILABLE, index=True)

    amenities = Column(Text, nullable=True, default="")  # comma-separated
    youtube_url = Column(String(500), nullable=True)

    is_featured = Column(Boolean, default=False, index=True)
    is_published = Column(Boolean, default=True, index=True)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    images = relationship(
        "PropertyImage",
        back_populates="property",
        cascade="all, delete-orphan",
        order_by="PropertyImage.position",
    )

    @property
    def amenities_list(self):
        if not self.amenities:
            return []
        return [a.strip() for a in self.amenities.split(",") if a.strip()]


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    property_id = Column(Integer, ForeignKey("properties.id", ondelete="CASCADE"), nullable=False)
    url = Column(String(1000), nullable=False)
    public_id = Column(String(500), nullable=True)  # Cloudinary public id for deletion
    position = Column(Integer, default=0)

    property = relationship("Property", back_populates="images")
