---
description: Deploy ATS Checker - Frontend on Vercel, Backend on Render
---

# 🚀 Deployment Guide: ATS Checker

This guide walks you through deploying:
- **Frontend** → Vercel (Free)
- **Backend (4 Go Services)** → Render (Free Tier)

---

## Prerequisites

1. GitHub account with code pushed (✅ Already done: `SpiritOfKedar/spirit-checker`)
2. Vercel account (free): https://vercel.com
3. Render account (free): https://render.com

---

## Part 1: Deploy Backend Services on Render

### Step 1.1: Create Render Account
1. Go to https://render.com
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

### Step 1.2: Deploy API Gateway (Main Service)

1. Go to Render Dashboard → **New +** → **Web Service**
2. Connect your GitHub repo: `SpiritOfKedar/spirit-checker`
3. Configure:
   - **Name**: `ats-api-gateway`
   - **Region**: Choose closest to you (e.g., `Oregon (US West)` or `Frankfurt (EU)`)
   - **Branch**: `main`
   - **Root Directory**: `services/api-gateway`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

4. Add **Environment Variables**:
   ```
   PORT=8080
   CORS_ORIGINS=https://YOUR-VERCEL-APP.vercel.app
   RESUME_PARSER_SERVICE_URL=https://ats-resume-parser.onrender.com
   NLP_SERVICE_URL=https://ats-nlp-service.onrender.com
   ATS_SCORER_SERVICE_URL=https://ats-ats-scorer.onrender.com
   ```
   ⚠️ **Note**: You'll update these URLs after deploying other services

5. Click **Create Web Service**

### Step 1.3: Deploy Resume Parser Service

1. **New +** → **Web Service**
2. Same repo: `SpiritOfKedar/spirit-checker`
3. Configure:
   - **Name**: `ats-resume-parser`
   - **Root Directory**: `services/resume-parser`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

4. **Environment Variables**:
   ```
   PORT=8081
   ```

5. Click **Create Web Service**

### Step 1.4: Deploy NLP Service

1. **New +** → **Web Service**
2. Same repo
3. Configure:
   - **Name**: `ats-nlp-service`
   - **Root Directory**: `services/nlp-service`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

4. **Environment Variables**:
   ```
   PORT=8082
   ```

5. Click **Create Web Service**

### Step 1.5: Deploy ATS Scorer Service

1. **New +** → **Web Service**
2. Same repo
3. Configure:
   - **Name**: `ats-ats-scorer`
   - **Root Directory**: `services/ats-scorer`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`

4. **Environment Variables**:
   ```
   PORT=8083
   SKILL_WEIGHT=0.40
   SIMILARITY_WEIGHT=0.30
   SECTION_WEIGHT=0.30
   ```

5. Click **Create Web Service**

### Step 1.6: Update API Gateway Environment Variables

After all services are deployed, go back to **ats-api-gateway** and update:

1. Go to **Environment** tab
2. Update these with the actual Render URLs:
   ```
   RESUME_PARSER_SERVICE_URL=https://ats-resume-parser.onrender.com
   NLP_SERVICE_URL=https://ats-nlp-service.onrender.com
   ATS_SCORER_SERVICE_URL=https://ats-ats-scorer.onrender.com
   ```
3. Click **Save Changes** (this will redeploy)

---

## Part 2: Deploy Frontend on Vercel

### Step 2.1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub

### Step 2.2: Import Project

1. Click **Add New...** → **Project**
2. Import from GitHub: `SpiritOfKedar/spirit-checker`
3. Configure:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Click **Edit** → Select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: Leave default

4. Add **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://ats-api-gateway.onrender.com
   ```

5. Click **Deploy**

### Step 2.3: Update API Gateway CORS

After Vercel deployment completes:

1. Copy your Vercel URL (e.g., `https://spirit-checker.vercel.app`)
2. Go to Render → `ats-api-gateway` → **Environment**
3. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://spirit-checker.vercel.app
   ```
4. Save and redeploy

---

## Part 3: Verify Deployment

### Test Backend Health
```bash
curl https://ats-api-gateway.onrender.com/health
```
Expected: `{"status":"ok","service":"api-gateway"}`

### Test Frontend
Visit your Vercel URL and try analyzing a resume!

---

## ⚠️ Important Notes

### Render Free Tier Limitations
- Services **spin down after 15 minutes of inactivity**
- First request after sleep may take **30-60 seconds** (cold start)
- Consider keeping services warm with a cron job (e.g., cron-job.org)

### Keep Services Warm (Optional)
Set up a free cron job at https://cron-job.org to ping your API every 14 minutes:
```
https://ats-api-gateway.onrender.com/health
```

---

## 🔗 Quick Reference URLs

After deployment, your URLs will be:
- **Frontend**: `https://spirit-checker.vercel.app` (example)
- **API Gateway**: `https://ats-api-gateway.onrender.com`
- **Resume Parser**: `https://ats-resume-parser.onrender.com`
- **NLP Service**: `https://ats-nlp-service.onrender.com`
- **ATS Scorer**: `https://ats-ats-scorer.onrender.com`
