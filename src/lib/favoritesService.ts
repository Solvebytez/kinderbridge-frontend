import { apiClient } from "./api";

/**
 * Favorites Service
 * Handles all favorites API calls
 */

export interface FavoriteResponse {
  _id: string;
  userId: string;
  daycareId: string;
  createdAt: string;
  updatedAt: string;
  daycare: {
    _id?: string;
    id?: string;
    name: string;
    address: string;
    city: string;
    price?: string;
    monthlyFee?: number;
    image?: string;
    status?: string;
    availability?: string;
    [key: string]: unknown;
  };
}

export interface FavoritesApiResponse {
  success: boolean;
  data: FavoriteResponse[];
  metadata?: {
    totalCount: number;
    timestamp: string;
  };
}

/**
 * Get user's favorites
 */
export const getFavorites = async (): Promise<FavoritesApiResponse> => {
  const response = await apiClient.get<FavoritesApiResponse>("/api/favorites");
  return response.data;
};

/**
 * Add daycare to favorites
 */
export const addFavorite = async (
  daycareId: string
): Promise<{ success: boolean; data: FavoriteResponse; message?: string }> => {
  const response = await apiClient.post<{
    success: boolean;
    data: FavoriteResponse;
    message?: string;
  }>("/api/favorites", {
    daycareId,
  });
  return response.data;
};

/**
 * Remove daycare from favorites
 */
export const removeFavorite = async (
  daycareId: string
): Promise<{
  success: boolean;
  data: { removed: boolean; message: string };
}> => {
  const response = await apiClient.delete<{
    success: boolean;
    data: { removed: boolean; message: string };
  }>(`/api/favorites/${daycareId}`);
  return response.data;
};

/**
 * Check if daycare is favorited
 */
export const checkFavorite = async (
  daycareId: string
): Promise<{ success: boolean; data: { isFavorited: boolean } }> => {
  const response = await apiClient.get<{
    success: boolean;
    data: { isFavorited: boolean };
  }>(`/api/favorites/check/${daycareId}`);
  return response.data;
};
