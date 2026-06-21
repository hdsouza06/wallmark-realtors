# Wallmark Realtors — Premium Real Estate Platform

A world-class, full-stack luxury real estate website with a public site, a property listing system, and a secure admin dashboard.

- **Frontend:** React (Vite) · Tailwind CSS · Framer Motion · React Router
- **Backend:** Python · FastAPI · SQLAlchemy · SQLite (default) or PostgreSQL
- **Image storage:** Cloudinary
- **Email:** SMTP contact-form notifications (fastapi-mail)
- **Deployment:** Vercel (frontend) + Render (backend) free tiers — see [DEPLOYMENT.md](DEPLOYMENT.md). Docker · docker-compose · Nginx provided as an optional alternative.

Theme: Navy Blue `#0B1E3F` · Gold `#C8A96A` · White · Light Grey.

---

## Features

- Luxury, mobile-first responsive UI with smooth animations, rounded cards and hover effects
- Pages: Home, Buy, Sell, Lease, Home Loan (with EMI calculator), Interiors (before/after slider), Redevelopment, Contact (Google Maps), Blog, Property Detail
- Property listing system with search, filters, pagination, multiple photos, YouTube video tours, amenities and a featured flag
- Secure JWT admin dashboard: manage properties, image uploads, enquiries, testimonials, banners and blog posts
- Floating WhatsApp button, testimonials carousel, FAQ, newsletter, social links
- SEO: meta + Open Graph tags, JSON-LD schema, dynamic `sitemap.xml`, `robots.txt`, SEO-friendly slug URLs
- Performance: lazy-loaded routes, code splitting, image lazy-loading, skeleton loaders
- Security: JWT auth, bcrypt password hashing, Pydantic input validation, rate limiting

---

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── routes/        # API endpoints
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Cloudinary + email
│   │   ├── database/      # DB session
│   │   ├── auth/          # JWT + security
│   │   ├── middleware/    # Rate limiting
│   │   ├── config.py
│   │   ├── seo.py         # sitemap.xml / robots.txt
│   │   └── main.py
│   ├── seed.py            # Admin user + demo data
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/         # Public + admin pages
│   │   ├── components/    # Reusable UI
│   │   ├── layouts/
│   │   ├── context/       # Auth context
│   │   ├── hooks/
│   │   ├── services/      # API client
│   │   └── config/
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Quick Start (Docker — recommended)

1. Create env files:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Edit `backend/.env` and set at minimum a strong `SECRET_KEY`, the admin credentials, and (optionally) your Cloudinary + SMTP details.

3. Build and run:

```bash
docker compose up --build
```

- Website: http://localhost
- API docs: http://localhost:8000/docs
- Admin panel: http://localhost/admin/login

The backend automatically creates tables and seeds an admin user + demo content on first run.

---

## Local Development (without Docker)

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # defaults to SQLite — no DB server needed

python seed.py                # optional: adds demo properties/blog/testimonials
uvicorn app.main:app --reload # admin user + settings are auto-created on startup
```

API runs at http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

App runs at http://localhost:5173 and proxies `/api` to the backend.

---

## Default Admin Login

Set via `backend/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). Defaults:

- Email: `admin@wallmarkrealtors.com`
- Password: `ChangeMe123!`

> Change these before going to production.

---

## Configuration Notes

| Feature | Required env vars | Behaviour if unset |
|---|---|---|
| Image uploads | `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Upload endpoints return 503; you can still paste image URLs |
| Email notifications | `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_SERVER`, ... | Enquiries are saved and logged instead of emailed |
| Business contact | `COMPANY_PHONE`, `COMPANY_WHATSAPP`, `COMPANY_EMAIL` | Defaults used; also configurable in `frontend/src/config/site.js` |

---

## API Overview

- `POST /api/auth/login` — admin login (OAuth2 password flow)
- `GET  /api/properties` — list with search/filter/pagination
- `GET  /api/properties/{slug}` — property detail
- `POST/PUT/DELETE /api/properties` — admin CRUD
- `POST /api/uploads/property/{id}` — upload property images
- `POST /api/enquiries` — submit contact / consultation form
- `GET/POST/PUT/DELETE /api/testimonials | /banners | /blog`
- `POST /api/newsletter` — subscribe
- `GET  /sitemap.xml`, `/robots.txt`

Full interactive docs at `/docs`.
