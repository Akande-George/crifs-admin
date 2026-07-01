"use client";

import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/lib/auth/store";

/**
 * Axios client shared across the admin dashboard. Auth token comes from the
 * Zustand store; the response interceptor normalises errors into the same
 * `ApiError` shape the backend uses so consumers can `try/catch` on
 * `err.message` regardless of transport failure.
 *
 * Override the base URL per env with NEXT_PUBLIC_API_BASE_URL.
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.crifs.io/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Any 401 forces re-login. Clearing the store triggers the layout
        // guard which redirects to /login.
        useAuthStore.getState().clear();
      }
      return Promise.reject({
        message:
          (error.response.data as { message?: string })?.message ??
          "An error occurred",
        statusCode: status,
        errors: (error.response.data as { errors?: Record<string, string[]> })
          ?.errors,
      });
    }
    if (error.request) {
      return Promise.reject({
        message: "Network error. Please check your connection.",
        statusCode: 0,
      });
    }
    return Promise.reject({
      message: error.message ?? "An unexpected error occurred",
      statusCode: -1,
    });
  },
);
