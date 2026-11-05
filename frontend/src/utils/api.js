import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Brauzer connect.sid Cookie'sini har bir so'rov bilan yuborishi uchun shart!
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

