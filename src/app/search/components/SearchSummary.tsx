"use client";

import Link from "next/link";

interface SearchSummaryProps {
  isLoading: boolean;
  totalCount: number;
  favoritesCount: number;
  compareListCount: number;
  compareListLength: number;
  onShowComparison: () => void;
}

export default function SearchSummary({
  isLoading,
  totalCount,
  favoritesCount,
  compareListCount,
  compareListLength,
  onShowComparison,
}: SearchSummaryProps) {
  if (isLoading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 mb-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-9 w-16 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex space-x-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-200/50 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-8">
          <div className="text-center group">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">
              {totalCount}
            </div>
            <div className="text-xs text-gray-600 font-medium">
              Daycares Found
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">
              {favoritesCount}
            </div>
            <div className="text-xs text-gray-600 font-medium">Favorites</div>
          </div>
          <div className="text-center group">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200">
              {compareListCount}
            </div>
            <div className="text-xs text-gray-600 font-medium">Comparing</div>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/parent/dashboard?tab=favorites"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
          >
            View Favorites
          </Link>
          {compareListLength >= 2 && (
            <button
              onClick={onShowComparison}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm"
            >
              Compare Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
