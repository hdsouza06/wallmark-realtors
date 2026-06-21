from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text

from app.database.session import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    role = Column(String(150), nullable=True)  # e.g. "Home Buyer", "Investor"
    message = Column(Text, nullable=False)
    rating = Column(Integer, default=5)
    avatar_url = Column(String(1000), nullable=True)
    is_published = Column(Boolean, default=True, index=True)
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
