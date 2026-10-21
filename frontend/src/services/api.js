import axios from 'axios';

const api = axios.create({
  baseURL: 'http://88.200.63.148:1234',
  withCredentials: true,
  timeout: 2000
});

export default api;