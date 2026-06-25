# Finishi Waitlist

A waitlist application built with Remix and Supabase, deployable to Google Cloud Run or Vercel.

## Starter Shape

- `app/actions/controller.tsx` owns the top-level route actions.
- `app/routes.ts` defines the route contract.
- `app/router.ts` wires routes to handlers.
- `app/middleware/render.tsx` installs the request-scoped renderer used by actions.
- `app/ui/` holds the shared document shell and home page UI.
- `app/assets.ts` owns the server-side asset pipeline used by the asset route and renderer.
- `public/` contains static files served from the app root.

## Growing The App

- Put top-level route actions in `app/actions/controller.tsx`.
- Add `app/actions/<route-key>/controller.tsx` when a nested route map needs its own actions or middleware.
- Add directories like `app/data/` or `test/` when the app actually needs them.
- Move shared UI into `app/ui/` once more than one route needs it.

## Commands

```sh
npm i
npm run dev          # Run development server with hot reload
npm run start        # Run production server (for Cloud Run)
npm run start:local  # Run production server locally with .env file
npm test
npm run typecheck
```

## Deployment

This application supports two deployment methods:

### Option 1: Google Cloud Run (Recommended)

The app is containerized and can be deployed to Google Cloud Run for production use.

**Current Live URL:** https://finishi-waitlist-975711004260.us-central1.run.app

#### Prerequisites
- Google Cloud SDK installed (`brew install --cask google-cloud-sdk`)
- Google Cloud project with billing enabled
- Docker (handled by Cloud Build)

#### Quick Deploy
```bash
# Build and deploy in one command
gcloud builds submit --tag us-central1-docker.pkg.dev/finishi-waitlist/finishi-waitlist/app:latest && \
gcloud run deploy finishi-waitlist \
  --image us-central1-docker.pkg.dev/finishi-waitlist/finishi-waitlist/app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Automatic Deployments via GitHub Actions
Set up continuous deployment from GitHub to Cloud Run:

```bash
./scripts/setup-github-actions.sh
```

This script will:
1. Create a Workload Identity Pool and Provider
2. Set up a service account with necessary permissions
3. Output the secrets you need to add to GitHub

For detailed instructions, see [.github/CLOUD_RUN_SETUP.md](.github/CLOUD_RUN_SETUP.md)

### Option 2: Vercel

The app can also be deployed to Vercel.

See [.github/SETUP.md](.github/SETUP.md) for Vercel deployment instructions.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SECRET_KEY=your_secret_key
SUPABASE_JWKS_URL=your_jwks_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Client-side (VITE_ prefix exposes to browser)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key

# Admin
ADMIN_SECRET=your_admin_secret
```

For Cloud Run deployments, these are set via `--set-env-vars` or GitHub Secrets.
