"use client";

import React, { memo } from 'react';

/**
 * OPTIMIZATION: 
 * 1. Memoized to prevent unnecessary re-renders.
 * 2. Uses pure CSS animations to offload work to the GPU.
 * 3. Reduced count to 60 for better performance on mobile/low-end devices.
 */
const Bubbles = memo(() => {
  return (
    <div className="bubbles" aria-hidden="true">
      {Array.from({ length: 60 }).map((_, i) => (
        <div 
          key={i} 
          className="bubble" 
          style={{
            "--size": `${2 + Math.random() * 4}rem`,
            "--distance": `${6 + Math.random() * 4}rem`,
            "--position": `${-5 + Math.random() * 110}%`,
            "--time": `${2 + Math.random() * 2}s`,
            "--delay": `${-1 * (2 + Math.random() * 2)}s`
          } as React.CSSProperties}
        ></div>
      ))}
    </div>
  );
});

Bubbles.displayName = 'Bubbles';

export default Bubbles;
