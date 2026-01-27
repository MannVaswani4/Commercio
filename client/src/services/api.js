import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies/refresh tokens
});

// Request Interceptor: Attach Access Token if available (handled mostly by cookie but good for explicit bearer)
// Since we use cookies for refresh token, but maybe we want to store access token in memory or LS?
// The Implementation plan mentioned JWT Access + Refresh.
// Usually Access Token is sent in Header Authorization: Bearer <token>
// We need a way to store the access token. Zustand store will hold it.

// Response Interceptor: Handle 401s (Token Expiry)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post('/api/users/refresh'); // Refresh endpoint
                // We need to update the auth store with the new access token
                // However, avoiding circular dependency with store.
                // Let's just user the new token in the retry
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login or clear auth
                console.error('Refresh token expired', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
