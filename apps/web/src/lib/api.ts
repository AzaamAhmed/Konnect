import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
    search: (query: string, filters?: any) => api.get('/users/search', { params: { q: query, ...filters } }),
    getById: (id: string) => api.get(`/users/${id}`),
    getNearby: (lat: number, lng: number, radius?: number) =>
        api.get('/users/nearby', { params: { lat, lng, radius } }),
    updateProfile: (id: string, data: any) => api.put(`/users/${id}`, data),
};

// Posts API
export const postsAPI = {
    getAll: (filters?: any, page?: number) => api.get('/posts', { params: { ...filters, page } }),
    getById: (id: string) => api.get(`/posts/${id}`),
    create: (data: any) => api.post('/posts', data),
    apply: (id: string, message: string) => api.post(`/posts/${id}/apply`, { message }),
    addComment: (id: string, content: string, parentId?: string) =>
        api.post(`/posts/${id}/comments`, { content, parentId }),
    addReaction: (id: string, type: string) => api.post(`/posts/${id}/reactions`, { type }),
    bookmark: (id: string) => api.post(`/posts/${id}/bookmark`),
};

// Groups API
export const groupsAPI = {
    getAll: () => api.get('/groups'),
    getById: (id: string) => api.get(`/groups/${id}`),
    create: (data: any) => api.post('/groups', data),
    join: (id: string) => api.post(`/groups/${id}/join`),
};

// Messages API
export const messagesAPI = {
    getConversations: () => api.get('/messages/conversations'),
    getMessages: (groupId?: string, userId?: string) =>
        api.get('/messages', { params: { groupId, userId } }),
};

// Storage API
export const storageAPI = {
    uploadAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/storage/upload/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadDocument: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/storage/upload/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    uploadImage: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/storage/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
};

// Events API
export const eventsAPI = {
    getAll: (filters?: any) => api.get('/events', { params: filters }),
    getById: (id: string) => api.get(`/events/${id}`),
    create: (data: any) => api.post('/events', data),
    update: (id: string, data: any) => api.patch(`/events/${id}`, data),
    delete: (id: string) => api.delete(`/events/${id}`),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllUsers: (page = 1, limit = 10) => api.get('/admin/users', { params: { page, limit } }),
    verifyUser: (id: string) => api.patch(`/admin/users/${id}/verify`),
    deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
};
