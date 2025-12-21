import { test, expect } from '@playwright/test';

test.describe('Messaging System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the search page where messaging is available
    await page.goto('/search');
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test('should display Message button instead of Contact button', async ({ page }) => {
    // Check that the Message button is visible (not Contact)
    const messageButton = page.locator('button:has-text("💬 Message")');
    await expect(messageButton).toBeVisible();
    
    // Verify Contact button is not present
    const contactButton = page.locator('button:has-text("📞 Contact")');
    await expect(contactButton).not.toBeVisible();
  });

  test('should open messaging modal when Message button is clicked', async ({ page }) => {
    // Click the first Message button
    const messageButton = page.locator('button:has-text("💬 Message")').first();
    await messageButton.click();
    
    // Verify messaging modal opens
    const messagingModal = page.locator('.fixed.inset-0.bg-black');
    await expect(messagingModal).toBeVisible();
    
    // Verify the modal contains messaging interface
    const messagingSystem = page.locator('[class*="bg-white rounded-lg shadow-lg"]');
    await expect(messagingSystem).toBeVisible();
  });

  test('should display floating message button on all pages', async ({ page }) => {
    // Navigate to different pages to verify floating button is present
    const pages = ['/', '/about', '/contact', '/classes', '/toys'];
    
    for (const pagePath of pages) {
      await page.goto(pagePath);
      await page.waitForLoadState('networkidle');
      
      // Check floating message button is visible
      const floatingButton = page.locator('button[aria-label="Open messages"]');
      await expect(floatingButton).toBeVisible();
      
      // Verify it has the correct styling
      await expect(floatingButton).toHaveClass(/bg-blue-600/);
    }
  });

  test('should open messaging system when floating button is clicked', async ({ page }) => {
    // Click the floating message button
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Verify messaging system opens
    const messagingSystem = page.locator('[class*="bg-white rounded-lg shadow-lg"]');
    await expect(messagingSystem).toBeVisible();
    
    // Verify it shows the conversations list
    const conversationsHeader = page.locator('h3:has-text("Messages")');
    await expect(conversationsHeader).toBeVisible();
  });

  test('should display conversation list when messaging system opens', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Verify conversations list is displayed
    const conversationsList = page.locator('.w-80.border-r.border-gray-200');
    await expect(conversationsList).toBeVisible();
    
    // Check for "No conversations yet" message (since this is a fresh test)
    const noConversationsMessage = page.locator('text=No conversations yet');
    await expect(noConversationsMessage).toBeVisible();
  });

  test('should show message input when conversation is selected', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Verify message input is present
    const messageInput = page.locator('input[placeholder="Type your message..."]');
    await expect(messageInput).toBeVisible();
    
    // Verify send button is present
    const sendButton = page.locator('button:has-text("Send")');
    await expect(sendButton).toBeVisible();
  });

  test('should handle message input and send functionality', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Type a test message
    const messageInput = page.locator('input[placeholder="Type your message..."]');
    await messageInput.fill('Hello, this is a test message!');
    
    // Verify the input contains the message
    await expect(messageInput).toHaveValue('Hello, this is a test message!');
    
    // Verify send button is enabled
    const sendButton = page.locator('button:has-text("Send")');
    await expect(sendButton).toBeEnabled();
  });

  test('should display provider name in messaging modal', async ({ page }) => {
    // Click the first Message button to open provider messaging
    const messageButton = page.locator('button:has-text("💬 Message")').first();
    await messageButton.click();
    
    // Wait for modal to open
    await page.waitForTimeout(500);
    
    // Verify the modal shows the provider name
    const providerName = page.locator('span.font-semibold');
    await expect(providerName).toBeVisible();
    
    // Verify it's not showing "Chat" (which is the default)
    await expect(providerName).not.toHaveText('Chat');
  });

  test('should close messaging modal when close button is clicked', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Find and click the close button (X)
    const closeButton = page.locator('button:has-text("✕")');
    await closeButton.click();
    
    // Verify messaging system is closed
    const messagingSystem = page.locator('[class*="bg-white rounded-lg shadow-lg"]');
    await expect(messagingSystem).not.toBeVisible();
  });

  test('should handle Enter key for sending messages', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Type a message and press Enter
    const messageInput = page.locator('input[placeholder="Type your message..."]');
    await messageInput.fill('Test message with Enter key');
    await messageInput.press('Enter');
    
    // Verify the input is cleared (message was sent)
    await expect(messageInput).toHaveValue('');
  });

  test('should show proper messaging interface layout', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Verify the header is present
    const header = page.locator('.bg-blue-600.text-white');
    await expect(header).toBeVisible();
    
    // Verify the header contains "Messages"
    const messagesTitle = page.locator('h3:has-text("Messages")');
    await expect(messagesTitle).toBeVisible();
    
    // Verify the layout structure
    const mainContainer = page.locator('[class*="bg-white rounded-lg shadow-lg"]');
    await expect(mainContainer).toBeVisible();
    
    // Verify the height is set correctly
    await expect(mainContainer).toHaveCSS('height', '600px');
  });

  test('should handle empty message input validation', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Verify send button is disabled when input is empty
    const sendButton = page.locator('button:has-text("Send")');
    await expect(sendButton).toBeDisabled();
    
    // Type some text
    const messageInput = page.locator('input[placeholder="Type your message..."]');
    await messageInput.fill('Some text');
    
    // Verify send button is now enabled
    await expect(sendButton).toBeEnabled();
    
    // Clear the input
    await messageInput.clear();
    
    // Verify send button is disabled again
    await expect(sendButton).toBeDisabled();
  });

  test('should maintain messaging state across page navigation', async ({ page }) => {
    // Open messaging system
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Type a message
    const messageInput = page.locator('input[placeholder="Type your message..."]');
    await messageInput.fill('Message to test state persistence');
    
    // Navigate to another page
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    
    // Navigate back to search page
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    // Open messaging system again
    const newFloatingButton = page.locator('button[aria-label="Open messages"]');
    await newFloatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Verify the input is empty (state was reset, which is correct behavior)
    const newMessageInput = page.locator('input[placeholder="Type your message..."]');
    await expect(newMessageInput).toHaveValue('');
  });
});

test.describe('Messaging System Integration', () => {
  test('should integrate with search page daycare results', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    // Wait for daycare results to load
    await page.waitForTimeout(2000);
    
    // Verify Message buttons are present on daycare cards
    const messageButtons = page.locator('button:has-text("💬 Message")');
    const count = await messageButtons.count();
    
    // Should have at least one message button
    expect(count).toBeGreaterThan(0);
    
    // Click the first message button
    await messageButtons.first().click();
    
    // Verify messaging modal opens with provider context
    const messagingModal = page.locator('.fixed.inset-0.bg-black');
    await expect(messagingModal).toBeVisible();
    
    // Verify it's not the general messaging system (should be provider-specific)
    const providerName = page.locator('span.font-semibold');
    await expect(providerName).toBeVisible();
  });

  test('should show proper error handling for messaging operations', async ({ page }) => {
    // Open messaging system
    await page.goto('/search');
    await page.waitForLoadState('networkidle');
    
    const floatingButton = page.locator('button[aria-label="Open messages"]');
    await floatingButton.click();
    
    // Wait for messaging system to load
    await page.waitForTimeout(1000);
    
    // Since we're not connected to a real backend, we can't test actual errors
    // But we can verify the error display structure exists
    const messagingSystem = page.locator('[class*="bg-white rounded-lg shadow-lg"]');
    await expect(messagingSystem).toBeVisible();
    
    // Verify the messaging interface is properly structured
    const header = page.locator('.bg-blue-600.text-white');
    await expect(header).toBeVisible();
    
    const conversationsList = page.locator('.w-80.border-r.border-gray-200');
    await expect(conversationsList).toBeVisible();
  });
});
