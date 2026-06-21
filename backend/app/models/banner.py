from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Integer, String

from app.database.session import Base


class Banner(Base):
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    subtitle = Column(String(500), nullable=True)
    image_url = Column(String(1000), nullable=False)
    public_id = Column(String(500), nullable=True)
    cta_text = Column(String(120), nullable=True)
    cta_link = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True, index=True)
    position = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
