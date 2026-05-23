import axios from "axios";
import { router } from "expo-router";
import { getAuth, removeAuth } from "@/lib/auth";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(async (config) => {
  const auth = await getAuth();
  if (auth?.token) {
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      await removeAuth();
      router.replace("/login");
    }
    return Promise.reject(error);
  }
);
