import axios from 'axios';
import { firebaseAuth } from '../config/fireBase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    const user = firebaseAuth.currentUser;

    if (user) {
      try {
        const token = await user.getIdToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error(error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
