import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { apiURL } from "../global-variables";

// Create axios instance
const instance = axios.create({
  baseURL: apiURL, // backend URL
  timeout: 5000,
});

// Request interceptor
instance.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  config.headers.Accept = "application/json";
  return config;
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const authStore = useAuthStore();
      authStore.logOut();
    }
    return Promise.reject(error);
  }
);

export default instance;
