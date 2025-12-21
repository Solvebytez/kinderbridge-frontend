import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock data for testing
export const mockDaycareData = [
  {
    id: '1',
    name: 'Little Explorers Academy',
    location: 'Toronto',
    rating: 4.8,
    reviewCount: 127,
    price: 1800,
    availability: 'Available',
    ageRange: '6 months - 5 years',
    features: ['Nature-Inspired Learning', 'Outdoor Play', 'Healthy Meals'],
    description: 'A nature-inspired daycare focusing on outdoor learning and exploration.',
    images: ['/images/daycare1.jpg'],
    contact: {
      phone: '(416) 555-0123',
      email: 'hello@littleexplorers.ca',
      address: '123 Nature Way, Toronto, ON'
    }
  },
  {
    id: '2',
    name: 'Bright Beginnings Childcare',
    location: 'Whitby',
    rating: 4.6,
    reviewCount: 89,
    price: 1650,
    availability: 'Waitlist',
    ageRange: '12 months - 6 years',
    features: ['STEM Learning', 'Arts & Crafts', 'Music & Movement'],
    description: 'Modern childcare center with focus on early childhood development.',
    images: ['/images/daycare2.jpg'],
    contact: {
      phone: '(905) 555-0456',
      email: 'info@brightbeginnings.ca',
      address: '456 Learning Lane, Whitby, ON'
    }
  }
]

export const mockUserData = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'parent',
  children: [
    { name: 'Emma', age: 3 },
    { name: 'Liam', age: 1 }
  ]
}

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Mock functions
export const mockFunctions = {
  onSearch: () => {},
  onFilter: () => {},
  onCompare: () => {},
  onContact: () => {},
  onFavorite: () => {},
  onShare: () => {},
}

// Test constants
export const TEST_IDS = {
  SEARCH_INPUT: 'search-input',
  LOCATION_INPUT: 'location-input',
  SEARCH_BUTTON: 'search-button',
  FILTER_BUTTON: 'filter-button',
  COMPARE_BUTTON: 'compare-button',
  DAYCARE_CARD: 'daycare-card',
  RATING_STARS: 'rating-stars',
  PRICE_DISPLAY: 'price-display',
  AVAILABILITY_BADGE: 'availability-badge',
}

// Helper functions
export const createMockEvent = (value: string) => ({
  target: { value },
  currentTarget: { value },
  preventDefault: () => {},
  stopPropagation: () => {},
})

export const waitForElementToBeRemoved = (element: Element) =>
  new Promise(resolve => {
    const observer = new MutationObserver(() => {
      if (!document.contains(element)) {
        observer.disconnect()
        resolve(true)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })
