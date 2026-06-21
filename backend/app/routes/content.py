from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_admin
from app.database.session import get_db
from app.middleware.rate_limit import limiter
from app.models.banner import Banner
from app.models.blog import BlogPost
from app.models.newsletter import NewsletterSubscriber
from app.models.testimonial import Testimonial
from app.models.user import User
from app.schemas.common import Message
from app.schemas.content import (
    BannerCreate,
    BannerOut,
    BlogCreate,
    BlogOut,
    NewsletterCreate,
    TestimonialCreate,
    TestimonialOut,
)
from app.utils import unique_slug

router = APIRouter(tags=["content"])


# ===================== Testimonials =====================
@router.get("/testimonials", response_model=list[TestimonialOut])
def list_testimonials(db: Session = Depends(get_db)):
    return (
        db.query(Testimonial)
        .filter(Testimonial.is_published.is_(True))
        .order_by(Testimonial.position.asc(), Testimonial.created_at.desc())
        .all()
    )


@router.get("/testimonials/all", response_model=list[TestimonialOut])
def list_all_testimonials(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return db.query(Testimonial).order_by(Testimonial.position.asc()).all()


@router.post("/testimonials", response_model=TestimonialOut)
def create_testimonial(
    payload: TestimonialCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    item = Testimonial(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/testimonials/{item_id}", response_model=TestimonialOut)
def update_testimonial(
    item_id: int,
    payload: TestimonialCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/testimonials/{item_id}", response_model=Message)
def delete_testimonial(
    item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(item)
    db.commit()
    return Message(detail="Testimonial deleted")


# ===================== Banners =====================
@router.get("/banners", response_model=list[BannerOut])
def list_banners(db: Session = Depends(get_db)):
    return (
        db.query(Banner)
        .filter(Banner.is_active.is_(True))
        .order_by(Banner.position.asc())
        .all()
    )


@router.post("/banners", response_model=BannerOut)
def create_banner(
    payload: BannerCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    item = Banner(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/banners/{item_id}", response_model=BannerOut)
def update_banner(
    item_id: int,
    payload: BannerCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    item = db.query(Banner).filter(Banner.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Banner not found")
    for k, v in payload.model_dump().items():
        setattr(item, k, v)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/banners/{item_id}", response_model=Message)
def delete_banner(
    item_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    item = db.query(Banner).filter(Banner.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(item)
    db.commit()
    return Message(detail="Banner deleted")


# ===================== Blog =====================
@router.get("/blog", response_model=list[BlogOut])
def list_blog(db: Session = Depends(get_db)):
    return (
        db.query(BlogPost)
        .filter(BlogPost.is_published.is_(True))
        .order_by(BlogPost.created_at.desc())
        .all()
    )


@router.get("/blog/{slug}", response_model=BlogOut)
def get_blog(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("/blog", response_model=BlogOut)
def create_blog(
    payload: BlogCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)
):
    post = BlogPost(**payload.model_dump())
    post.slug = unique_slug(db, BlogPost, payload.title)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.put("/blog/{post_id}", response_model=BlogOut)
def update_blog(
    post_id: int,
    payload: BlogCreate,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_admin),
):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    for k, v in payload.model_dump().items():
        setattr(post, k, v)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/blog/{post_id}", response_model=Message)
def delete_blog(post_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(post)
    db.commit()
    return Message(detail="Blog post deleted")


# ===================== Newsletter =====================
@router.post("/newsletter", response_model=Message)
@limiter.limit("5/minute")
def subscribe_newsletter(
    request: Request, payload: NewsletterCreate, db: Session = Depends(get_db)
):
    existing = (
        db.query(NewsletterSubscriber)
        .filter(NewsletterSubscriber.email == payload.email)
        .first()
    )
    if existing:
        return Message(detail="You are already subscribed.")
    db.add(NewsletterSubscriber(email=payload.email))
    db.commit()
    return Message(detail="Subscribed! Thank you for joining our newsletter.")
