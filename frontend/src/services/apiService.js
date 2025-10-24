// src/services/apiService.js
import axios from 'axios';
import { getToken } from './authService';
const API = 'http://localhost:5000/api';

const instance = axios.create({
  baseURL: API
});

// attach token if exists
const token = getToken();
if (token) instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export default instance;
