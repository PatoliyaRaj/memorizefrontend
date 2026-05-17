'use client';

import { ReactLenis } from 'lenis/react';
import React from 'react';

/**
 * Lenis smooth scrolling provider.
 * Wrapped in a client component to keep layout.tsx as a Server Component for SEO.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
