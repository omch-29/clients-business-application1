# Clean Sweep Brooms

A small e-commerce site for a broom business.

- **frontend/** — React (Vite + Tailwind) storefront and admin dashboard
- **backend/** — Node.js/Express API (MongoDB + Cloudinary + JWT admin auth)

## What it does

- **Storefront**: customers browse brooms (each with multiple photos), view details, add to cart, and check out with their name/phone/address. No customer account needed.
- **Admin**: a single fixed admin login (email + password, set by you) at `/admin/login`. The admin can add/edit/delete brooms (uploading photos straight to Cloudinary) and view orders, changing each order's status (Pending → Processing → Shipped → Delivered / Cancelled).

## 1. Prerequisites

- Node.js 18+
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (or a local `mongod`)
- A free [Cloudinary](https://cloudinary.com/users/register/free) account (for image hosting)

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login the admin will use at `/admin/login`
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from your Cloudinary dashboard

Start the API:

```bash
npm run dev
```

It runs on `http://localhost:5000` by default.

## 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

It runs on `http://localhost:5173` and talks to the API at `VITE_API_URL` (defaults to `http://localhost:5000/api`).

## 4. Using it

1. Open `http://localhost:5173/admin/login` and sign in with `ADMIN_EMAIL` + `ADMIN_PASSWORD` from `backend/.env`.
2. Add a few brooms (name, description, price, stock, category, photos).
3. Open `http://localhost:5173` to see the storefront, add brooms to the cart, and place a test order.
4. Back in `/admin/orders`, update the order's status as it moves through fulfillment.

## Notes / easy customization

- Business name, tagline, and currency symbol live in `frontend/src/config.js`.
- The admin link is a small "Admin" link in the storefront footer — it's intentionally unadvertised, not hidden by any real access control beyond the login itself.
- Only one admin account is supported by design (fixed email/password in `.env`), matching what was asked for.
