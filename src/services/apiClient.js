import axios from 'axios';
import router from '@/router';
import store from '@/store';

function getToken() {
    return localStorage.getItem('authToken');
}

const apiClient = axios.create({
    baseURL: 'https://backend.auto555.az/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(
    config => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401 && !store.state.logoutInProgress) {
            store.dispatch('logout').then(() => {
                router.push('/login').catch(err => {
                    console.error('Router redirect error:', err);
                });
            });
        }
        return Promise.reject(error);
    }
);

export default apiClient;
