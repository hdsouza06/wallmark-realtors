from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.database.session import get_db
from app.models.blog import BlogPost
from app.models.property import Property

router = APIRouter(tags=["seo"], include_in_schema=False)

STATIC_PATHS = [
    "",
    "buy",
    "sell",
    "lease",
    "home-loan",
    "interiors",
    "redevelopment",
    "contact",
    "blog",
    "about",
]


@router.get("/sitemap.xml")
def sitemap(db: Session = Depends(get_db)):
    base = settings.SITE_URL.rstrip("/")
    urls = [f"{base}/{p}".rstrip("/") for p in STATIC_PATHS]

    for prop in db.query(Property).filter(Property.is_published.is_(True)).all():
        urls.append(f"{base}/property/{prop.slug}")
    for post in db.query(BlogPost).filter(BlogPost.is_published.is_(True)).all():
        urls.append(f"{base}/blog/{post.slug}")

    items = "".join(
        f"<url><loc>{u}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>"
        for u in urls
    )
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"{items}</urlset>"
    )
    return Response(content=xml, media_type="application/xml")


@router.get("/robots.txt")
def robots():
    base = settings.SITE_URL.rstrip("/")
    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin\n"
        f"Sitemap: {base}/sitemap.xml\n"
    )
    return Response(content=content, media_type="text/plain")
