import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// attach token to every request automatically if user is logged in
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("gaadiUser"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
