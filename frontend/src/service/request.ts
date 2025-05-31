import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    return Promise.reject(error);
  }
);