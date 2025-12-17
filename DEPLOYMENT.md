# Deployment Guide

This CRM application is built with **Vite** and **React**. It is a static single-page application (SPA), making it easy to deploy to any static hosting provider.

## Prerequisites
- Node.js installed (v18+ recommended)
- Git installed
- A GitHub/GitLab/Bitbucket repository (recommended for CI/CD)

## Local Build
Before deploying, it's good practice to verify the build locally.

```bash
# Install dependencies
npm install

# Run the build
npm run build

# Preview the production build locally
npm run preview
```

The build output will be in the `dist/` directory.

---

## Deploy to Vercel (Recommended)
Vercel is the easiest way to deploy Vite apps.

### Option A: Via Dashboard (easiest)
1. Push your code to a git repository (GitHub, GitLab, etc.).
2. Go to [Vercel](https://vercel.com) and sign up/login.
3. Click **"Add New Project"** and select **"Import"** next to your repository.
4. Vercel will automatically detect **Vite**.
   - **Framework Preset**: Vite
   - **Build Command**: `vite build` (or `npm run build`)
   - **Output Directory**: `dist`
5. Click **Deploy**.

### Option B: Via CLI
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root.
3. Follow the prompts.

---

## Deploy to Netlify

### Option A: Via Dashboard
1. Push your code to a git repository.
2. Go to [Netlify](https://www.netlify.com).
3. Click **"Add new site"** -> **"Import an existing project"**.
4. Connect your Git provider and select your repo.
5. Netlify will detect the settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Deploy site**.

### Option B: Via Drag & Drop
1. Run `npm run build` locally.
2. Drag the `dist` folder to the "drop zone" on the Netlify dashboard.

---

## Important Configuration
Since this is a client-side router (SPA), you need to ensure the host redirects all 404s to `index.html`.

### Vercel
Vercel handles this automatically for Vite.

### Netlify
Create a `_redirects` file in the `public/` directory (or created during build) with the following content:
```
/*  /index.html  200
```
*(This is already handled if you use the automatic detection, but good to know)*.
