import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use local IP for device testing, localhost for simulator
const API_URL = 'http://192.168.1.100:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    try {
        consttoken = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.error('Error getting token', error);
    }
    return config;
});

export const authAPI = {
    login: (data: any) => api.post('/auth/login', data),
    register: (data: any) => api.post('/auth/register', data),
    getMe: () => api.get('/auth/me'),
};

export const postsAPI = {
    getAll: (page = 1) => api.get(`/posts?page=${page}`),
    getById: (id: string) => api.get(`/posts/${id}`),
};
