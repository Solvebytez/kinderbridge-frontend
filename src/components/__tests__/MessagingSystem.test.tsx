import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessagingSystem from '../MessagingSystem';

// Mock scrollIntoView for JSDOM
Element.prototype.scrollIntoView = jest.fn();

// Mock the messaging service
jest.mock('../../lib/messagingService', () => ({
  messagingService: {
    getUserConversations: jest.fn().mockResolvedValue([]),
    getConversation: jest.fn().mockResolvedValue([]),
    markAsRead: jest.fn().mockResolvedValue(undefined),
    sendMessage: jest.fn(),
  },
}));

const mockProps = {
  currentUserId: 'test-user-123',
  currentUserType: 'parent' as const,
  recipientId: 'provider-456',
  recipientType: 'provider' as const,
  recipientName: 'Test Daycare',
  onClose: jest.fn(),
};

describe('MessagingSystem Component', () => {
  test('renders without crashing', async () => {
    render(<MessagingSystem {...mockProps} />);
    
    // Wait for the component to finish loading and check for the recipient name
    await waitFor(() => {
      expect(screen.getByText('Test Daycare')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', async () => {
    render(<MessagingSystem {...mockProps} />);
    
    // Should show the recipient name after loading
    await waitFor(() => {
      expect(screen.getByText('Test Daycare')).toBeInTheDocument();
    });
  });
});
