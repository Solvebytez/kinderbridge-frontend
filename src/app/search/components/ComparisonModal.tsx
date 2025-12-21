"use client";

import { X, MapPin, Star } from "lucide-react";
import { formatDaycarePrice } from "../../../utils/priceFormatter";

export interface Daycare {
  id: string;
  name: string;
  description: string;
  city: string;
  address: string;
  rating: number;
  price: string | number;
  priceString?: string;
  features: string[];
  hours: string;
  ageRange: string;
  availability: string;
  distance: number;
  subsidy: string;
  cwelcc: string;
  phone: string;
  email: string;
  website?: string;
}

interface ComparisonModalProps {
  isOpen: boolean;
  daycares: Daycare[];
  onClose: () => void;
  onClearComparison: () => void;
  onContactProvider: (daycare: Daycare) => void;
}

export default function ComparisonModal({
  isOpen,
  daycares,
  onClose,
  onClearComparison,
  onContactProvider,
}: ComparisonModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Compare Daycares
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {daycares.map((daycare) => (
              <div
                key={daycare.id}
                className="bg-gray-50 rounded-lg p-6 border"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {daycare.name}
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{daycare.city}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{daycare.rating} (Verified)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatDaycarePrice(daycare.price, daycare.priceString)}
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Key Features
                    </h4>
                    <div className="space-y-1">
                      {daycare.features &&
                        Array.isArray(daycare.features) &&
                        daycare.features
                          .slice(0, 4)
                          .map((feature: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center space-x-2 text-sm"
                            >
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Details
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <strong>Hours:</strong> {daycare.hours}
                      </div>
                      <div>
                        <strong>Age Range:</strong> {daycare.ageRange}
                      </div>
                      <div>
                        <strong>Distance:</strong> {daycare.distance} km
                      </div>
                      <div>
                        <strong>Subsidy:</strong> {daycare.subsidy}
                      </div>
                      <div>
                        <strong>CWELCC:</strong> {daycare.cwelcc}
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Contact
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>
                        <strong>Phone:</strong> {daycare.phone}
                      </div>
                      <div>
                        <strong>Email:</strong> {daycare.email}
                      </div>
                      {daycare.website && (
                        <div>
                          <strong>Website:</strong> {daycare.website}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => onContactProvider(daycare)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Contact Provider
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onClearComparison}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
