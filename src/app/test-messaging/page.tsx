'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import MessagingSystem from '../../components/MessagingSystem';
import { apiClient } from '../../lib/api';

export default function TestMessagingPage() {
  const { user, login, logout } = useAuth();
  const [showMessaging, setShowMessaging] = useState(false);

  const testLogin = async (email: string, password: string, userType: string) => {
    const success = await login(email, password);
    if (success) {
      alert(`Logged in as ${userType}: ${email}`);
    } else {
      alert('Login failed');
    }
  };

  const testAPI = async () => {
    try {
      const response = await apiClient.get('/api/test-messaging');
      alert(`API Test: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      alert(`API Error: ${error}`);
    }
  };

  const testConversations = async () => {
    if (!user?._id) {
      alert('Please login first');
      return;
    }

    try {
      const response = await apiClient.get(`/api/messages/conversations/${user._id}`);
      alert(`Conversations: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      alert(`Conversations Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🧪 Messaging System Test Page</h1>
        
        {/* Server Status */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Server Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Frontend</p>
              <p className="text-green-600 font-medium">✅ Running on localhost:3000</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Backend</p>
              <p className="text-green-600 font-medium">✅ Running on localhost:5001</p>
            </div>
          </div>
        </div>

        {/* Test Login */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test Login</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => testLogin('ashvak.parent@test.com', 'test123', 'parent')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login as Ashvak Parent
            </button>
            <button
              onClick={() => testLogin('provider@abdaycare.com', 'test123', 'provider')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Login as AB Daycare Provider
            </button>
          </div>
          {user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800">
                <strong>Logged in as:</strong> {user.firstName} {user.lastName} ({user.userType})
              </p>
              <p className="text-blue-600 text-sm">ID: {user._id}</p>
            </div>
          )}
        </div>

        {/* Test API */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Test API Calls</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={testAPI}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Test Backend API
            </button>
            <button
              onClick={testConversations}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              Test Conversations API
            </button>
          </div>
        </div>

        {/* Test Messaging */}
        {user && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Test Messaging System</h2>
            <button
              onClick={() => setShowMessaging(!showMessaging)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              {showMessaging ? 'Hide' : 'Show'} Messaging System
            </button>
            
            {showMessaging && (
              <div className="mt-4">
                <MessagingSystem
                  currentUserId={user._id}
                  currentUserType={user.userType}
                  onClose={() => setShowMessaging(false)}
                />
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        {user && (
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Logout</h2>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

