// src/utils/api.ts
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8000/api/';

// Function to refresh the access token using the refresh token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh');
    if (!refreshToken) {
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}login/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });
        const data = await response.json();
        if (response.ok && data.access) {
            localStorage.setItem('access', data.access);
            return data.access;
        } else {
            // Refresh failed, clear tokens and redirect to login
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.href = '/login';
            return null;
        }
    } catch (error) {
        console.error('Token refresh failed:', error);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return null;
    }
};

// Custom fetch function with token refresh logic
export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const accessToken = localStorage.getItem('access');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    // If request fails with 401, try to refresh the token and retry
    if (response.status === 401 && accessToken) {
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        }
    }

    return response;
};