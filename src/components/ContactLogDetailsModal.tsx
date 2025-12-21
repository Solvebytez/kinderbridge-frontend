"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface ContactLog {
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

interface ContactLogDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactLog: ContactLog | null;
}

const getContactMethodIcon = (method: string) => {
  switch (method) {
    case "Phone Call":
      return <PhoneIcon className="h-5 w-5" />;
    case "Email":
      return <EnvelopeIcon className="h-5 w-5" />;
    case "Video Call":
      return <VideoCameraIcon className="h-5 w-5" />;
    case "Text Message":
      return <ChatBubbleLeftRightIcon className="h-5 w-5" />;
    case "In-Person Visit":
      return <UserIcon className="h-5 w-5" />;
    default:
      return <DocumentTextIcon className="h-5 w-5" />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ContactLogDetailsModal({
  isOpen,
  onClose,
  contactLog,
}: ContactLogDetailsModalProps) {
  if (!isOpen || !contactLog) return null;

  // Prioritize numeric id field for URL routing (e.g., /daycare/2)
  const daycareId =
    contactLog.daycare?.id || contactLog.daycareId || contactLog.daycare?._id;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 mt-1">
                {getContactMethodIcon(contactLog.contactMethod)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Log Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {contactLog.daycare?.name || "KinderBridge"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Daycare Information */}
              {contactLog.daycare && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-2 text-blue-600" />
                    Daycare Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-900 font-medium">
                      {contactLog.daycare.name}
                    </p>
                    {(contactLog.daycare.address ||
                      contactLog.daycare.city) && (
                      <p className="text-gray-600">
                        {[contactLog.daycare.address, contactLog.daycare.city]
                          .filter(Boolean)
                          .join(", ")}
                        {contactLog.daycare.city && ", ON"}
                      </p>
                    )}
                  </div>
                  {daycareId && (
                    <Link
                      href={`/daycare/${daycareId}`}
                      className="inline-flex items-center mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      View KinderBridge Details →
                    </Link>
                  )}
                </div>
              )}

              {/* Contact Method & Purpose */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Method
                  </label>
                  <div className="flex items-center space-x-2 text-gray-900">
                    <div className="text-blue-600">
                      {getContactMethodIcon(contactLog.contactMethod)}
                    </div>
                    <span>{contactLog.contactMethod}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <p className="text-gray-900">{contactLog.purpose}</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {contactLog.notes}
                  </p>
                </div>
              </div>

              {/* Outcome */}
              {contactLog.outcome && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome
                  </label>
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-900">{contactLog.outcome}</p>
                  </div>
                </div>
              )}

              {/* Follow-up Date */}
              {contactLog.followUpDate && (
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Follow-up Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(contactLog.followUpDate)}
                  </p>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Created
                    </label>
                    <p className="text-gray-600">
                      {formatDateTime(contactLog.createdAt)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-600">
                      {formatDateTime(contactLog.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {daycareId && (
              <Link
                href={`/daycare/${daycareId}`}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Daycare
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

