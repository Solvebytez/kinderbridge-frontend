'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { messagingService, Message, Conversation, SendMessageData } from '../lib/messagingService';

interface MessagingSystemProps {
  currentUserId: string;
  currentUserType: 'parent' | 'provider' | 'employer' | 'employee';
  recipientId?: string;
  recipientType?: 'parent' | 'provider' | 'employer' | 'employee';
  recipientName?: string;
  onClose?: () => void;
}

export default function MessagingSystem({
  currentUserId,
  currentUserType,
  recipientId,
  recipientType,
  recipientName,
  onClose
}: MessagingSystemProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConversations, setShowConversations] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debug logging
  console.log('🚀 MessagingSystem mounted with:', {
    currentUserId,
    currentUserType,
    recipientId,
    recipientType,
    recipientName
  });

  // Generate conversation ID (same logic as backend) - moved up for use in callbacks
  const generateConversationId = (user1Id: string, user2Id: string) => {
    const sortedIds = [user1Id, user2Id].sort();
    return `${sortedIds[0]}_${sortedIds[1]}`;
  };

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load messages for a specific conversation
  const loadConversation = useCallback(async (conversationId: string) => {
    try {
      setLoading(true);
      console.log('🔍 Loading conversation:', conversationId);
      
      // Extract user IDs from conversation ID
      const [user1Id, user2Id] = conversationId.split('_');
      console.log('👥 User IDs:', user1Id, user2Id);
      
      const data = await messagingService.getConversation(user1Id, user2Id);
      console.log('💬 Messages loaded:', data);
      setMessages(data);
      
      // Mark messages as read
      await messagingService.markAsRead(conversationId, currentUserId);
    } catch (err) {
      setError('Failed to load conversation');
      console.error('❌ Error loading conversation:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  // Load conversations for the current user
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading conversations for:', currentUserId, currentUserType);
      const data = await messagingService.getUserConversations(currentUserId, currentUserType);
      console.log('📨 Conversations loaded:', data);
      setConversations(data);
      
      // If a specific recipient is provided, select that conversation
      if (recipientId && recipientType) {
        const conversationId = generateConversationId(currentUserId, recipientId);
        setSelectedConversation(conversationId);
        loadConversation(conversationId);
        setShowConversations(false);
      }
    } catch (err) {
      setError('Failed to load conversations');
      console.error('❌ Error loading conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, currentUserType, recipientId, recipientType, loadConversation]);

  // Send a new message
  const sendMessage = useCallback(async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const recipientId = selectedConversation.split('_').find(id => id !== currentUserId);
      if (!recipientId) return;

      const messageData: SendMessageData = {
        senderId: currentUserId,
        recipientId,
        senderType: currentUserType,
        recipientType: recipientType || 'parent',
        content: newMessage.trim()
      };

      const sentMessage = await messagingService.sendMessage(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Refresh conversations to update last message
      loadConversations();
      
      // Focus input for next message
      inputRef.current?.focus();
    } catch (err) {
      setError('Failed to send message');
      console.error('Error sending message:', err);
    }
  }, [newMessage, selectedConversation, currentUserId, currentUserType, recipientType, loadConversations]);

  // Handle Enter key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }, [sendMessage]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Format timestamp
  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get conversation display name
  const getConversationName = (conversation: Conversation) => {
    const otherUserId = conversation.lastMessage.senderId === currentUserId 
      ? conversation.lastMessage.recipientId 
      : conversation.lastMessage.senderId;
    
    // Map test user IDs to readable names
    const userNames: Record<string, string> = {
      'ashvak-parent': 'Ashvak Parent',
      'ab-daycare-provider': 'AB Daycare (Sarah Johnson)'
    };
    
    return userNames[otherUserId] || `User ${otherUserId.slice(-4)}`;
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {showConversations ? (
            <>
              <h3 className="font-semibold">Messages</h3>
              <span className="text-blue-200 text-sm">
                {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
              </span>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowConversations(true)}
                className="text-blue-200 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <span className="text-blue-200">|</span>
              <span className="font-semibold">{recipientName || 'Chat'}</span>
            </>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-blue-200 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 flex">
        {/* Conversations List */}
        {showConversations && (
          <div className="w-80 border-r border-gray-200 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm">Start chatting with daycare providers!</p>
                <p className="text-xs text-gray-400 mt-2">
                  Debug: {conversations.length} conversations loaded
                </p>
              </div>
            ) : (
              <>
                <div className="p-2 bg-gray-100 text-xs text-gray-600">
                  Debug: {conversations.length} conversations
                </div>
                {conversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    onClick={() => {
                      console.log('🎯 Selected conversation:', conversation._id);
                      setSelectedConversation(conversation._id);
                      loadConversation(conversation._id);
                      setShowConversations(false);
                    }}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {getConversationName(conversation)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs text-gray-400">
                          {formatTime(conversation.lastMessage.timestamp)}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {/* Chat Area */}
        {!showConversations && selectedConversation && (
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-b-lg">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right text-red-700 hover:text-red-900"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
