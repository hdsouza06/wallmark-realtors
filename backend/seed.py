"""Seed the database with an admin user and demo content.

Usage:  python seed.py
"""
from app.auth.security import get_password_hash
from app.config import settings
from app.database.session import Base, SessionLocal, engine
from app.models.banner import Banner
from app.models.blog import BlogPost
from app.models.property import ListingType, Property, PropertyImage, PropertyStatus
from app.models.testimonial import Testimonial
from app.models.user import User
from app.utils import unique_slug

UNSPLASH = "https://images.unsplash.com/photo-{id}?auto=format&fit=crop&w=1200&q=80"

DEMO_IMAGES = [
    "1600585154340-be6161a56a0c",
    "1600596542815-ffad4c1539a9",
    "1600607687939-ce8a6c25118c",
    "1600566753086-00f18fb6b3ea",
    "1613490493576-7fde63acd811",
    "1600047509807-ba8f99d2cdde",
]


def img(i):
    return UNSPLASH.format(id=DEMO_IMAGES[i % len(DEMO_IMAGES)])


PROPERTIES = [
    {
        "title": "Skyline Sea-View Penthouse",
        "description": "An exquisite 4 BHK penthouse with panoramic sea views, private terrace, "
        "Italian marble flooring and a designer modular kitchen.",
        "price": 85000000,
        "location": "Worli",
        "city": "Mumbai",
        "bhk": 4,
        "area_sqft": 3200,
        "property_type": "apartment",
        "listing_type": ListingType.BUY,
        "amenities": "Infinity Pool, Private Terrace, Concierge, Smart Home, Gymnasium, Valet Parking",
        "youtube_url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "is_featured": True,
    },
    {
        "title": "Grand Estate Villa with Garden",
        "description": "A sprawling 5 BHK independent villa nestled in a gated community with a "
        "landscaped garden, home theatre and a private pool.",
        "price": 120000000,
        "location": "Koregaon Park",
        "city": "Pune",
        "bhk": 5,
        "area_sqft": 5400,
        "property_type": "villa",
        "listing_type": ListingType.BUY,
        "amenities": "Private Pool, Home Theatre, Landscaped Garden, Servant Quarters, 4 Car Garage",
        "is_featured": True,
    },
    {
        "title": "Premium 3 BHK in Business District",
        "description": "Contemporary 3 BHK residence with floor-to-ceiling windows, located steps "
        "away from the central business district.",
        "price": 32000000,
        "location": "Bandra Kurla Complex",
        "city": "Mumbai",
        "bhk": 3,
        "area_sqft": 1850,
        "property_type": "apartment",
        "listing_type": ListingType.BUY,
        "amenities": "Clubhouse, Kids Play Area, Jogging Track, 24x7 Security, Power Backup",
        "is_featured": True,
    },
    {
        "title": "Luxury 2 BHK for Lease — Furnished",
        "description": "Fully-furnished premium 2 BHK available for lease with modern interiors and "
        "skyline views.",
        "price": 120000,
        "location": "Lower Parel",
        "city": "Mumbai",
        "bhk": 2,
        "area_sqft": 1100,
        "property_type": "apartment",
        "listing_type": ListingType.LEASE,
        "amenities": "Furnished, Swimming Pool, Gym, Covered Parking, Wi-Fi",
        "is_featured": True,
    },
    {
        "title": "Corporate Office Space for Lease",
        "description": "Grade-A commercial office space, plug-and-play ready, in a LEED-certified "
        "tower with premium amenities.",
        "price": 450000,
        "location": "Hinjewadi",
        "city": "Pune",
        "bhk": None,
        "area_sqft": 6000,
        "property_type": "commercial",
        "listing_type": ListingType.LEASE,
        "amenities": "Central AC, Cafeteria, High-speed Elevators, Ample Parking, 24x7 Access",
    },
    {
        "title": "Elegant 3 BHK Garden Apartment",
        "description": "Ground-floor 3 BHK with a private garden, perfect for families seeking "
        "tranquillity within the city.",
        "price": 28500000,
        "location": "Aundh",
        "city": "Pune",
        "bhk": 3,
        "area_sqft": 1700,
        "property_type": "apartment",
        "listing_type": ListingType.BUY,
        "amenities": "Private Garden, Clubhouse, Indoor Games, Senior Citizen Area",
    },
]

TESTIMONIALS = [
    {
        "name": "Aarav Mehta",
        "role": "Home Buyer",
        "message": "Wallmark Realtors made buying our dream home effortless. Their attention to "
        "detail and professionalism is unmatched.",
        "rating": 5,
        "position": 1,
    },
    {
        "name": "Priya Sharma",
        "role": "Investor",
        "message": "The team's market insight helped me secure a fantastic investment property. "
        "Truly a premium experience from start to finish.",
        "rating": 5,
        "position": 2,
    },
    {
        "name": "Rohan Kapoor",
        "role": "NRI Client",
        "message": "Being overseas, I needed a trustworthy partner. Wallmark handled everything "
        "transparently. Highly recommended!",
        "rating": 5,
        "position": 3,
    },
]

BANNERS = [
    {
        "title": "One-Stop Solution for All Your Real Estate Needs",
        "subtitle": "Buy, sell, lease and invest in premium properties across Mumbai, Pune, Goa & Dubai.",
        "image_url": img(0),
        "cta_text": "Explore Properties",
        "cta_link": "/buy",
        "position": 1,
    },
]

BLOGS = [
    {
        "title": "5 Things to Check Before Buying a Luxury Apartment",
        "excerpt": "From RERA approvals to amenities, here's our expert checklist for discerning buyers.",
        "content": "Buying a luxury home is a milestone decision. In this guide we walk through the "
        "five most important checks every premium buyer should make before signing on the dotted "
        "line — legal due diligence, builder reputation, amenity quality, resale potential and more.",
        "tags": "buying, luxury, guide",
        "cover_image": img(2),
    },
    {
        "title": "Why Redevelopment is Reshaping Urban Living",
        "excerpt": "Redevelopment projects are unlocking modern living in the heart of the city.",
        "content": "Urban redevelopment is transforming ageing societies into modern landmarks. "
        "Learn how residents benefit from larger homes, world-class amenities and enhanced value.",
        "tags": "redevelopment, urban, investment",
        "cover_image": img(4),
    },
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Admin user
        if not db.query(User).filter(User.email == settings.ADMIN_EMAIL).first():
            db.add(
                User(
                    name=settings.ADMIN_NAME,
                    email=settings.ADMIN_EMAIL,
                    hashed_password=get_password_hash(settings.ADMIN_PASSWORD),
                    is_admin=True,
                )
            )
            print(f"Created admin user: {settings.ADMIN_EMAIL}")

        # Properties
        if db.query(Property).count() == 0:
            for idx, p in enumerate(PROPERTIES):
                prop = Property(**p, status=PropertyStatus.AVAILABLE)
                prop.slug = unique_slug(db, Property, p["title"])
                prop.images = [
                    PropertyImage(url=img(idx + j), position=j) for j in range(3)
                ]
                db.add(prop)
            print(f"Created {len(PROPERTIES)} demo properties")

        if db.query(Testimonial).count() == 0:
            for t in TESTIMONIALS:
                db.add(Testimonial(**t))
            print(f"Created {len(TESTIMONIALS)} testimonials")

        if db.query(Banner).count() == 0:
            for b in BANNERS:
                db.add(Banner(**b))
            print(f"Created {len(BANNERS)} banners")

        if db.query(BlogPost).count() == 0:
            for b in BLOGS:
                post = BlogPost(**b)
                post.slug = unique_slug(db, BlogPost, b["title"])
                db.add(post)
            print(f"Created {len(BLOGS)} blog posts")

        db.commit()
        print("Seeding complete.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
