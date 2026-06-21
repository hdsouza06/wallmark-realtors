from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr


# ---------- Testimonials ----------
class TestimonialBase(BaseModel):
    name: str
    role: Optional[str] = None
    message: str
    rating: int = 5
    avatar_url: Optional[str] = None
    is_published: bool = True
    position: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialOut(TestimonialBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ---------- Banners ----------
class BannerBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: str
    public_id: Optional[str] = None
    cta_text: Optional[str] = None
    cta_link: Optional[str] = None
    is_active: bool = True
    position: int = 0


class BannerCreate(BannerBase):
    pass


class BannerOut(BannerBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    created_at: datetime


# ---------- Blog ----------
class BlogBase(BaseModel):
    title: str
    excerpt: Optional[str] = None
    content: str = ""
    cover_image: Optional[str] = None
    author: Optional[str] = "Wallmark Realtors"
    tags: Optional[str] = None
    is_published: bool = True


class BlogCreate(BlogBase):
    pass


class BlogOut(BlogBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime] = None


# ---------- Newsletter ----------
class NewsletterCreate(BaseModel):
    email: EmailStr


class NewsletterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    email: EmailStr
    created_at: datetime
