// API URL Configuration
// In development: Uses Vite proxy (localhost:3000)
// In production/tunnel: Uses VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('selis_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = API_URL.endsWith('/api') ? `${API_URL}${endpoint}` : `${API_URL}/api${endpoint}`;
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      errorMessage = `Server Error: ${response.status} ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

export const api = {
  auth: {
    login: (credentials: any) => fetchWithAuth('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData: any) => fetchWithAuth('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  },
  transactions: {
    getAll: () => fetchWithAuth('/transactions'),
    create: (data: any) => fetchWithAuth('/transactions', { method: 'POST', body: JSON.stringify(data) }),
  },
  budgets: {
    getAll: () => fetchWithAuth('/budgets'),
    create: (data: any) => fetchWithAuth('/budgets', { method: 'POST', body: JSON.stringify(data) }),
  },
  goals: {
    getAll: () => fetchWithAuth('/goals'),
    create: (data: any) => fetchWithAuth('/goals', { method: 'POST', body: JSON.stringify(data) }),
  },
  subscriptions: {
    getAll: () => fetchWithAuth('/subscriptions'),
    create: (data: any) => fetchWithAuth('/subscriptions', { method: 'POST', body: JSON.stringify(data) }),
    delete: (id: string) => fetchWithAuth(`/subscriptions/${id}`, { method: 'DELETE' }),
  },
};
