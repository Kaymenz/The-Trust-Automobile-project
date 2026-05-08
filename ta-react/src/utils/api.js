// API Service for Trust Automobile
// Integrates with NestJS backend

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace(/\/$/, '');
const REQUEST_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('ta_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('ta_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('ta_token');
  }

  buildUrl(endpoint, query) {
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseURL}${normalizedEndpoint}`);

    if (query && typeof query === 'object') {
      Object.entries(query).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        if (Array.isArray(value)) {
          value.forEach((v) => {
            if (v !== undefined && v !== null && v !== '') {
              url.searchParams.append(key, String(v));
            }
          });
          return;
        }
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  async parseResponseBody(response) {
    const contentType = response.headers.get('content-type') || '';
    if (response.status === 204) return null;
    if (contentType.includes('application/json')) {
      return response.json().catch(() => ({}));
    }
    return response.text().catch(() => '');
  }

  async request(endpoint, options = {}) {
    const {
      query,
      timeoutMs = REQUEST_TIMEOUT_MS,
      retries = 0,
      ...fetchOptions
    } = options;
    const url = this.buildUrl(endpoint, query);
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...fetchOptions.headers,
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    let attempt = 0;

    try {
      while (attempt <= retries) {
        try {
          const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal,
          });

          const responseData = await this.parseResponseBody(response);

          if (!response.ok) {
            const message = Array.isArray(responseData?.message)
              ? responseData.message.join(', ')
              : (responseData?.message || `HTTP ${response.status}: ${response.statusText}`);

            if (response.status === 401) {
              this.clearToken();
              window.dispatchEvent(new CustomEvent('ta:unauthorized'));
            }

            throw new ApiError(message, response.status, responseData);
          }

          return responseData;
        } catch (error) {
          const isAbortError = error?.name === 'AbortError';
          const isNetworkError = error instanceof TypeError;
          const canRetry = attempt < retries && (isNetworkError || isAbortError || error?.status >= 500);

          if (!canRetry) {
            if (isAbortError) {
              throw new ApiError('Request timed out. Please try again.', 408);
            }
            throw error instanceof ApiError ? error : new ApiError(error.message || 'Network request failed');
          }
        }

        attempt += 1;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  // ==================== AUTHENTICATION ====================

  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.accessToken) {
      this.setToken(data.accessToken);
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.accessToken) {
      this.setToken(data.accessToken);
    }
    return data;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    this.clearToken();
  }

  // ==================== USERS ====================

  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async updateUser(id, data) {
    return this.request(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  // ==================== LISTINGS (CAR SALES) ====================

  async getListings(filters = {}) {
    return this.request('/listings', { query: filters, retries: 1 });
  }

  async getListing(id) {
    return this.request(`/listings/${id}`);
  }

  async createListing(data) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateListing(id, data) {
    return this.request(`/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyListings() {
    return this.request('/listings/my/listings');
  }

  async getFeaturedListings() {
    return this.request('/listings/featured');
  }

  async getCarMakes() {
    return this.request('/listings/makes');
  }

  async getCarModels(make) {
    return this.request(`/listings/models?make=${encodeURIComponent(make)}`);
  }

  async getListingStats() {
    return this.request('/listings/stats');
  }

  // ==================== RENTAL FLEET ====================

  async getFleetCars(filters = {}) {
    return this.request('/fleet', { query: filters, retries: 1 });
  }

  async getAvailableFleet(filters = {}) {
    return this.request('/fleet/available', { query: filters, retries: 1 });
  }

  async getFleetCar(id) {
    return this.request(`/fleet/${id}`);
  }

  async getFleetCategories() {
    return this.request('/fleet/categories');
  }

  async checkAvailability(id, startDate, endDate) {
    return this.request(`/fleet/${id}/availability`, {
      query: { startDate, endDate },
      retries: 1,
    });
  }

  // ==================== SPARE PARTS ====================

  async getSpareParts(filters = {}) {
    return this.request('/spare-parts', { query: filters, retries: 1 });
  }

  async getSparePart(id) {
    return this.request(`/spare-parts/${id}`);
  }

  async createSparePart(data) {
    return this.request('/spare-parts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSparePart(id, data) {
    return this.request(`/spare-parts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteSparePart(id) {
    return this.request(`/spare-parts/${id}`, {
      method: 'DELETE',
    });
  }

  async getMySpareParts() {
    return this.request('/spare-parts/my/parts');
  }

  async getPartCategories() {
    return this.request('/spare-parts/categories');
  }

  // ==================== MECHANICS ====================

  async getMechanics(filters = {}) {
    return this.request('/mechanics', { query: filters, retries: 1 });
  }

  async getMechanic(id) {
    return this.request(`/mechanics/${id}`);
  }

  async createMechanicProfile(data) {
    return this.request('/mechanics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMechanicProfile(id, data) {
    return this.request(`/mechanics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async getMyMechanicProfile() {
    return this.request('/mechanics/my/profile');
  }

  async getMechanicSpecializations() {
    return this.request('/mechanics/specializations');
  }

  async getMechanicCities() {
    return this.request('/mechanics/cities');
  }

  async findNearbyMechanics(lat, lng, maxDistance = 10000) {
    return this.request('/mechanics/nearby', {
      query: { lat, lng, maxDistance: maxDistance.toString() },
      retries: 1,
    });
  }
}

// Export singleton instance
export const api = new ApiService();

// Export class for potential customization
export default ApiService;
export { ApiError };
