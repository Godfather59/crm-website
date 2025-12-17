# Nexus CRM Deployment Guide

This project consists of two main parts:
1.  **Frontend:** React (Vite) Single Page Application.
2.  **Backend:** Node.js (Express) Server with Prisma (SQLite).

To get the full application working in production (like Vercel), you must deploy **both** parts correctly.

---

## 1. Frontend Deployment (Vercel / Netlify)
The frontend is already configured for easy deployment to Vercel.

### Step-by-Step (Vercel):
1.  Import your GitHub repository to Vercel.
2.  **Crucial:** Add an Environment Variable:
    -   **Key:** `VITE_API_BASE_URL`
    -   **Value:** `https://your-backend-api.com/api` (You will get this after deploying the backend).
3.  Vercel will build and host your UI.

---

## 2. Backend Deployment (Render / Railway / DigitalOcean)
Vercel is primarily for static sites and serverless functions. It **cannot** run a persistent Node.js Express server or maintain a local SQLite database file.

### Recommended: Render.com
1.  Sign up for [Render](https://render.com).
2.  Create a **New Web Service**.
3.  Connect your GitHub repo.
4.  **Settings:**
    -   **Root Directory:** `server`
    -   **Build Command:** `npm install && npx prisma generate`
    -   **Start Command:** `node src/index.js`
5.  **Environment Variables:**
    -   `DATABASE_URL`: `"file:./data/dev.db"` (Or see "Database Strategy" below).
    -   `PORT`: `3000`
    -   `SECRET_KEY`: A long random string.

---

## 3. Database Strategy for Production
By default, the project uses **SQLite**. In production:
-   **SQLite on Render:** You must add a **Disk** to your Web Service to make the database file persistent.
-   **Recommended Strategy:** Use a hosted Database like **Supabase** (Postgres) or **Neon**.
    -   Update the `provider` in `server/prisma/schema.prisma` from `sqlite` to `postgresql`.
    -   Update your `DATABASE_URL` to point to your hosted database string.

---

## 🛠️ Summary of Configuration Changes
I have updated `src/api/client.js` to look for the `VITE_API_BASE_URL` environment variable. This ensures your frontend knows where to talk to the backend.

**Common Issue:** If registration is "not working" on Vercel, check the Browser Console (F12). You likely see a "404" or "Connection Refused" because the UI is still trying to talk to `localhost:3000`.
