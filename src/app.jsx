import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import VisibleErrorBoundary from '@/components/dev/VisibleErrorBoundary';

import Home from '@/pages/Home';
import TheRiseHub from '@/pages/TheRiseHub';
import CreateBuildScreen from '@/pages/CreateBuildScreen';
import TrainingRoom from '@/pages/TrainingRoom';
import BarBuilder from '@/pages/BarBuilder';
import MyWork from '@/pages/MyWork';
import RecordingStudio from '@/pages/RecordingStudio';

export default function App() {
  return (
    <VisibleErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/TheRiseHub" element={<TheRiseHub />} />
          <Route path="/therise/create" element={<CreateBuildScreen />} />
          <Route path="/training-room" element={<TrainingRoom />} />
          <Route path="/bar-builder" element={<BarBuilder />} />
          <Route path="/my-work" element={<MyWork />} />
          <Route path="/recording-studio" element={<RecordingStudio />} />
          <Route path="*" element={<div style={{padding:24}}>No route matched ❌</div>} />
        </Routes>
      </BrowserRouter>
    </VisibleErrorBoundary>
  );
}



