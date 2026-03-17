import axios from 'axios';

// In production, VITE_API_URL points to the Railway backend.
// In development, Vite's proxy rewrites /api → localhost:5001
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies/refresh tokens
});

// Response Interceptor: Handle 401s (Token Expiry)
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${baseURL}/users/refresh`, null, { withCredentials: true });
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token expired', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
