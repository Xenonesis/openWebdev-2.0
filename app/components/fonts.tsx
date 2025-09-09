'use client';

import { useEffect } from 'react';

// Dynamically load Google Fonts only in client-side environments
export function FontLoader() {
  useEffect(() => {
    // Only load Google Fonts in the browser, not during build
    if (typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
      link.rel = 'preload';
      link.as = 'style';
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      
      // Add fallback in case of network issues
      link.onerror = () => {
        console.log('Google Fonts failed to load, using system fonts');
      };
      
      document.head.appendChild(link);
    }
  }, []);

  return null;
}