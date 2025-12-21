"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function RegisterSuccessPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Get dashboard URL based on user type
  const getDashboardUrl = useCallback(() => {
    if (!user) return "/dashboard";
    switch (user.userType) {
      case "provider":
        return "/provider/dashboard";
      case "parent":
        return "/parent/dashboard";
      default:
        return "/dashboard";
    }
  }, [user]);

  useEffect(() => {
    setMounted(true);

    if (user) {
      // Redirect to dashboard after 3 seconds
      const timer = setTimeout(() => {
        router.push(getDashboardUrl());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [user, router, getDashboardUrl]);

  // Wait for component to mount before rendering
  if (!mounted) {
    return null;
  }

  if (!user) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Registration Successful! 🎉
          </h1>

          <p className="text-gray-600 mb-6">
            Welcome to KinderBridge,{" "}
            <span className="font-semibold">{user.firstName}</span>! Your
            account has been created successfully.
          </p>

          {/* User Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Account Details:</p>
            <p className="text-gray-900 font-medium">{user.email}</p>
            <p className="text-gray-600 text-sm capitalize">
              {user.userType} Account
            </p>
          </div>

          {/* Redirect Message */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              Redirecting to your dashboard in a few seconds...
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href={getDashboardUrl()}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
