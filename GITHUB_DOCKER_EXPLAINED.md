GitHub Docker Build Explained

GitHub Actions can automatically build Docker images from your code and push them to a container registry (like GitHub's own GHCR).

What happens when you push code:

You push code to GitHub
│
▼
GitHub Actions runs build.yml
│
├── 1. Checks out your code
│
├── 2. Builds the frontend (yarn build)
│
├── 3. Builds the Go backend
│
├── 4. Packages everything into a Docker image
│ │
│ └── Uses the Dockerfile in your repo
│
└── 5. Pushes the image to GHCR (GitHub Container Registry)
│
└── Image becomes available at:
ghcr.io/igiteam/pufferpanel:branch-v3

The key components:

1. GitHub Container Registry (GHCR)

   - GitHub's free Docker registry
   - URL: ghcr.io
   - Images stored at: ghcr.io/OWNER/REPO:TAG

2. The tag format

   ghcr.io/igiteam/pufferpanel:branch-v3
   │ │ │ │
   │ │ │ └── Tag (branch name, version, etc.)
   │ │ └── Repository name
   │ └── Your GitHub username
   └── Registry hostname

3. Authentication

   REGISTRY_USERNAME: ${{ github.actor }} # igiteam
   REGISTRY_PASSWORD: ${{ secrets.GITHUB_TOKEN }} # Auto-generated token

   GitHub automatically provides a GITHUB_TOKEN secret that has permission to push to GHCR.

Your current problem:

The tag is missing the registry name (ghcr.io/):

❌ /igiteam/pufferpanel:branch-v3 # Invalid
✅ ghcr.io/igiteam/pufferpanel:branch-v3 # Valid

Why your build failed:

env:
REGISTRY: ${{ vars.REGISTRY != 'docker.com' && vars.REGISTRY || '' }}

This line tries to get REGISTRY from repository variables. Since you haven't set
vars.REGISTRY, it becomes empty '', so the tag becomes /igiteam/pufferpanel:branch-v3
(missing ghcr.io).

How to fix:

Option 1: Set the variable in GitHub UI

- Settings → Secrets and variables → Actions → Variables
- Add: REGISTRY = ghcr.io

Option 2: Hardcode in the workflow file

env:
REGISTRY: ghcr.io
REGISTRY_USERNAME: ${{ github.actor }}
REGISTRY_PASSWORD: ${{ secrets.GITHUB_TOKEN }}

After the build succeeds:

docker pull ghcr.io/igiteam/pufferpanel:branch-v3

And use in docker-compose.yml:

image: ghcr.io/igiteam/pufferpanel:branch-v3

Simple analogy: GitHub Actions = free CI/CD server that builds your code into a Docker
image and uploads it to a free Docker storage (GHCR).
