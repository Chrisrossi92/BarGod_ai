// src/pages/BattlersPage.jsx

import React from 'react';
import BattlerGrid from '@/components/battlers/BattlerGrid';
import BattlerSearchBar from '@/components/battlers/BattlerSearchBar';

export default function BattlersPage() {
  return (
    <div className="min-h-screen bg-black text-white px-4 pt-10 pb-20">
      <h1 className="text-3xl font-extrabold mb-6 text-center">All Battlers</h1>
      <BattlerSearchBar />
      <BattlerGrid />
    </div>
  );
}