import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Request interceptor: attach Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ksep_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('ksep_token');
      localStorage.removeItem('ksep_userId');
      localStorage.removeItem('ksep_role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerUser = (data) => api.post('/api/auth/register', data);
export const loginUser = (data) => api.post('/api/auth/login', data);

// Campus APIs
export const createProgramme = (data) => api.post('/api/campus/programmes', data);
export const getOwnProgrammes = () => api.get('/api/campus/programmes');
export const updateProgramme = (id, data) => api.put(`/api/campus/programmes/${id}`, data);
export const updateProgrammeStatus = (id, status) => 
  api.patch(`/api/campus/programmes/${id}/status?status=${status}`);
export const getInterestsForProgramme = (progId) => 
  api.get(`/api/campus/interests/${progId}`);

// Corporate APIs
export const browseProgrammes = (filters) => 
  api.get('/api/corporate/programmes', { params: filters });
export const expressInterest = (progId) => 
  api.post(`/api/corporate/interest/${progId}`, {});
export const getMyShortlist = () => api.get('/api/corporate/interests');

// Admin APIs
export const getAdminStats = () => api.get('/api/admin/stats');
export const getAdminProgrammes = () => api.get('/api/admin/programmes');
export const getAdminDeals = () => api.get('/api/admin/deals');
export const getAdminCorporates = () => api.get('/api/admin/corporates');

// Matchmaking APIs
export const getMatchedPairs = () => api.get('/api/match/results');
export const closeDeal = (id, data) => api.post(`/api/match/close/${id}`, data);

export default api;
