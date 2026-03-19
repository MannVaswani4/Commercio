import axios from 'axios';

// In production, VITE_API_URL points to the Railway backend.
// In development, Vite's proxy rewrites /api → localhost:5001
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // send cookies (refresh token)
});

// --- Request Interceptor ---
// Reads accessToken from Zustand store and attaches it as Bearer header.
// Import is lazy (inside callback) to avoid circular dependency at module load.
api.interceptors.request.use((config) => {
    try {
        const raw = localStorage.getItem('auth-storage');
        if (raw) {
            const { state } = JSON.parse(raw);
            const token = state?.userInfo?.accessToken;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
    } catch { /* ignore parse errors */ }
    return config;
});

// --- Response Interceptor ---
// On 401 (expired access token), try to refresh using the HTTP-only cookie.
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(
                    `${baseURL}/users/refresh`,
                    null,
                    { withCredentials: true }
                );
                // Update stored token so the request interceptor uses it next time
                try {
                    const raw = localStorage.getItem('auth-storage');
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        if (parsed.state?.userInfo) {
                            parsed.state.userInfo.accessToken = data.accessToken;
                            localStorage.setItem('auth-storage', JSON.stringify(parsed));
                        }
                    }
                } catch { /* ignore */ }

                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token expired or missing', refreshError);
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
