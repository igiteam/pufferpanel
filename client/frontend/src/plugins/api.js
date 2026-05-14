// client/frontend/src/plugins/api.js
import { ApiClient, ServerCookieSessionStore } from 'pufferpanel'

// Get base path from meta tag or window variable
const BASE_PATH = document.querySelector('meta[name="panel-base"]')?.getAttribute('content') || window.__PUFFERPANEL_BASE__ || ''

export const apiClient = new ApiClient(
  location.origin,
  new ServerCookieSessionStore(),
  null,  // errorHandler
  undefined,  // axios
  BASE_PATH  // basePath - this is the key!
)

export default {
  install: (app) => {
    app.config.globalProperties.$api = apiClient
    app.provide('api', apiClient)
    window.pufferpanel.api = apiClient
  }
}