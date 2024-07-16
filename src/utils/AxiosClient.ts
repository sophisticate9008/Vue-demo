
import axios from 'axios';

// 创建一个axios实例
const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default axiosClient;
