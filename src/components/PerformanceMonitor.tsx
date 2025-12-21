'use client';

import { useEffect } from 'react';

export default function PerformanceMonitor() {
  useEffect(() => {
    // Performance monitoring
    if (typeof window !== 'undefined') {
      // Track page load performance
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.loadEventStart;
          const domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;
          
          console.log('Performance Metrics:', {
            pageLoadTime: `${loadTime}ms`,
            domContentLoaded: `${domContentLoaded}ms`,
            totalTime: `${navigation.loadEventEnd - navigation.fetchStart}ms`
          });
        }
      });

      // Track Core Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
              }
              if (entry.entryType === 'first-input') {
                const firstInputEntry = entry as PerformanceEntry & { processingStart?: number };
                console.log('FID:', (firstInputEntry.processingStart || 0) - entry.startTime);
              }
              if (entry.entryType === 'layout-shift') {
                const layoutShiftEntry = entry as PerformanceEntry & { value?: number };
                console.log('CLS:', layoutShiftEntry.value);
              }
            }
          });
          
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        } catch {
          console.log('PerformanceObserver not supported');
        }
      }
    }
  }, []);

  return null; // This component doesn't render anything
}
