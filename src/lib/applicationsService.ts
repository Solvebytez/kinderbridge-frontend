import { apiClient } from "./api";

/**
 * Applications Service
 * Handles all applications API calls
 */

export interface ApplicationResponse {
  _id: string;
  userId: string;
  daycareId: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  childAge: string;
  daycareType: string;
  startDate: string;
  maxMonthlyFee?: string;
  postalCode?: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  additionalNotes?: string;
  createdAt: string;
  updatedAt: string;
  daycare?: {
    _id?: string;
    id?: string;
    name?: string;
    address?: string;
    city?: string;
    price?: string;
    monthlyFee?: number;
    image?: string;
    [key: string]: unknown;
  };
}

export interface CreateApplicationRequest {
  daycareId: string;
  childAge: string;
  daycareType: string;
  startDate: string;
  maxMonthlyFee?: string;
  postalCode?: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  additionalNotes?: string;
}

export interface ApplicationsApiResponse {
  success: boolean;
  data: ApplicationResponse[];
  metadata?: {
    totalCount: number;
    timestamp: string;
  };
}

/**
 * Create a new application
 */
export const createApplication = async (
  applicationData: CreateApplicationRequest
): Promise<{
  success: boolean;
  data: ApplicationResponse;
  message?: string;
}> => {
  const response = await apiClient.post<{
    success: boolean;
    data: ApplicationResponse;
    message?: string;
  }>("/api/applications", applicationData);
  return response.data;
};

/**
 * Get user's applications
 */
export const getUserApplications =
  async (): Promise<ApplicationsApiResponse> => {
    const response = await apiClient.get<ApplicationsApiResponse>(
      "/api/applications"
    );
    return response.data;
  };

/**
 * Get application by ID
 */
export const getApplicationById = async (
  applicationId: string
): Promise<{ success: boolean; data: ApplicationResponse }> => {
  const response = await apiClient.get<{
    success: boolean;
    data: ApplicationResponse;
  }>(`/api/applications/${applicationId}`);
  return response.data;
};

/**
 * Update application status
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: "pending" | "accepted" | "rejected" | "withdrawn"
): Promise<{
  success: boolean;
  data: ApplicationResponse;
  message?: string;
}> => {
  const response = await apiClient.put<{
    success: boolean;
    data: ApplicationResponse;
    message?: string;
  }>(`/api/applications/${applicationId}/status`, { status });
  return response.data;
};

/**
 * Delete an application
 */
export const deleteApplication = async (
  applicationId: string
): Promise<{
  success: boolean;
  data: { deleted: boolean; id: string };
  message?: string;
}> => {
  const response = await apiClient.delete<{
    success: boolean;
    data: { deleted: boolean; id: string };
    message?: string;
  }>(`/api/applications/${applicationId}`);
  return response.data;
};
