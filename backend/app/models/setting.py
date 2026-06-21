from sqlalchemy import Column, String, Text

from app.database.session import Base


class SiteSetting(Base):
    """Key/value store for owner-editable site content & links."""

    __tablename__ = "site_settings"

    key = Column(String(100), primary_key=True)
    value = Column(Text, nullable=True)
