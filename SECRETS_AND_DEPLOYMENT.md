# Kisawan - Secrets & Deployment Guide

This document outlines the environment variable requirements, local setup, and deployment process for the Kisawan application, specifically focusing on secure secret management for Vercel and GitHub Actions.

## Environment Variables Configuration

The application requires several environment variables to function correctly, particularly for authentication (Supabase/Firebase), AI features (Gemini), and weather data.

### Required Secrets List

| Variable Name | Purpose | Location Used |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | `src/integrations/supabase/client.ts` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key | `src/integrations/supabase/client.ts` |
| `VITE_WEATHER_API_KEY` | OpenWeather API key | `src/lib/env.ts` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key | `src/lib/env.ts` |
| `VITE_FIREBASE_API_KEY` | Firebase API key | `src/lib/firebase.ts` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `src/lib/firebase.ts` |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | `src/lib/firebase.ts` |
| `VITE_FIREBASE_STORAGE_BUCKET`| Firebase storage bucket | `src/lib/firebase.ts` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID`| Firebase messaging ID | `src/lib/firebase.ts` |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | `src/lib/firebase.ts` |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID | `src/lib/firebase.ts` |

> **Note:** The application will fail gracefully (or throw critical errors) if the essential keys (`VITE_WEATHER_API_KEY`, `VITE_GEMINI_API_KEY`) are missing.

---

## Local Development Setup

1. **Copy the Environment Template**
   ```bash
   cp .env.example .env
   ```
2. **Fill in the Secrets**
   Open `.env` and provide the actual values for each key. *Do not commit the `.env` file!* It is already added to `.gitignore`.
3. **Run the Development Server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

---

## Deployment Process (Vercel)

The Kisawan app is configured to be deployed on Vercel.

1. **Connect Repository**
   Import the `Recurrex/Recurrex-Kisawan` repository into Vercel.
2. **Configure Environment Variables**
   In the Vercel project settings, navigate to **Settings > Environment Variables**.
   Add *all* the variables listed in the **Required Secrets List** above. You can easily copy the keys from the `.env.example` file.
3. **Deploy**
   Trigger a deployment. Vercel will build the application (using `npm run build` or `bun run build`) and inject the environment variables at build time (`import.meta.env`).

### GitHub Secrets (for GitHub Actions)

If you are using GitHub Actions for CI/CD or preview deployments, you must configure Repository Secrets:

1. Go to your GitHub repository `Recurrex/Recurrex-Kisawan`.
2. Navigate to **Settings > Secrets and variables > Actions**.
3. Click **New repository secret**.
4. Add all the variables from the list above one by one, providing their production values.

---

## Secret Rotation Process

If any API key or credential is compromised, follow these steps to rotate it:

1. **Generate New Key**: Go to the respective provider (Supabase, Firebase, Google Cloud, OpenWeather) and generate a new key.
2. **Update Vercel**: Go to Vercel **Settings > Environment Variables**, edit the compromised key, and save.
3. **Update GitHub Secrets**: If used in CI/CD, update the corresponding Repository Secret.
4. **Update Local `.env`**: Update your local development environment to use the new key.
5. **Redeploy**: Trigger a new Vercel deployment so the new key is baked into the frontend build.
6. **Revoke Old Key**: Once the new deployment is live and verified, revoke or delete the old key from the provider's dashboard.
