const API_URL = '/api';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('selis_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
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
