# Deploying Wallmark Realtors (Free Tier)

This guide deploys the app for **$0/month** using:

| Layer    | Service              | Tier |
|----------|----------------------|------|
| Frontend | **Vercel**           | Free |
| Backend  | **Render**           | Free |
| Database | **SQLite** (on Render) | Free |
| Images   | **Cloudinary**       | Free |
| Email    | **Gmail SMTP** (optional) | Free |

The frontend and backend deploy **independently**: the React app is static files on
Vercel, and the FastAPI app is a web service on Render. They talk over HTTPS via the
`VITE_API_URL` environment variable.

---

## ⚠️ Important: SQLite on Render's free tier

Render's **free** web services have an **ephemeral filesystem**. The SQLite database
file is **reset whenever the service restarts, redeploys, or wakes from sleep** (free
services sleep after ~15 min of inactivity).

What this means in practice:

- The **admin user and site settings are automatically re-created on every startup**
  (the app bootstraps them), so **login and the site always work**.
- Any **properties, enquiries, testimonials, banners, or blog posts** created through
  the admin panel **will be lost** when the instance restarts.

This is fine for a **demo / staging** site. For a **production** site where the owner
adds real listings, choose one of these (both still cheap/free):

1. **Render Persistent Disk** (paid, from ~$1/mo): mount a disk at `/var/data` and set
   `DATABASE_URL=sqlite:////var/data/wallmark.db`. Data then survives restarts.
2. **Free managed Postgres** (recommended for production): create a free database on
   [Neon](https://neon.tech) or [Supabase](https://supabase.com) and set
   `DATABASE_URL=postgresql://...`. No code changes needed — `psycopg2` is already in
   `requirements.txt`.

The instructions below use plain SQLite (option 0) so you can launch for free today.

---

## Part 1 — Backend on Render

### Option A: One-click via Blueprint (uses `render.yaml`)

1. Push this repo to GitHub.
2. In Render: **New + → Blueprint**, select the repo. Render reads `render.yaml` and
   creates the **wallmark-backend** web service.
3. Fill in the env vars marked `sync: false` (see the table below) and click **Apply**.

### Option B: Manual web service

1. Render: **New + → Web Service**, connect the repo.
2. Settings:
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path:** `/health`
   - **Instance Type:** Free
3. Add the environment variables below, then **Create Web Service**.

### Backend environment variables

| Variable | Required | Example / Notes |
|---|---|---|
| `SECRET_KEY` | ✅ | Long random string (Render can auto-generate) |
| `DATABASE_URL` | ✅ | `sqlite:///./wallmark.db` (or a Postgres URL) |
| `ENVIRONMENT` | – | `production` |
| `FRONTEND_URL` | ✅ | Your Vercel URL, e.g. `https://wallmark.vercel.app` |
| `SITE_URL` | ✅ | Same as `FRONTEND_URL` (used in sitemap/robots) |
| `CORS_ORIGINS` | ✅ | `https://wallmark.vercel.app` (your Vercel domain) |
| `CORS_ORIGIN_REGEX` | – | `https://.*\.vercel\.app` (allows preview deploys) |
| `ADMIN_EMAIL` | ✅ | Admin login email |
| `ADMIN_PASSWORD` | ✅ | **Strong** admin password |
| `ADMIN_NAME` | – | `Wallmark Admin` |
| `CLOUDINARY_CLOUD_NAME` | ✅* | For image uploads |
| `CLOUDINARY_API_KEY` | ✅* | For image uploads |
| `CLOUDINARY_API_SECRET` | ✅* | For image uploads |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | – | Gmail + App Password for enquiry emails |
| `MAIL_FROM` / `MAIL_TO` | – | `wallmarkrealtors@gmail.com` |
| `MAIL_SERVER` / `MAIL_PORT` | – | `smtp.gmail.com` / `587` |

\* Without Cloudinary, image **upload** endpoints return 503, but admins can still
paste image URLs and the rest of the site works.

> Note the deployed backend URL, e.g. `https://wallmark-backend.onrender.com`.
> Verify it: open `https://wallmark-backend.onrender.com/health` → `{"status":"ok"}`.

---

## Part 2 — Frontend on Vercel

1. Vercel: **Add New… → Project**, import the same GitHub repo.
2. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite (auto-detected; `vercel.json` also sets it)
   - Build command / output dir are handled by `vercel.json` (`npm run build` → `dist`).
3. Add the environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://wallmark-backend.onrender.com/api` |

   (Use your real Render URL, and **include the `/api` suffix**.)
4. **Deploy.** Note the assigned domain, e.g. `https://wallmark.vercel.app`.

> `vercel.json` includes a SPA rewrite so deep links like `/buy` and `/admin/login`
> load correctly instead of 404-ing.

---

## Part 3 — Connect the two (CORS)

After both are live, go back to **Render** and make sure these match your Vercel domain:

- `FRONTEND_URL=https://wallmark.vercel.app`
- `SITE_URL=https://wallmark.vercel.app`
- `CORS_ORIGINS=https://wallmark.vercel.app`

Save — Render redeploys automatically. Then open your Vercel site and confirm the
homepage loads data (properties, testimonials) from the backend.

---

## Part 4 — Verify everything works

1. **Health:** `GET https://<backend>.onrender.com/health` → `{"status":"ok"}`.
2. **API docs:** `https://<backend>.onrender.com/docs` loads.
3. **Frontend loads data:** homepage shows content (no CORS errors in the browser
   console — check DevTools → Console/Network).
4. **Admin login:** go to `https://<frontend>.vercel.app/admin/login` and sign in with
   `ADMIN_EMAIL` / `ADMIN_PASSWORD`.
5. **Image upload:** in the admin, edit a property and upload an image → it should
   appear (served from Cloudinary).
6. **Contact form / WhatsApp:** submit the contact form; tap the WhatsApp button.

> First request after sleep is slow (~30–60s) on Render's free tier — this is normal
> (cold start). Subsequent requests are fast.

---

## Local development (no Docker required)

**Backend**
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # defaults to SQLite — no DB server needed
uvicorn app.main:app --reload # http://localhost:8000  (admin + data auto-seeded)
```

**Frontend**
```bash
cd frontend
npm install
cp .env.example .env          # VITE_API_URL=/api uses the dev proxy
npm run dev                    # http://localhost:5173
```

> Docker (`docker-compose.yml`) is still provided as an **optional** alternative, but
> is **not required** for Vercel + Render deployment.

---

## ✅ Manual configuration checklist

Things you must do by hand (cannot be committed to the repo):

- [ ] Push the repo to **GitHub**.
- [ ] Create the **Render** web service (Blueprint or manual) with Root Directory `backend`.
- [ ] Set a strong **`SECRET_KEY`** on Render.
- [ ] Set a strong **`ADMIN_PASSWORD`** (and `ADMIN_EMAIL`) on Render.
- [ ] Add **Cloudinary** credentials on Render (for image uploads).
- [ ] (Optional) Add **Gmail SMTP** `MAIL_USERNAME` + App Password for enquiry emails.
- [ ] Create the **Vercel** project with Root Directory `frontend`.
- [ ] Set **`VITE_API_URL`** on Vercel to `https://<your-backend>.onrender.com/api`.
- [ ] Back on Render, set **`FRONTEND_URL`**, **`SITE_URL`**, and **`CORS_ORIGINS`** to your Vercel domain; keep `CORS_ORIGIN_REGEX=https://.*\.vercel\.app` for previews.
- [ ] Decide on **data persistence**: accept ephemeral SQLite (demo), attach a Render disk, or switch `DATABASE_URL` to free Postgres (Neon/Supabase) for production.
- [ ] After first deploy, **log in to the admin** and change any default credentials.
- [ ] (Optional) Point a **custom domain** at Vercel and update `FRONTEND_URL` / `SITE_URL` / `CORS_ORIGINS` accordingly.

### Required accounts (all have free tiers)
- [ ] GitHub · [ ] Render · [ ] Vercel · [ ] Cloudinary · [ ] Gmail (optional, for email)
