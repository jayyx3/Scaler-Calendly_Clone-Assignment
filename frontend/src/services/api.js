import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Event Types API
export const eventTypesAPI = {
  getAll: () => api.get('/event-types'),
  getBySlug: (slug) => api.get(`/event-types/${slug}`),
  create: (data) => api.post('/event-types', data),
  update: (id, data) => api.put(`/event-types/${id}`, data),
  delete: (id) => api.delete(`/event-types/${id}`),
};

// Availability API
export const availabilityAPI = {
  getAll: () => api.get('/availability'),
  upsert: (data) => api.post('/availability', data),
  delete: (id) => api.delete(`/availability/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAvailableSlots: (date, eventTypeId) => 
    api.get('/bookings/slots', { params: { date, eventTypeId } }),
  create: (data) => api.post('/bookings', data),
  getMeetings: (filter) => 
    api.get('/bookings/meetings', { params: { filter } }),
  cancel: (id) => api.put(`/bookings/meetings/${id}/cancel`),
};

export default api;
