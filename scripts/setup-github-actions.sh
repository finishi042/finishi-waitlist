#!/bin/bash

# Setup script for GitHub Actions deployment to Cloud Run
# This script sets up Workload Identity Federation for secure deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="finishi-waitlist"
PROJECT_NUMBER="975711004260"
SERVICE_ACCOUNT_NAME="github-actions-deployer"
POOL_NAME="github-actions-pool"
PROVIDER_NAME="github-provider"
REGION="us-central1"

echo -e "${GREEN}=== Cloud Run GitHub Actions Setup ===${NC}\n"

# Get GitHub username
read -p "Enter your GitHub username: " GITHUB_USERNAME
if [ -z "$GITHUB_USERNAME" ]; then
    echo -e "${RED}Error: GitHub username is required${NC}"
    exit 1
fi

read -p "Enter your GitHub repository name (default: finishi-waitlist): " REPO_NAME
REPO_NAME=${REPO_NAME:-finishi-waitlist}

echo -e "\n${YELLOW}Using:${NC}"
echo "  GitHub Username: $GITHUB_USERNAME"
echo "  Repository: $REPO_NAME"
echo "  Project ID: $PROJECT_ID"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

echo -e "\n${GREEN}Step 1: Creating Workload Identity Pool...${NC}"
gcloud iam workload-identity-pools create "$POOL_NAME" \
  --project="$PROJECT_ID" \
  --location="global" \
  --display-name="GitHub Actions Pool" \
  2>/dev/null || echo "Pool already exists"

echo -e "\n${GREEN}Step 2: Creating Workload Identity Provider...${NC}"
gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_NAME" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_NAME" \
  --display-name="GitHub Provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.repository_owner=assertion.repository_owner" \
  --attribute-condition="assertion.repository_owner=='$GITHUB_USERNAME'" \
  --issuer-uri="https://token.actions.githubusercontent.com" \
  2>/dev/null || echo "Provider already exists"

echo -e "\n${GREEN}Step 3: Creating Service Account...${NC}"
gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
  --project="$PROJECT_ID" \
  --display-name="GitHub Actions Deployer" \
  2>/dev/null || echo "Service account already exists"

SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "\n${GREEN}Step 4: Granting permissions to service account...${NC}"

# Cloud Run Admin
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.admin" \
  --condition=None

# Service Account User
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

# Cloud Build Editor
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/cloudbuild.builds.editor" \
  --condition=None

# Artifact Registry Writer
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/artifactregistry.writer" \
  --condition=None

# Storage Admin
gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
  --role="roles/storage.admin" \
  --condition=None

echo -e "\n${GREEN}Step 5: Allowing Workload Identity Pool to impersonate service account...${NC}"
gcloud iam service-accounts add-iam-policy-binding "$SERVICE_ACCOUNT_EMAIL" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/$PROJECT_NUMBER/locations/global/workloadIdentityPools/$POOL_NAME/attribute.repository/$GITHUB_USERNAME/$REPO_NAME"

echo -e "\n${GREEN}Step 6: Getting Workload Identity Provider path...${NC}"
WIF_PROVIDER=$(gcloud iam workload-identity-pools providers describe "$PROVIDER_NAME" \
  --project="$PROJECT_ID" \
  --location="global" \
  --workload-identity-pool="$POOL_NAME" \
  --format="value(name)")

echo -e "\n${GREEN}=== Setup Complete! ===${NC}\n"
echo -e "${YELLOW}Add the following secrets to your GitHub repository:${NC}"
echo -e "${YELLOW}(Go to: https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/secrets/actions)${NC}\n"
echo -e "${GREEN}WIF_PROVIDER:${NC}"
echo "$WIF_PROVIDER"
echo ""
echo -e "${GREEN}WIF_SERVICE_ACCOUNT:${NC}"
echo "$SERVICE_ACCOUNT_EMAIL"
echo ""
echo -e "${YELLOW}Also add your environment variable secrets (from .env file):${NC}"
echo "  - SUPABASE_URL"
echo "  - SUPABASE_PUBLISHABLE_KEY"
echo "  - SUPABASE_SECRET_KEY"
echo "  - SUPABASE_JWKS_URL"
echo "  - SUPABASE_ANON_KEY"
echo "  - SUPABASE_SERVICE_ROLE_KEY"
echo "  - VITE_SUPABASE_URL"
echo "  - VITE_SUPABASE_PUBLISHABLE_KEY"
echo "  - ADMIN_SECRET"
echo ""
echo -e "${GREEN}Done! Push to the main branch to trigger an automatic deployment.${NC}"
