"use client";

import { MapPin, Star, Clock } from "lucide-react";
import { formatDaycarePrice } from "../../../utils/priceFormatter";

export interface Daycare {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  price: string | number;
  priceString?: string;
  rating: number;
  distance: number;
  features: string[];
  ageRange: string;
  availability: string;
  hours: string;
  subsidy: string;
  cwelcc: string;
  phone: string;
  email: string;
  website?: string;
}

interface RecentlyViewedProps {
  recentlyViewed: Daycare[];
  onViewDetails: (daycare: Daycare) => void;
}

export default function RecentlyViewed({
  recentlyViewed,
  onViewDetails,
}: RecentlyViewedProps) {
  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 mb-6">
      <div className="flex items-center mb-4">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
          <Clock className="h-4 w-4 text-blue-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentlyViewed.slice(0, 3).map((daycare) => (
          <div
            key={daycare.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 hover:scale-105 group"
          >
            <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-sm">
              {daycare.name}
            </h4>
            <div className="flex items-center space-x-2 text-gray-600 mb-2">
              <MapPin className="h-3 w-3" />
              <span className="text-xs">{daycare.city}</span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-green-600 font-bold text-base">
                {formatDaycarePrice(daycare.price, daycare.priceString)}
              </span>
              <div className="flex items-center space-x-2">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="text-xs font-medium">{daycare.rating}</span>
              </div>
            </div>
            <button
              onClick={() => onViewDetails(daycare)}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

