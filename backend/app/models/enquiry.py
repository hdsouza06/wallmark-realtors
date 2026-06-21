import enum
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String, Text

from app.database.session import Base


class EnquiryType(str, enum.Enum):
    CONTACT = "contact"
    BUY = "buy"
    SELL = "sell"
    LEASE = "lease"
    HOME_LOAN = "home_loan"
    INTERIORS = "interiors"
    REDEVELOPMENT = "redevelopment"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(40), nullable=True)
    subject = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    enquiry_type = Column(Enum(EnquiryType), default=EnquiryType.CONTACT, index=True)
    property_ref = Column(String(255), nullable=True)
    is_read = Column(Boolean, default=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
