export interface Message {
  _id: string;
  senderId: string;
  recipientId: string;
  senderType: 'parent' | 'provider' | 'employer' | 'employee';
  recipientType: 'parent' | 'provider' | 'employer' | 'employee';
  content: string;
  conversationId: string;
  timestamp: Date;
  read: boolean;
  attachments: string[];
}

export interface Conversation {
  _id: string;
  lastMessage: Message;
  unreadCount: number;
}

export interface SendMessageData {
  senderId: string;
  recipientId: string;
  senderType: 'parent' | 'provider' | 'employer' | 'employee';
  recipientType: 'parent' | 'provider' | 'employer' | 'employee';
  content: string;
  attachments?: string[];
}

import { apiClient } from './api';

class MessagingService {
  // Send a new message
  async sendMessage(messageData: SendMessageData): Promise<Message> {
    const response = await apiClient.post('/api/messages/send', messageData);
    return response.data.data;
  }

  // Get conversation between two users
  async getConversation(user1Id: string, user2Id: string, limit: number = 50): Promise<Message[]> {
    const response = await apiClient.get(
      `/api/messages/conversation/${user1Id}/${user2Id}`,
      { params: { limit } }
    );
    return response.data.data;
  }

  // Get all conversations for a user
  async getUserConversations(userId: string, userType: string): Promise<Conversation[]> {
    console.log('🌐 Calling API: /api/messages/conversations');
    
    const response = await apiClient.get(`/api/messages/conversations/${userId}`, {
      params: { userType }
    });

    console.log('✅ API Response:', response.data);
    return response.data.data;
  }

  // Mark messages as read
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await apiClient.put(`/api/messages/read/${conversationId}/${userId}`);
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<number> {
    console.log('🔢 Getting unread count from: /api/messages/unread');
    
    const response = await apiClient.get(`/api/messages/unread/${userId}`);

    console.log('✅ Unread count response:', response.data);
    return response.data.data.unreadCount;
  }

  // Delete a message
  async deleteMessage(messageId: string, senderId: string): Promise<boolean> {
    const response = await apiClient.delete(`/api/messages/${messageId}`, {
      data: { senderId }
    });
    return response.data.success;
  }
}

export const messagingService = new MessagingService();
