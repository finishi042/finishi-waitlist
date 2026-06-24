# GitHub Actions Deployment Setup

To enable automatic deployment to Vercel via GitHub Actions, follow these steps:

## Step 1: Create a Vercel Token

1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it: `github-actions-finishi-waitlist`
4. Scope: Select your team "Finishi" (finishi1)
5. Expiration: Choose "No Expiration" or set a long expiration
6. Copy the token - you'll need it in the next step

## Step 2: Add GitHub Secrets

Go to: https://github.com/finishi042/finishi-waitlist/settings/secrets/actions

Click "New repository secret" and add these three secrets:

### 1. VERCEL_TOKEN
Paste the token you created in Step 1

### 2. VERCEL_ORG_ID
```
team_MpB3XzzplgkRi1ilVKuGtbUi
```

### 3. VERCEL_PROJECT_ID
```
prj_3IOe1eKAcMkGZ2uR8nZjxwa9cDAK
```

## Step 3: Test the Workflow

Once all three secrets are added:
```bash
git add -A
git commit -m "Add GitHub Actions deployment workflow"
git push
```

Check the Actions tab in GitHub to see the deployment progress.

## Step 4: Disable Vercel's Automatic Git Deployments (Optional)

To avoid duplicate deployments:
1. Go to https://vercel.com/finishi1/finishi-waitlist/settings/git
2. Under "Git Integration", you can either:
   - Disconnect the repository, OR
   - Keep it connected but GitHub Actions will override automatic deployments

## How It Works

The GitHub Action:
1. Runs on a Linux x64 environment (same as Vercel's production)
2. Installs all dependencies including the correct lightningcss binary
3. Deploys to Vercel with the pre-built node_modules
4. This solves the lightningcss binary mismatch issue!

