import React from 'react';
import { Link } from 'react-router-dom';
import battleStage from '../assets/battle-stage.jpg';
import BarGodLogo from '../components/BarGodLogo';
import SocialTicker from '../components/home/SocialTicker';

export default function Home() {
  return (
    <div
      className="min-h-screen bg-black bg-cover bg-center relative"
      style={{ backgroundImage: `url(${battleStage})` }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black bg-opacity-70 z-0" />

      {/* Main Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-white text-center px-4 pt-24 pb-12 sm:pt-32 sm:pb-16 space-y-4 sm:space-y-6">
        <BarGodLogo />
        <p className="max-w-sm sm:max-w-xl text-sm sm:text-base leading-relaxed">
          Where battle rap gets rated. Train your moves, simulate your performance,
          and rise through the ranks in the world’s first AI-powered battle rap sim.
        </p>
        <Link
          to="/therisehub"
          className="bg-lime-500 hover:bg-lime-600 text-black font-bold py-2 px-6 rounded-full transition text-sm sm:text-base"
        >
          Enter The Rise Hub
        </Link>
      </div>

      {/* Feature Cards */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-6 mt-10 px-6 sm:px-8 pb-12">
        <div className="bg-zinc-900 p-6 rounded-xl text-center text-white shadow-md">
          <h2 className="text-lg font-bold mb-2 text-lime-400">Train Your Craft</h2>
          <p>Sharpen your bars, moves, and setups in a simulated lab.</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl text-center text-white shadow-md">
          <h2 className="text-lg font-bold mb-2 text-sky-400">Simulate Battles</h2>
          <p>Face off in AI matchups using your custom loadout.</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl text-center text-white shadow-md">
          <h2 className="text-lg font-bold mb-2 text-purple-400">Browse Battlers</h2>
          <p>View top-tier builds, records, and stats from the culture.</p>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl text-center text-white shadow-md">
          <h2 className="text-lg font-bold mb-2 text-rose-400">Explore the Culture</h2>
          <p>Dive into transcripts, bar ratings, and AI breakdowns.</p>
        </div>
      </div>

      {/* Culture Ticker */}
      <div className="relative z-10 mt-4">
        <SocialTicker />
      </div>
    </div>
  );
}







