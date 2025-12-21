import { apiClient } from "./api";

/**
 * Contact Logs Service
 * Handles all contact logs API calls
 */

export interface ContactLogResponse {
  _id: string;
  userId: string;
  daycareId: string;
  contactMethod: string;
  purpose: string;
  notes: string;
  outcome?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
  daycare?: {
    _id?: string;
    id?: string;
    name?: string;
    address?: string;
    city?: string;
    [key: string]: any;
  };
}

export interface CreateContactLogRequest {
  daycareId: string;
  contactMethod: string;
  purpose: string;
  notes: string;
  outcome?: string;
  followUpDate?: string;
}

export interface ContactLogsApiResponse {
  success: boolean;
  data: ContactLogResponse[];
  metadata?: {
    totalCount: number;
    timestamp: string;
  };
}

/**
 * Create a new contact log
 */
export const createContactLog = async (
  contactLogData: CreateContactLogRequest
): Promise<{
  success: boolean;
  data: ContactLogResponse;
  message?: string;
}> => {
  const response = await apiClient.post<{
    success: boolean;
    data: ContactLogResponse;
    message?: string;
  }>("/api/contact-logs", contactLogData);
  return response.data;
};

/**
 * Get user's contact logs
 */
export const getUserContactLogs = async (): Promise<ContactLogsApiResponse> => {
  const response = await apiClient.get<ContactLogsApiResponse>(
    "/api/contact-logs"
  );
  return response.data;
};

/**
 * Get contact logs for a specific daycare
 */
export const getDaycareContactLogs = async (
  daycareId: string
): Promise<ContactLogsApiResponse> => {
  const response = await apiClient.get<ContactLogsApiResponse>(
    `/api/contact-logs/daycare/${daycareId}`
  );
  return response.data;
};

/**
 * Update a contact log
 */
export const updateContactLog = async (
  contactLogId: string,
  updateData: Partial<CreateContactLogRequest>
): Promise<{
  success: boolean;
  data: ContactLogResponse;
  message?: string;
}> => {
  const response = await apiClient.put<{
    success: boolean;
    data: ContactLogResponse;
    message?: string;
  }>(`/api/contact-logs/${contactLogId}`, updateData);
  return response.data;
};

/**
 * Delete a contact log
 */
export const deleteContactLog = async (
  contactLogId: string
): Promise<{
  success: boolean;
  data: { deleted: boolean; id: string };
  message?: string;
}> => {
  const response = await apiClient.delete<{
    success: boolean;
    data: { deleted: boolean; id: string };
    message?: string;
  }>(`/api/contact-logs/${contactLogId}`);
  return response.data;
};


