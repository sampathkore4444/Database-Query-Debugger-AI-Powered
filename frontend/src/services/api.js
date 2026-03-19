const API_BASE_URL = 'http://localhost:8000/api/v1';

// Central fetch interceptor to easily attach Authorization Bearer tokens to all outbound requests
const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });

    if (response.status === 401 && window.location.pathname !== '/login') {
        // Auto logout on token expiration / unauthorized error
        localStorage.removeItem('token');
        localStorage.removeItem('user_email');
        window.location.href = '/login';
        throw new Error("Session expired. Please log in again.");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'API Request Failed');
    }

    return response.json();
};

export const loginContent = async (username, password) => {
    // OAuth2 standard expects secure x-www-form-urlencoded format, not JSON strings
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed');
    }
    return response.json();
};

export const registerContent = async (email, password) => {
    return fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
};

export const getInboxQueries = async () => {
    return fetchWithAuth('/queries/inbox');
};
