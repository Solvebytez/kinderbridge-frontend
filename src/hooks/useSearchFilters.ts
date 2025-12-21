import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export interface SearchFilters {
  query: string;
  location: string;
  priceRange: string;
  features: string[];
  ageRange: string[];
  availability: string[];
  sortBy: string;
  sortOrder: string;
}

const STORAGE_KEY = 'daycare-search-filters';

export function useSearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params or localStorage
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Try to get from URL first
    const urlFilters = {
      query: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      priceRange: searchParams.get('price') || '',
      features: searchParams.get('features')?.split(',').filter(Boolean) || [],
      ageRange: searchParams.get('age')?.split(',').filter(Boolean) || [],
      availability: searchParams.get('availability')?.split(',').filter(Boolean) || [],
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc'
    };

    // If URL has no filters, try localStorage
    const hasUrlFilters = Object.values(urlFilters).some(val => 
      Array.isArray(val) ? val.length > 0 : val !== ''
    );

    if (!hasUrlFilters) {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...urlFilters, ...parsed };
        }
      } catch (error) {
        console.warn('Failed to parse saved filters:', error);
      }
    }

    return urlFilters;
  });

  // Update URL when filters change
  const updateURL = useCallback((newFilters: SearchFilters) => {
    const params = new URLSearchParams();
    
    if (newFilters.query) params.set('q', newFilters.query);
    if (newFilters.location) params.set('location', newFilters.location);
    if (newFilters.priceRange) params.set('price', newFilters.priceRange);
    if (newFilters.features.length > 0) params.set('features', newFilters.features.join(','));
    if (newFilters.ageRange.length > 0) params.set('age', newFilters.ageRange.join(','));
    if (newFilters.availability.length > 0) params.set('availability', newFilters.availability.join(','));
    if (newFilters.sortBy !== 'name') params.set('sortBy', newFilters.sortBy);
    if (newFilters.sortOrder !== 'asc') params.set('sortOrder', newFilters.sortOrder);

    const newURL = params.toString() ? `?${params.toString()}` : '';
    router.replace(`/search${newURL}`, { scroll: false });
  }, [router]);

  // Save to localStorage
  const saveToStorage = useCallback((newFilters: SearchFilters) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
    } catch (error) {
      console.warn('Failed to save filters to localStorage:', error);
    }
  }, []);

  // Update filters and persist
  const updateFilters = useCallback((updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    updateURL(newFilters);
    saveToStorage(newFilters);
  }, [filters, updateURL, saveToStorage]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    const defaultFilters: SearchFilters = {
      query: '',
      location: '',
      priceRange: '',
      features: [],
      ageRange: [],
      availability: [],
      sortBy: 'name',
      sortOrder: 'asc'
    };
    
    setFilters(defaultFilters);
    updateURL(defaultFilters);
    saveToStorage(defaultFilters);
  }, [updateURL, saveToStorage]);

  // Clear specific filter
  const clearFilter = useCallback((filterKey: keyof SearchFilters) => {
    const newFilters = { ...filters, [filterKey]: Array.isArray(filters[filterKey]) ? [] : '' };
    setFilters(newFilters);
    updateURL(newFilters);
    saveToStorage(newFilters);
  }, [filters, updateURL, saveToStorage]);

  // Sync with URL changes (e.g., browser back/forward)
  useEffect(() => {
    const urlFilters = {
      query: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      priceRange: searchParams.get('price') || '',
      features: searchParams.get('features')?.split(',').filter(Boolean) || [],
      ageRange: searchParams.get('age')?.split(',').filter(Boolean) || [],
      availability: searchParams.get('availability')?.split(',').filter(Boolean) || [],
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: searchParams.get('sortOrder') || 'asc'
    };

    setFilters(urlFilters);
  }, [searchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
    clearFilter,
    updateURL
  };
}
