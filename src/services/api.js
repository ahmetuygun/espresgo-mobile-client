import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://172.27.1.38:3001/bon-appetit/api/v1',
});

export const apiLogin = axios.create({
  baseURL: 'http://192.168.1.105:5000/api',
});

export const API_BASE_URL = 'http://192.168.1.105:5000/api';
export const ACCESS_TOKEN = 'accessToken';
