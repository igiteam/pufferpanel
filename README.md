# PufferPanel [![Release](https://img.shields.io/github/release/PufferPanel/PufferPanel.svg?maxAge=3600)](https://github.com/PufferPanel/PufferPanel/releases) [![Downloads](https://img.shields.io/github/downloads/PufferPanel/PufferPanel/total.svg?maxAge=3600)](https://github.com/PufferPanel/PufferPanel/releases) ![Build](https://github.com/PufferPanel/PufferPanel/workflows/Build/badge.svg)

[![PufferPanel logo](https://raw.githubusercontent.com/pufferpanel/www/master/logo-alt.png "PufferPanel")](https://pufferpanel.com)

[Website](https://pufferpanel.com) |
[Discord](https://discord.gg/v8dz49e) |
[Documentation](https://docs.pufferpanel.com/) |
[Translations](https://crowdin.com/project/pufferpanel)

## What is PufferPanel?

PufferPanel is a web-based Game Server Management System. PufferPanel allows you to manage multiple different game servers all from one central location. You can give other users their own servers or allow them to access to your servers.

## ⚠️ Custom Build - Subpath Support

This fork includes **subdirectory support** for running PufferPanel at `/pufferpanel` instead of needing a subdomain.

### Changes made to the source code:

**1. API Client Base Path** - `client/api/src/client.js`

- Added `basePath` parameter to `ApiClient` constructor
- Added `_buildUrl()` method to prepend base path to all API requests
- Added `getBasePathFromWindow()` to read base path from meta tag or window variable
- Modified all HTTP methods (get, post, put, delete, head) to use `_buildUrl()`

**2. Frontend API Plugin** - `client/frontend/src/plugins/api.js`

- Read base path from meta tag or `window.__PUFFERPANEL_BASE__`
- Pass `BASE_PATH` as parameter when creating `ApiClient` instance
- Sets `location.origin + BASE_PATH` as the API host

**3. Main Application** - `client/frontend/src/main.js`

- Added base path detection for service worker registration
- Service worker registers with correct scope at `${BASE_PATH}/sw.js`
- Optional verification that `apiClient` has correct base path

**4. Router Configuration** - `client/frontend/src/router/index.js`

- Changed `createWebHistory()` to use base path dynamically
- Router now reads base path from meta tag or window variable

**5. HTML Template** - `client/frontend/index.html`

- Added `<meta name="panel-base" content="/pufferpanel">` tag
- Added `window.__PUFFERPANEL_BASE__ = '/pufferpanel'` script

**6. Vite Configuration** - `client/frontend/vite.config.js`

- Added `base: '/pufferpanel/'` for asset bundling

**7. Nginx Configuration** (not in source, but required for deployment)

- Location block: `location /pufferpanel/ { proxy_pass http://127.0.0.1:6902/; }`
- Added `proxy_set_header X-Forwarded-Prefix /pufferpanel;`

### Docker image:

`ghcr.io/igiteam/pufferpanel:branch-v3` (custom build with subpath support)

### Build instructions:

```bash
# Clone and modify source
git clone https://github.com/igiteam/pufferpanel
cd pufferpanel

# Apply changes to files listed above

# Build frontend
cd client/frontend && npm run build
cd ../api && npm run build

# Build Docker image
cd ../..
docker build -t pufferpanel-subpath .

# Or use pre-built image
docker pull ghcr.io/igiteam/pufferpanel:branch-v3

# Nginx configuration required:
# location /pufferpanel/ {
#     proxy_pass http://127.0.0.1:6902/;
#     proxy_set_header Host $host;
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header X-Forwarded-Proto $scheme;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection "upgrade";
#     proxy_read_timeout 300s;
#     proxy_send_timeout 300s;
#     proxy_redirect off;
#     proxy_set_header X-Forwarded-Prefix /pufferpanel;
# }

# Usage:

# Access your panel at https://your-domain.com/pufferpanel/ instead of https://pufferpanel.your-domain.com/
# Verification:
# All API calls will now go to:
#     ✅ https://your-domain.com/pufferpanel/api/config
#     ✅ https://your-domain.com/pufferpanel/auth/login
#     ✅ https://your-domain.com/pufferpanel/api/servers

# Instead of:
#     ❌ https://your-domain.com/api/config (404 without subpath)
#     ❌ https://your-domain.com/auth/login (404 without subpath)

# Environment variables (optional):
#     PANEL_BASE_PATH=/pufferpanel - Can be set in docker-compose.yml for backend configuration

# WineJS Integration Details
# Admin User Creation

# The WineJS installer handles admin user creation non-interactively:
# # Binary path discovery
# PUFFER_BIN=$(docker exec winejs-pufferpanel find / -name "pufferpanel" -type f -executable 2>/dev/null | head -1)
# # Falls back to: /pufferpanel/bin/pufferpanel

# # Non-interactive user creation (no -i flag, no stdin waiting)
# docker exec winejs-pufferpanel $PUFFER_BIN user add \
#     --email "$ADMIN_EMAIL" \
#     --password "$ADMIN_PASSWORD" \
#     --admin \
#     --name Admin

# Key points:
#     Uses placeholders in heredoc to prevent variable expansion issues
#     Replaces placeholders with sed after heredoc
#     No -i flag on docker exec to avoid interactive prompts
#     Falls back to discovered binary path (supports different image structures)

# Nginx Configuration for API Routing

# The installer automatically adds nginx location blocks to handle both the UI and API routes:

# # Redirect /pufferpanel to /pufferpanel/ (trailing slash)
# location /pufferpanel {
#     return 301 /pufferpanel/;
# }

# # CRITICAL: Handle API routes BEFORE main location
# # This catches /auth/*, /api/*, /sw.js, /manifest.json
# location ~ ^/(auth|api|sw.js|manifest.json) {
#     rewrite ^/(.*)$ /pufferpanel/$1 break;
#     proxy_pass http://127.0.0.1:${APP_PORT};
#     proxy_set_header Host $host;
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header X-Forwarded-Proto $scheme;
#     proxy_set_header X-Forwarded-Prefix /pufferpanel;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection "upgrade";
# }

# # Main PufferPanel UI location
# location /pufferpanel/ {
#     proxy_pass http://127.0.0.1:${APP_PORT}/;
#     proxy_set_header Host $host;
#     proxy_set_header X-Real-IP $remote_addr;
#     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
#     proxy_set_header X-Forwarded-Proto $scheme;
#     proxy_set_header X-Forwarded-Prefix /pufferpanel;
#     proxy_http_version 1.1;
#     proxy_set_header Upgrade $http_upgrade;
#     proxy_set_header Connection "upgrade";
#     proxy_read_timeout 300s;
#     proxy_send_timeout 300s;
#     proxy_redirect off;

#     # SPA support - redirect all missing routes to index.html
#     proxy_intercept_errors on;
#     error_page 404 = /index.html;
# }

# Why API routes need special handling:

# The PufferPanel frontend makes API calls to /auth/login and /api/config (without the /pufferpanel prefix). The location ~ ^/(auth|api|sw.js|manifest.json) block catches these and rewrites them to /pufferpanel/auth/login before proxying.
# Configuration Files

# Docker Compose environment:

# environment:
#   - PANEL_URL=https://${DOMAIN_NAME}/pufferpanel
#   # Plus DB connection variables

# PufferPanel config.json:

# {
#   "web": {
#     "basePath": "/pufferpanel",
#     "host": "0.0.0.0:8080"
#   },
#   "panel": {
#     "settings": {
#       "masterUrl": "https://${DOMAIN_NAME}/pufferpanel"
#     }
#   },
#   "branding": {
#     "name": "PufferPanel",
#     "description": "Game Server Management Panel"
#   }
# }

# Port Management
#     Automatically finds next available port (starting from 6901)
#     Allocates separate port for SFTP (APP_PORT + 1)
#     Checks existing WineJS apps to avoid port conflicts
#     Opens game server ports range (27015-27030)

# Registry Integration
#     App registers with WineJS translator via /opt/winejs/apps/pufferpanel/config.json
#     Icon stored at /opt/winejs/translator/public/icons/pufferpanel.png
#     PM2 restarts translator to detect new app

# Uninstall Handling
#     Stops and removes Docker containers
#     Removes all data directories
#     Cleans nginx routes using Perl or sed (with backup/restore)
#     Asks about removing Docker images
#     Restarts translator to remove app from registry

# This integration allows PufferPanel to run seamlessly under WineJS without requiring a separate subdomain, making it work with the existing SSL certificate and domain structure.

## Installation

Please follow the installation guide for PufferPanel located [here](https://docs.pufferpanel.com/en/latest/installing.html).

### What's different about PufferPanel?

In addition to being a free and open source project, PufferPanel provides an easy-to-use interface for everyone from individual users to large networks. We strive to create a friendly community, and we would love for you to join us.

## Having issues or want to help?

If you need help with PufferPanel, or you'd like to help out, you can contact us on [Discord](https://discord.gg/v8dz49e). Check out our [Documentation](https://docs.pufferpanel.com/) for guides on how to install, update, and manage PufferPanel.

## Copyright Notices

Some Javascript and CSS used is licensed under a MIT, Apache 2.0, or GPL license. Please check their header files for information.

Some images used within PufferPanel are Copyright (c) their respective owners.

## Water Provided By

[![JetBrains logo.](https://resources.jetbrains.com/storage/products/company/brand/logos/jetbrains.svg)](https://jb.gg/OpenSource)

Repositories hosted by [packagecloud](https://packagecloud.io)
```
