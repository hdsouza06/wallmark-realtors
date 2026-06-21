from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.enquiry import EnquiryType


class EnquiryCreate(BaseModel):
    name: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    enquiry_type: EnquiryType = EnquiryType.CONTACT
    property_ref: Optional[str] = None


class EnquiryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    enquiry_type: EnquiryType
    property_ref: Optional[str] = None
    is_read: bool
    created_at: datetime
