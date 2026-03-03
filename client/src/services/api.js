import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach token to admin requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Public
export const submitQuestion = (data) => API.post('/questions', data);
export const getQuestions = (params) => API.get('/questions', { params });
export const getStats = () => API.get('/questions/stats');

// Admin auth
export const adminLogin = (credentials) => API.post('/admin/login', credentials);

// Admin moderation
export const getPending = () => API.get('/admin/pending');
export const approveQuestion = (id) => API.put(`/admin/approve/${id}`);
export const rejectQuestion = (id) => API.put(`/admin/reject/${id}`);
export const editQuestion = (id, data) => API.put(`/admin/edit/${id}`, data);
export const deleteQuestion = (id) => API.delete(`/admin/delete/${id}`);

// Analytics
export const getAnalytics = () => API.get('/admin/analytics');
