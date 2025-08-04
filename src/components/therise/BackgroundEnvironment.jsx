// src/components/therise/BackgroundEnvironment.jsx

import React from 'react';

export default function BackgroundEnvironment() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Animated stage lights */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500 opacity-10 blur-2xl animate-pulse" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-500 opacity-10 blur-2xl animate-ping" />

      {/* Mic shadow spinner */}
      <div className="absolute top-1/2 left-1/2 w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-lime-500 opacity-20 animate-spin-slow" />

      {/* Ambient gradient filter */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-gray-900/80 to-black opacity-90" />
    </div>
  );
}