"use client";

import React, { useState } from "react";
import { X, Shield, Mail, MessageSquare, Megaphone, Info } from "lucide-react";

interface CommunicationPreferences {
  email: boolean;
  sms: boolean;
  promotional: boolean;
  acknowledgement: boolean;
}

interface CommunicationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (preferences: CommunicationPreferences) => void;
  isLoading?: boolean;
}

export default function CommunicationPreferencesModal({
  isOpen,
  onClose,
  onContinue,
  isLoading = false,
}: CommunicationPreferencesModalProps) {
  const [preferences, setPreferences] = useState<CommunicationPreferences>({
    email: true, // Required, always checked
    sms: true, // Checked by default
    promotional: true, // Checked by default
    acknowledgement: false, // Unchecked by default - user must explicitly acknowledge
  });

  const handleCheckboxChange = (field: keyof CommunicationPreferences) => {
    // Email checkbox cannot be unchecked
    if (field === "email") {
      return;
    }
    
    setPreferences((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleContinue = () => {
    if (preferences.acknowledgement) {
      onContinue(preferences);
    }
  };

  if (!isOpen) return null;

  const isContinueDisabled = !preferences.acknowledgement;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Communication Preferences
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your communication preferences and consent settings in
                compliance with Canadian Anti-Spam Legislation (CASL).
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* CASL Compliance Notice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="bg-blue-600 rounded-full p-1">
                <Info className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-700">
              In compliance with Canadian Anti-Spam Legislation (CASL), we need
              your explicit consent to send you communications. You can change
              these preferences anytime.
            </p>
          </div>

          {/* Email Communications */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="email"
                  checked={preferences.email}
                  disabled={true}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-not-allowed opacity-75"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-5 w-5 text-gray-600" />
                  <label
                    htmlFor="email"
                    className="text-lg font-semibold text-gray-900 cursor-pointer"
                  >
                    Email Communications <span className="text-red-500">*</span>
                  </label>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I consent to receive email communications from KinderBridge
                  about KinderBridge availability, waitlist updates, account
                  information, and service announcements. I understand I can
                  unsubscribe at any time using the unsubscribe link in emails
                  or by updating my account preferences.
                </p>
              </div>
            </div>
          </div>

          {/* SMS Text Messages */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="sms"
                  checked={preferences.sms}
                  onChange={() => handleCheckboxChange("sms")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="h-5 w-5 text-gray-600" />
                  <label
                    htmlFor="sms"
                    className="text-lg font-semibold text-gray-900 cursor-pointer"
                  >
                    SMS Text Messages (Optional)
                  </label>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I consent to receive SMS text messages about urgent
                  KinderBridge availability and waitlist updates. Standard
                  message and data rates may apply. I can reply STOP to opt out
                  at any time or update my preferences in account settings.
                </p>
              </div>
            </div>
          </div>

          {/* Promotional Content */}
          <div className="border border-gray-200 rounded-lg p-5">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="promotional"
                  checked={preferences.promotional}
                  onChange={() => handleCheckboxChange("promotional")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Megaphone className="h-5 w-5 text-gray-600" />
                  <label
                    htmlFor="promotional"
                    className="text-lg font-semibold text-gray-900 cursor-pointer"
                  >
                    Promotional Content (Optional)
                  </label>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  I consent to receive promotional emails about new features,
                  tips for parents, and KinderBridge-related services. These
                  communications are optional and I can opt out at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Acknowledgement */}
          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <input
                  type="checkbox"
                  id="acknowledgement"
                  checked={preferences.acknowledgement}
                  onChange={() => handleCheckboxChange("acknowledgement")}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <label
                htmlFor="acknowledgement"
                className="text-sm text-gray-700 leading-relaxed cursor-pointer"
              >
                I acknowledge that I have read and understood the consent
                information above, and I understand that I can withdraw my
                consent at any time by updating my communication preferences in
                my account settings.
              </label>
            </div>
          </div>
        </div>

        {/* Footer with Continue Button */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
          <button
            onClick={onClose}
            disabled={isLoading}
            className={`px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium ${
              isLoading ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={isContinueDisabled || isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isContinueDisabled || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            <span>{isLoading ? "Registering..." : "Continue"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
