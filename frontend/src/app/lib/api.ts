import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("user");
  if (user) {
    const { id } = JSON.parse(user);
    config.headers.Authorization = `Bearer ${id}`;
  }
  return config;
});
