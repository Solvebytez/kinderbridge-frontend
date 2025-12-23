"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  Users,
  Shield,
  Clock,
  Mail,
  ArrowRight,
  CheckCircle,
  User,
} from "lucide-react";
import Link from "next/link";
import Navigation from "../components/Navigation";


export default function HomePage() {
  const [location, setLocation] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [errors, setErrors] = useState<{
    location?: string;
  }>({});

  // GTA and Durham/York region cities
  const gtaCities = [
    "Toronto",
    "Whitby",
    "Oshawa",
    "Ajax",
    "Mississauga",
    "Brampton",
    "Oakville",
    "Markham",
    "Richmond Hill",
    "Vaughan",
    "Pickering",
    "Scarborough",
    "North York",
    "Etobicoke",
    "Burlington",
    "Milton",
    "Caledon",
    "Aurora",
    "Newmarket",
    "Stouffville",
  ];

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      // Reset errors
      const newErrors: { location?: string } = {};

      // Validate: location must be filled
      const hasLocation = location.trim().length > 0;

      if (!hasLocation) {
        newErrors.location = "Please select a location";
        setErrors(newErrors);
        return;
      }

      // Validate location: must be from the dropdown (valid city)
      if (hasLocation && !gtaCities.includes(location.trim())) {
        newErrors.location = "Please select a valid location from the dropdown";
        setErrors(newErrors);
        return;
      }

      // Clear errors if validation passes
      setErrors({});

      // Navigate to search page with query parameters
      const params = new URLSearchParams();
      if (hasLocation) params.append("location", location.trim());

      window.location.href = `/search?${params.toString()}`;
    },
    [location]
  );

  const selectCity = useCallback(
    (city: string) => {
      setLocation(city);
      setShowLocationDropdown(false);
      // Clear location error when city is selected from dropdown
      if (errors.location) {
        setErrors((prev) => ({ ...prev, location: undefined }));
      }
    },
    [errors.location]
  );

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowLocationDropdown(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Find the Perfect Daycare
              <br />
              for Your Child
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Browse daycares, read authentic reviews, and make informed
              decisions for your child&apos;s early education journey.
            </motion.p>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-4xl mx-auto"
              onClick={handleClickOutside}
            >
              <form
                onSubmit={handleSearch}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200"
              >
                <div className="flex gap-4 items-start">
                  <div className="relative flex-1">
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
                      <input
                        type="text"
                        placeholder="Enter your location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                          setShowLocationDropdown(true);
                          // Clear error when user starts typing
                          if (errors.location) {
                            setErrors((prev) => ({
                              ...prev,
                              location: undefined,
                            }));
                          }
                        }}
                        onFocus={() => setShowLocationDropdown(true)}
                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 ${
                          errors.location ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                    {/* City Dropdown */}
                    {showLocationDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {gtaCities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => selectCity(city)}
                            className="w-full px-4 py-2 text-left text-gray-800 font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center h-[48px]"
                    >
                      Search daycare
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <Link
                href="/register"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
              >
                Start Your Search
              </Link>
            </motion.div>

            {/* Quick Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="mt-8 text-center"
            >
              <div className="flex flex-col items-center">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <Mail className="h-4 w-4" />
                  <span>Info@kinderbridge.com</span>
                </div>
                <p className="text-gray-600 text-sm">
                  We typically respond within 24 hours
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find Your Perfect daycare?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of parents who have found their ideal daycare
              location through our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/search"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Browse daycare
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KinderBridge</h3>
              <p className="text-gray-400">
                Connecting parents with trusted Daycares for a brighter future.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Parents</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link
                    href="/search"
                    className="hover:text-white transition-colors"
                  >
                    Find Daycare
                  </Link>
                </li>
                <li>
                  <Link
                    href="/parent/dashboard?tab=favorites"
                    className="hover:text-white transition-colors"
                  >
                    My Favorites
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Information</h4>
              <div className="space-y-2 text-gray-400">
                <p className="font-medium text-gray-300 mb-2">Email Us</p>
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>Info@kinderbridge.com</span>
                </div>
                <p className="text-sm text-gray-500">
                  We typically respond within 24 hours
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Business Hours</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Monday - Friday: 9:00 AM - 6:00 PM EST</li>
                <li>Saturday: 10:00 AM - 2:00 PM EST</li>
                <li>Sunday: Closed</li>
                <li className="text-sm text-gray-500 mt-3">
                  Emergency support available 24/7
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} KinderBridge. All rights reserved.</p>
            <div className="mt-2 flex justify-center items-center space-x-2">
              <span className="text-xs text-gray-500">
                Developed by ASH Web Solutions
              </span>
              <a
                href="https://ashwebsolutions.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-800"
                title="Visit ASH WEB Solutions"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
