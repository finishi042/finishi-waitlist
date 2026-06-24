# GitHub Actions Deployment Setup

To enable automatic deployment to Vercel via GitHub Actions, you need to add the following secrets to your GitHub repository:

## Required Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these three secrets:

### 1. VERCEL_TOKEN
Get your Vercel token:
```bash
vercel token
```
Or visit: https://vercel.com/account/tokens

### 2. VERCEL_ORG_ID
```
team_MpB3XzzplgkRi1ilVKuGtbUi
```

### 3. VERCEL_PROJECT_ID
```
prj_3IOe1eKAcMkGZ2uR8nZjxwa9cDAK
```

## Testing

Once you've added all three secrets, push to the main branch and the GitHub Action will automatically:
1. Build on a Linux environment (resolving the lightningcss binary issue)
2. Deploy to Vercel with the correct binaries

## Disabling Vercel's Git Integration

To avoid conflicts, you should disable Vercel's automatic Git deployments:
1. Go to https://vercel.com/finishi1/finishi-waitlist/settings/git
2. Disconnect the Git repository OR disable automatic deployments

This way, only GitHub Actions will trigger deployments.
