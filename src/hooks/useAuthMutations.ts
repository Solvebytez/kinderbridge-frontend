import { useMutation } from "@tanstack/react-query";
import { apiClient } from "../lib/api";
import { AxiosError } from "axios";

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: "parent" | "provider" | "employer" | "employee";
  phone?: string;
  address?: string;
  children?: Array<{
    name: string;
    age: number;
    specialNeeds?: string;
  }>;
  daycareId?: string;
  role?: string;
  communicationPreferences?: {
    email: boolean;
    sms: boolean;
    promotional: boolean;
    acknowledgement: boolean;
  };
}

interface RegisterResponse {
  success: boolean;
  data: {
    user: {
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      userType: string;
      [key: string]: unknown;
    };
    token: string;
  };
  message?: string;
}

interface RegisterError {
  success: false;
  error: string;
  details?: string[];
}

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, AxiosError<RegisterError>, RegisterData>(
    {
      mutationFn: async (userData: RegisterData) => {
        console.log("🔵 [FRONTEND] Making registration API call...");
        console.log("🔵 [FRONTEND] API Base URL:", apiClient.defaults.baseURL);
        console.log("🔵 [FRONTEND] Endpoint: /api/auth/register");
        console.log("🔵 [FRONTEND] Request data:", {
          email: userData.email,
          hasPassword: !!userData.password,
          hasCommunicationPreferences: !!userData.communicationPreferences,
        });

        const response = await apiClient.post<RegisterResponse>(
          "/api/auth/register",
          userData
        );
        console.log("✅ [FRONTEND] Registration response received:", {
          success: response.data.success,
          status: response.status,
        });
        return response.data;
      },
      retry: false, // Don't retry on failure (prevents duplicate registrations)
    }
  );
};
