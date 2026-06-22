# PowerShell script to provision all resources in GCP and GitHub for Cloud Run Deployment.
# Requires: gcloud CLI (authenticated) and gh CLI (authenticated).

$ErrorActionPreference = "Stop"

# Configuration variables
$PROJECT_ID = gcloud config get-value project
if (-not $PROJECT_ID) {
    Write-Error "No active GCP project found. Please run: gcloud config set project <project-id>"
    exit 1
}

$REGION = "us-central1"
$REPO_NAME = "ta-server"
$GITHUB_REPO = "Kaymenz/The-Trust-Automobile-project"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Configuring Deployment to GCP Cloud Run" -ForegroundColor Cyan
Write-Host "Active GCP Project: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "GCP Region:        $REGION" -ForegroundColor Yellow
Write-Host "GitHub Repository:  $GITHUB_REPO" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Enable GCP Services
Write-Host "`n1. Enabling required GCP APIs..." -ForegroundColor Green
$services = @(
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "iam.googleapis.com"
)
foreach ($service in $services) {
    Write-Host "Enabling $service..."
    gcloud services enable $service --project=$PROJECT_ID
}

# 2. Get Project Number
$PROJECT_NUMBER = gcloud projects describe $PROJECT_ID --format="value(projectNumber)"
Write-Host "Project Number: $PROJECT_NUMBER" -ForegroundColor Yellow

# 3. Create Artifact Registry
Write-Host "`n2. Checking Artifact Registry..." -ForegroundColor Green
$repos = gcloud artifacts repositories list --location=$REGION --project=$PROJECT_ID --format="value(name)"
$repoExists = $repos | Where-Object { $_ -eq $REPO_NAME -or $_ -like "*$REPO_NAME" }
if (-not $repoExists) {
    Write-Host "Creating Artifact Registry repository '$REPO_NAME'..."
    gcloud artifacts repositories create $REPO_NAME `
        --repository-format=docker `
        --location=$REGION `
        --description="Docker repository for NestJS backend" `
        --project=$PROJECT_ID
} else {
    Write-Host "Repository '$REPO_NAME' already exists."
}

# 4. Create Service Accounts
Write-Host "`n3. Checking Service Accounts..." -ForegroundColor Green
$sas = gcloud iam service-accounts list --project=$PROJECT_ID --format="value(email)"

# Cloud Run Runtime SA
$runnerEmail = "ta-server-runner@${PROJECT_ID}.iam.gserviceaccount.com"
$runnerExists = $sas | Where-Object { $_ -eq $runnerEmail }
if (-not $runnerExists) {
    Write-Host "Creating Runtime Service Account '$runnerEmail'..."
    gcloud iam service-accounts create ta-server-runner `
        --display-name="Cloud Run Backend Runner" `
        --project=$PROJECT_ID
} else {
    Write-Host "Runtime Service Account '$runnerEmail' already exists."
}

# GitHub Actions Deployer SA
$saEmail = "github-deployer@${PROJECT_ID}.iam.gserviceaccount.com"
$saExists = $sas | Where-Object { $_ -eq $saEmail }
if (-not $saExists) {
    Write-Host "Creating GitHub Actions Deployer Service Account '$saEmail'..."
    gcloud iam service-accounts create github-deployer `
        --display-name="GitHub Actions Deployer" `
        --project=$PROJECT_ID
} else {
    Write-Host "Deployer Service Account '$saEmail' already exists."
}

# 5. Grant IAM Permissions
Write-Host "`n4. Configuring IAM permissions..." -ForegroundColor Green

# Deployer SA permissions
Write-Host "Granting Artifact Registry Writer role to deployer..."
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$saEmail" `
    --role="roles/artifactregistry.writer" `
    --project=$PROJECT_ID > $null

Write-Host "Granting Cloud Run Developer role to deployer..."
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$saEmail" `
    --role="roles/run.developer" `
    --project=$PROJECT_ID > $null

Write-Host "Granting Service Account User role to deployer on the runner SA..."
gcloud iam service-accounts add-iam-policy-binding $runnerEmail `
    --member="serviceAccount:$saEmail" `
    --role="roles/iam.serviceAccountUser" `
    --project=$PROJECT_ID > $null

# Runner SA permissions
Write-Host "Granting Secret Manager Secret Accessor role to runner..."
gcloud projects add-iam-policy-binding $PROJECT_ID `
    --member="serviceAccount:$runnerEmail" `
    --role="roles/secretmanager.secretAccessor" `
    --project=$PROJECT_ID > $null

# 6. Parse and Provision Secrets to GCP Secret Manager
Write-Host "`n5. Provisioning secrets from local .env to Secret Manager..." -ForegroundColor Green
$envPath = Join-Path $PSScriptRoot "..\.env"
if (Test-Path $envPath) {
    $lines = Get-Content $envPath
    $secretsListArray = @()
    $existingSecrets = gcloud secrets list --project=$PROJECT_ID --format="value(name)"
    
    foreach ($line in $lines) {
        $line = $line.Trim()
        if ($line -like "#*" -or $line -eq "") { continue }
        if ($line -match "^([^=]+)=(.*)$") {
            $key = $Matches[1].Trim()
            $value = $Matches[2].Trim()
            
            # Strip quotes if present
            if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
                $value = $Matches[1]
            }
            
            # Skip PORT and NODE_ENV since Cloud Run handles these natively
            if ($key -eq "PORT" -or $key -eq "NODE_ENV") {
                Write-Host "Skipping $key (managed by Cloud Run environment)"
                continue
            }
            
            Write-Host "Syncing secret to Secret Manager: $key..."
            $secretExists = $existingSecrets | Where-Object { $_ -eq $key -or $_ -like "*/$key" }
            if (-not $secretExists) {
                gcloud secrets create $key --replication-policy="automatic" --project=$PROJECT_ID | Out-Null
            }
            
            # Write value to temp file to preserve exact bytes and encoding (avoiding Powershell pipe issues)
            $tempFile = [System.IO.Path]::GetTempFileName()
            [System.IO.File]::WriteAllText($tempFile, $value)
            gcloud secrets versions add $key --data-file=$tempFile --project=$PROJECT_ID | Out-Null
            Remove-Item $tempFile
            
            $secretsListArray += $key
        }
    }
    $secretsList = $secretsListArray -join ","
    Write-Host "Secrets successfully synchronized!" -ForegroundColor Green
} else {
    Write-Warning "No local .env file found at $envPath. Skipping secret provisioning. Please create secrets in GCP manually."
    $secretsList = ""
}

# 7. Configure Workload Identity Federation (WIF)
Write-Host "`n6. Configuring Workload Identity Federation..." -ForegroundColor Green

$pools = gcloud iam workload-identity-pools list --location=global --project=$PROJECT_ID --format="value(name)"
$poolExists = $pools | Where-Object { $_ -like "*github-pool" }
if (-not $poolExists) {
    Write-Host "Creating Workload Identity Pool 'github-pool'..."
    gcloud iam workload-identity-pools create github-pool `
        --location="global" `
        --display-name="GitHub Actions Pool" `
        --project=$PROJECT_ID
} else {
    Write-Host "Workload Identity Pool 'github-pool' already exists."
}

$providerExists = $false
if ($poolExists) {
    $providers = gcloud iam workload-identity-pools providers list --workload-identity-pool="github-pool" --location=global --project=$PROJECT_ID --format="value(name)"
    $providerExists = $providers | Where-Object { $_ -like "*github-provider" }
}

if (-not $providerExists) {
    Write-Host "Creating Workload Identity Provider 'github-provider'..."
    gcloud iam workload-identity-pools providers create-oidc github-provider `
        --location="global" `
        --workload-identity-pool="github-pool" `
        --issuer-uri="https://token.actions.githubusercontent.com" `
        --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" `
        --attribute-condition="assertion.repository == '$GITHUB_REPO'" `
        --project=$PROJECT_ID
} else {
    Write-Host "Workload Identity Provider 'github-provider' already exists."
}

# Bind Deployer SA to GitHub repo identity
Write-Host "Binding Service Account to repository in Identity Pool..."
gcloud iam service-accounts add-iam-policy-binding $saEmail `
    --role="roles/iam.workloadIdentityUser" `
    --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/attribute.repository/${GITHUB_REPO}" `
    --project=$PROJECT_ID > $null

# 8. Configure GitHub Repository Secrets/Variables via GitHub CLI (gh)
Write-Host "`n7. Configuring GitHub Repository secrets & variables..." -ForegroundColor Green

$wifProvider = "projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-pool/providers/github-provider"

Write-Host "Setting GITHUB variables..."
gh variable set GCP_PROJECT_ID --body "$PROJECT_ID" --repo "$GITHUB_REPO"
gh variable set GCP_REGION --body "$REGION" --repo "$GITHUB_REPO"
gh variable set GCP_SERVICE_ACCOUNT --body "$saEmail" --repo "$GITHUB_REPO"
gh variable set GCP_WORKLOAD_IDENTITY_PROVIDER --body "$wifProvider" --repo "$GITHUB_REPO"
if ($secretsList) {
    gh variable set GCP_SECRETS_LIST --body "$secretsList" --repo "$GITHUB_REPO"
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "GCP & GitHub Provisioning Completed!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
