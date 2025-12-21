import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessageButton from '../MessageButton';
import { AuthProvider } from '../../contexts/AuthContext';

// Mock the messaging service
jest.mock('../../lib/messagingService', () => ({
  messagingService: {
    getUnreadCount: jest.fn(),
  },
}));

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      _id: 'test-user-123',
      userType: 'parent',
      email: 'test@example.com'
    },
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn(),
    loading: false
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>
    {children}
  </AuthProvider>
);

describe('MessageButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders floating message button', () => {
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    expect(button).toBeInTheDocument();
  });

  test('button has correct styling classes', () => {
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    expect(button).toHaveClass('rounded-full', 'shadow-lg');
  });

  test('shows message icon', () => {
    render(<MessageButton />, { wrapper: TestWrapper });
    
    // The SVG icon should be present
    const icon = document.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  test('shows unread count badge when there are unread messages', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(5);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });
  });

  test('shows 99+ for large unread counts', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(150);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  test('does not show unread badge when count is 0', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(0);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
  });

  test('unread badge has correct styling', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(3);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      const badge = screen.getByText('3');
      expect(badge).toHaveClass('bg-red-500', 'text-white', 'rounded-full');
    });
  });

  test('unread badge has pulse animation', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(2);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      const badge = screen.getByText('2');
      expect(badge).toHaveClass('animate-pulse');
    });
  });

  test('shows tooltip on hover', async () => {
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    
    // Hover over the button
    fireEvent.mouseEnter(button);
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeInTheDocument();
    });
  });

  test('tooltip shows unread count when available', async () => {
    // Mock unread count before rendering
    const mockGetUnreadCount = jest.fn().mockResolvedValue(7);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    expect(button).toBeInTheDocument();
    
    // Wait for unread count to load and check that badge is visible
    await waitFor(() => {
      expect(screen.getByText('7')).toBeInTheDocument();
    });
    
    // Hover over button to show tooltip
    fireEvent.mouseEnter(button);
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeInTheDocument();
      // The text is split: "Messages" and "(7 unread)" in separate elements
      expect(screen.getByText('(7 unread)')).toBeInTheDocument();
    });
  });

  test('tooltip shows no unread when count is 0', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(0);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    
    // Wait for unread count to load
    await waitFor(() => {
      expect(screen.queryByText('0')).not.toBeInTheDocument();
    });
    
    // Hover over the button
    fireEvent.mouseEnter(button);
    
    // Wait for tooltip to appear
    await waitFor(() => {
      expect(screen.getByText('Messages')).toBeInTheDocument();
      expect(screen.queryByText(/unread/)).not.toBeInTheDocument();
    });
  });

  test('calls getUnreadCount on mount', async () => {
    const mockGetUnreadCount = jest.fn().mockResolvedValue(0);
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(mockGetUnreadCount).toHaveBeenCalledWith('test-user-123');
    });
  });

  test('refreshes unread count when button is clicked', async () => {
    const mockGetUnreadCount = jest.fn()
      .mockResolvedValueOnce(0)  // First call on mount
      .mockResolvedValueOnce(3);  // Second call on click
    
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    const button = screen.getByRole('button', { name: /open messages/i });
    
    // Wait for initial load
    await waitFor(() => {
      expect(mockGetUnreadCount).toHaveBeenCalledTimes(1);
    });
    
    // Click the button
    fireEvent.click(button);
    
    // Wait for second call
    await waitFor(() => {
      expect(mockGetUnreadCount).toHaveBeenCalledTimes(2);
    });
  });

  test('handles error when getUnreadCount fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockGetUnreadCount = jest.fn().mockRejectedValue(new Error('API Error'));
    
    jest.requireMock('../../lib/messagingService').messagingService.getUnreadCount = mockGetUnreadCount;
    
    render(<MessageButton />, { wrapper: TestWrapper });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error loading unread count:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});
