import { apiClient } from "../client";
import type { ApiResponse, AuthResult } from "../types";

export const authApi = {
  async login(payload: { email: string; password: string }): Promise<AuthResult> {
    const { data } = await apiClient.post<ApiResponse<AuthResult>>(
      "/auth/login",
      payload,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post("/auth/logout");
  },

  async me() {
    const { data } = await apiClient.get<ApiResponse<AuthResult["user"]>>(
      "/auth/me",
    );
    return data.data;
  },
};
