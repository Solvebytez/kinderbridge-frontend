'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { messagingService } from '../lib/messagingService';
import MessagingSystem from './MessagingSystem';
import { useAuth } from '../contexts/AuthContext';

export default function MessageButton() {
  const { user } = useAuth();
  const [showMessaging, setShowMessaging] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadUnreadCount = useCallback(async () => {
    try {
      if (user?._id) {
        const count = await messagingService.getUnreadCount(user._id);
        setUnreadCount(count);
      }
    } catch (error) {
      console.error('Error loading unread count:', error);
    }
  }, [user?._id]);

  // Load unread message count
  useEffect(() => {
    if (user?._id) {
      loadUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user?._id, loadUnreadCount]);

  const toggleMessaging = () => {
    setShowMessaging(!showMessaging);
    if (!showMessaging) {
      // Refresh unread count when opening
      loadUnreadCount();
    }
  };

  // Don't show button if user is not logged in
  if (!user) {
    return null;
  }

  return (
    <>
      {/* Floating Message Button */}
      <button
        onClick={toggleMessaging}
        className="fixed bottom-6 left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full p-4 shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 z-50 group hover:scale-110 active:scale-95"
        aria-label="Open messages"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        
        {/* Unread Message Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Subtle pulse animation when there are unread messages */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-20 animate-ping"></div>
        )}

        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Messages
          {unreadCount > 0 && (
            <span className="ml-1 text-red-400">
              ({unreadCount} unread)
            </span>
          )}
        </div>
      </button>

      {/* Messaging System Modal */}
      {showMessaging && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh]">
            <MessagingSystem
              currentUserId={user?._id || ''}
              currentUserType={user?.userType || 'parent'}
              onClose={() => setShowMessaging(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
