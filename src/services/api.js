import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.102:3001/bon-appetit/api/v1',
});

export const apiLogin = axios.create({
  baseURL: 'https://espresgo.herokuapp.com/api',
});

export const API_BASE_URL = 'https://espresgo.herokuapp.com/api';
export const ACCESS_TOKEN = 'accessToken';
