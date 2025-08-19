// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import TheRiseHub from '@/pages/TheRiseHub';
import CreateBuildScreen from '@/pages/CreateBuildScreen';
import TrainingRoom from "@/pages/TrainingRoom";
import BarBuilder from '@/pages/BarBuilder';
import FallbackSandbox from "@/routes/dev/FallbackSandbox";
import MyWork from "@/pages/MyWork";
import RecordingStudio from "@/pages/RecordingStudio";
import ErrorBoundary from "@/components/dev/ErrorBoundary";





export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TheRiseHub" element={<TheRiseHub />} />
        <Route path="/therise/create" element={<CreateBuildScreen />} />
        <Route path="/training-room" element={<TrainingRoom />} />
        <Route path="/bar-builder" element={<BarBuilder />} />
        <Route path="/dev/fallbacks" element={<FallbackSandbox />} />
        <Route path="/my-work" element={<MyWork />} />
        <Route path="/recording-studio" element={<RecordingStudio />} />
      </Routes>
    </Router>
  );
}

