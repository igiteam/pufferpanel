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

**Changes made:**

- `client/frontend/vite.config.js` - Added `base: '/pufferpanel/'`
- `client/frontend/src/router/index.js` - Changed `createWebHistory()` to `createWebHistory('/pufferpanel/')`

**Docker image:** `ghcr.io/igiteam/pufferpanel:branch-v3`

**Usage:** Access your panel at `https://your-domain.com/pufferpanel/` instead of `https://pufferpanel.your-domain.com/`

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
