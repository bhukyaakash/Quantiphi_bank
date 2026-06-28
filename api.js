/**
 * API Service Layer
 * Handles all HTTP communication with the backend
 */

const API_BASE_URL = 'http://localhost:5000/api';

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

const API = {
  getTransactions: () => apiRequest('/transactions'),
  getSummary: () => apiRequest('/transactions/summary'),
  createTransaction: (rawText) => apiRequest('/transactions', {
    method: 'POST',
    body: { rawText }
  }),
  updateCategory: (id, category) => apiRequest(`/transactions/${id}/category`, {
    method: 'PUT',
    body: { category }
  }),
  healthCheck: () => apiRequest('/health')
};

window.API = API;
