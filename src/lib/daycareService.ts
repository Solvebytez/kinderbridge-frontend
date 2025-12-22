// Daycare Service for MVP - JSON-based data (will be replaced with MongoDB in future)
export interface Daycare {
  id: string;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviewCount: number;
  price: number;
  availability: string;
  ageRange: string;
  features: string[];
  description: string;
  images: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SearchFilters {
  q?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  availability?: string;
  ageRange?: string;
}

export interface SearchResponse {
  success: boolean;
  data: Daycare[];
  metadata: {
    totalResults: number;
    totalDaycares: number;
    filters: SearchFilters;
  };
}

import { apiClient } from "./api";

class DaycareService {
  // Get all daycares
  async getAllDaycares(): Promise<Daycare[]> {
    try {
      const response = await apiClient.get("/api/daycares");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch daycares");
      }
    } catch (error) {
      console.error("Error fetching daycares:", error);
      throw error;
    }
  }

  // Search daycares with filters
  async searchDaycares(filters: SearchFilters): Promise<SearchResponse> {
    try {
      const params: Record<string, string | number | boolean | undefined> = {};

      if (filters.q) params.q = filters.q;
      if (filters.location) params.location = filters.location;
      if (filters.priceMin) params.priceMin = filters.priceMin;
      if (filters.priceMax) params.priceMax = filters.priceMax;
      if (filters.availability) params.availability = filters.availability;
      if (filters.ageRange) params.ageRange = filters.ageRange;

      const response = await apiClient.get("/api/daycares/search", { params });

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || "Search failed");
      }
    } catch (error) {
      console.error("Error searching daycares:", error);
      throw error;
    }
  }

  // Get daycare by ID
  async getDaycareById(id: string): Promise<Daycare> {
    try {
      const response = await apiClient.get(`/api/daycares/detail/${id}`);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Daycare not found");
      }
    } catch (error) {
      console.error("Error fetching daycare:", error);
      throw error;
    }
  }

  // Get all unique locations
  async getLocations(): Promise<string[]> {
    try {
      const response = await apiClient.get("/api/daycares/locations/all");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch locations");
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      throw error;
    }
  }

  // Get daycare statistics
  async getStats() {
    try {
      const response = await apiClient.get("/api/daycares/stats/overview");

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
  }

  // Mock data fallback (for development/testing)
  getMockDaycares(): Daycare[] {
    return [
      {
        id: "dc_0001",
        name: "Little Explorers Academy",
        location: "Toronto",
        address: "123 Nature Way, Toronto, ON",
        phone: "(416) 555-0123",
        email: "hello@littleexplorers.ca",
        website: "https://littleexplorers.ca",
        rating: 4.8,
        reviewCount: 127,
        price: 1800,
        availability: "Available",
        ageRange: "6 months - 5 years",
        features: ["Nature-Inspired Learning", "Outdoor Play", "Healthy Meals"],
        description:
          "A nature-inspired daycare focusing on outdoor learning and exploration.",
        images: ["/images/daycare1.jpg"],
        contact: {
          phone: "(416) 555-0123",
          email: "hello@littleexplorers.ca",
          address: "123 Nature Way, Toronto, ON",
        },
        coordinates: { lat: 43.6532, lng: -79.3832 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "dc_0002",
        name: "Bright Beginnings Childcare",
        location: "Whitby",
        address: "456 Learning Lane, Whitby, ON",
        phone: "(905) 555-0456",
        email: "info@brightbeginnings.ca",
        website: "https://brightbeginnings.ca",
        rating: 4.6,
        reviewCount: 89,
        price: 1650,
        availability: "Waitlist",
        ageRange: "12 months - 6 years",
        features: ["STEM Learning", "Arts & Crafts", "Music & Movement"],
        description:
          "Modern childcare center with focus on early childhood development.",
        images: ["/images/daycare2.jpg"],
        contact: {
          phone: "(905) 555-0456",
          email: "info@brightbeginnings.ca",
          address: "456 Learning Lane, Whitby, ON",
        },
        coordinates: { lat: 43.8975, lng: -78.9428 },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }
}

// Export singleton instance
export const daycareService = new DaycareService();
export default daycareService;
