import axios from 'axios';

export const axiosInstance = axios.create();
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers.microserviceToken = process.env.MICROSERVICE_TOKEN;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
