import ax from "axios";
import { InMemorySessionStore } from "./sessionStore";
import { AuthApi } from "./auth";
import { SelfApi } from "./self";
import { UserApi } from "./users";
import { NodeApi } from "./nodes";
import { ServerApi } from "./servers";
import { TemplateApi } from "./templates";
import { SettingsApi } from "./settings";

export class ApiClient {
  _axios = null;
  _host = null;
  _basePath = null;
  _errorHandler = null;
  auth = null;
  self = null;
  server = null;
  node = null;
  user = null;
  template = null;

  constructor(
    host,
    sessionStore = new InMemorySessionStore(),
    errorHandler,
    axios = ax.create(),
    basePath = ""
  ) {
    this._axios = axios;
    this._host = host;
    this._basePath = basePath || this.getBasePathFromWindow();
    this._errorHandler = errorHandler;
    this.auth = new AuthApi(this, sessionStore);
    this.self = new SelfApi(this);
    this.server = new ServerApi(this);
    this.node = new NodeApi(this);
    this.user = new UserApi(this);
    this.template = new TemplateApi(this);
    this.settings = new SettingsApi(this);
  }

  getBasePathFromWindow() {
    const metaTag = document.querySelector('meta[name="panel-base"]');
    if (metaTag) {
      return metaTag.getAttribute("content") || "";
    }
    return window.__PUFFERPANEL_BASE__ || "";
  }

  _buildUrl(url) {
    // If no base path, just return host + url
    if (!this._basePath || this._basePath === "") {
      return this._host + url;
    }

    // If URL already includes base path, don't add it again
    if (url.startsWith(this._basePath)) {
      return this._host + url;
    }

    // Ensure proper slash handling
    let cleanBasePath = this._basePath;
    let cleanUrl = url;

    // Remove trailing slash from basePath if present
    if (cleanBasePath.endsWith("/")) {
      cleanBasePath = cleanBasePath.slice(0, -1);
    }

    // Add leading slash to basePath if missing
    if (!cleanBasePath.startsWith("/")) {
      cleanBasePath = "/" + cleanBasePath;
    }

    // Add leading slash to url if missing
    if (!cleanUrl.startsWith("/")) {
      cleanUrl = "/" + cleanUrl;
    }

    // Build final URL
    return this._host + cleanBasePath + cleanUrl;
  }

  _handleError(e) {
    console.error(e);
    const status = ((e || {}).response || {}).status;
    const statusText = ((e || {}).response || {}).statusText;
    const response = ((e || {}).response || {}).data;
    const request = (e || {}).config;
    let code = "ErrUnknownError";
    let msg;
    const error = (((e || {}).response || {}).data || {}).error;
    if ((error || {}).code) code = error.code;
    if ((error || {}).msg) msg = error.msg;
    const result = { status, statusText, response, request, code, msg };
    if (this._errorHandler) this._errorHandler(result);
    throw result;
  }

  _enhanceHeaders(headers) {
    const token = this.auth.getToken();
    if (token) {
      return {
        ...headers,
        Authorization: "Bearer " + token,
      };
    }
    return headers;
  }

  async head(url, params = {}, headers = {}, options = {}) {
    try {
      return await this._axios.head(this._buildUrl(url), {
        params,
        ...options,
        headers: this._enhanceHeaders(headers),
      });
    } catch (e) {
      if (typeof options.onError === "function") {
        const res = options.onError(e);
        if (res) return res;
      }
      if (
        !Array.isArray(options.unhandledErrors) ||
        options.unhandledErrors.indexOf(e.response.status) === -1
      )
        this._handleError(e);
    }
  }

  async get(url, params = {}, headers = {}, options = {}) {
    try {
      return await this._axios.get(this._buildUrl(url), {
        params,
        ...options,
        headers: this._enhanceHeaders(headers),
      });
    } catch (e) {
      if (typeof options.onError === "function") {
        const res = options.onError(e);
        if (res) return res;
      }
      if (
        !Array.isArray(options.unhandledErrors) ||
        options.unhandledErrors.indexOf(e.response.status) === -1
      )
        this._handleError(e);
    }
  }

  async post(url, data, params = {}, headers = {}, options = {}) {
    try {
      return await this._axios.post(this._buildUrl(url), data, {
        params,
        ...options,
        headers: this._enhanceHeaders(headers),
      });
    } catch (e) {
      if (typeof options.onError === "function") {
        const res = options.onError(e);
        if (res) return res;
      }
      if (
        !Array.isArray(options.unhandledErrors) ||
        options.unhandledErrors.indexOf(e.response.status) === -1
      )
        this._handleError(e);
    }
  }

  async put(url, data, params = {}, headers = {}, options = {}) {
    try {
      return await this._axios.put(this._buildUrl(url), data, {
        params,
        ...options,
        headers: this._enhanceHeaders(headers),
      });
    } catch (e) {
      if (typeof options.onError === "function") {
        const res = options.onError(e);
        if (res) return res;
      }
      if (
        !Array.isArray(options.unhandledErrors) ||
        options.unhandledErrors.indexOf(e.response.status) === -1
      )
        this._handleError(e);
    }
  }

  async delete(url, params = {}, headers = {}, options = {}) {
    try {
      return await this._axios.delete(this._buildUrl(url), {
        params,
        ...options,
        headers: this._enhanceHeaders(headers),
      });
    } catch (e) {
      if (typeof options.onError === "function") {
        const res = options.onError(e);
        if (res) return res;
      }
      if (
        !Array.isArray(options.unhandledErrors) ||
        options.unhandledErrors.indexOf(e.response.status) === -1
      )
        this._handleError(e);
    }
  }

  async getConfig() {
    const res = await this.get("/api/config");
    return res.data;
  }

  async getTheme(name) {
    const res = await this.get(`/theme/${name}.tar`, undefined, undefined, {
      responseType: "arraybuffer",
    });
    return res.data;
  }
}
