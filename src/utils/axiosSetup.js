import axios from 'axios';
import { USER_API_END_POINT } from './constant';
import store from '@/redux/store';
import { setUser } from '@/redux/authSlice';

// Configure global axios default settings
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet and it's not a login/register request
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/login') &&
            !originalRequest.url?.includes('/register') &&
            !originalRequest.url?.includes('/refresh-token')
        ) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axios(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(`${USER_API_END_POINT}/refresh-token`, {}, { withCredentials: true });
                if (res.data.success) {
                    processQueue(null);
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Clear user auth in redux store on failed refresh
                store.dispatch(setUser(null));
                if (window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
