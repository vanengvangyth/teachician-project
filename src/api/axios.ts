import axios from "axios";
import { useLoadingStore } from "../stores/loading";
import { apiURL } from "../global-variables";

const api = axios.create({
  baseURL: apiURL,
});

// ເລີ່ມ loading ກ່ອນສົ່ງ request
api.interceptors.request.use((config) => {
  const loading = useLoadingStore();
  loading.start();
  return config;
});

// ປິດ loading ເມື່ອ response ກັບມາ
api.interceptors.response.use(
  (res) => {
    const loading = useLoadingStore();
    loading.stop();
    return res;
  },
  (err) => {
    const loading = useLoadingStore();
    loading.stop();
    return Promise.reject(err);
  }
);

export default api;