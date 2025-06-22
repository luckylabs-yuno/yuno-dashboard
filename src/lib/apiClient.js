const API_BASE_URL = 'https://api.helloyuno.com';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('yuno_dashboard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Dashboard Authentication
  async verifyDashboardToken() {
    return this.request('/dashboard/auth/verify-token', {
      method: 'POST'
    });
  }

  async refreshDashboardToken() {
    return this.request('/dashboard/auth/refresh-token', {
      method: 'POST'
    });
  }

  async dashboardLogout() {
    return this.request('/dashboard/auth/logout', {
      method: 'POST'
    });
  }

  // User Profile
  async getUserProfile() {
    return this.request('/dashboard/user/profile');
  }

  async updateUserProfile(data) {
    return this.request('/dashboard/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Existing analytics methods (keep your current ones)
  // ... existing methods from your current apiClient
}

export const apiClient = new APIClient();