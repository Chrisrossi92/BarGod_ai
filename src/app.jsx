// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/dev/ErrorBoundary';
import FreestyleLab from "@/pages/FreestyleLab";

// Pages
import Home from '@/pages/Home';
import TheRiseHub from '@/pages/TheRiseHub';
import CreateBuildScreen from '@/pages/CreateBuildScreen';
import TrainingRoom from '@/pages/TrainingRoom';
import BarBuilder from '@/pages/BarBuilder';
import MyWork from '@/pages/MyWork';
import RecordingStudio from '@/pages/RecordingStudio';
import FallbackSandbox from '@/routes/dev/FallbackSandbox';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TheRiseHub" element={<TheRiseHub />} />
          <Route path="/therise/create" element={<CreateBuildScreen />} />
          <Route path="/training-room" element={<TrainingRoom />} />
          <Route path="/bar-builder" element={<BarBuilder />} />
          <Route path="/my-work" element={<MyWork />} />
          <Route path="/recording-studio" element={<RecordingStudio />} />
          <Route path="/dev/fallbacks" element={<FallbackSandbox />} />
          <Route path="*" element={<div style={{padding:24}}>No route matched ❌</div>} />
          <Route path="/freestyle-lab" element={<FreestyleLab />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
