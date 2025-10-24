// src/services/authService.js
import axios from 'axios';
const API = 'http://localhost:5000/api';

export async function login(email, password) {
  const res = await axios.post(`${API}/auth/login`, { email, password });
  return res.data; // { token, user }
}

export function saveToken(token) {
  localStorage.setItem('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export function getToken() {
  return localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
}

export function saveUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

export function getUser() {
  const s = localStorage.getItem('user');
  return s ? JSON.parse(s) : null;
}
