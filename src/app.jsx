// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Keep ErrorBoundary commented until all routes are stable
// import ErrorBoundary from "@/components/dev/ErrorBoundary";

import Home from "@/pages/Home";
import TheRiseHub from "@/pages/TheRiseHub";
import CreateBuildScreen from "@/pages/CreateBuildScreen";
import TrainingRoom from "@/pages/TrainingRoom";
import BarBuilder from "@/pages/BarBuilder";
import MyWork from "@/pages/MyWork";
import RecordingStudio from "@/pages/RecordingStudio";
import FallbackSandbox from "@/routes/dev/FallbackSandbox";

import SimulateBattle from "@/pages/simulate/SimulateBattle";

// Smoke routes (ok to leave around while testing)
import HelloRoute from "@/pages/HelloRoute";
import BrowseBattlersSmoke from "@/pages/battlers/BrowseBattlersSmoke";

// ✅ Real battlers pages
import BrowseBattlers from "@/pages/battlers/BrowseBattlers";
import BattlerProfile from "@/pages/battlers/BattlerProfile";
import UploadBattle from "@/pages/battlers/UploadBattle";

export default function App() {
  return (
    // <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Core pages */}
        <Route path="/therisehub" element={<TheRiseHub />} />
        <Route path="/therise/create" element={<CreateBuildScreen />} />
        <Route path="/training-room" element={<TrainingRoom />} />
        <Route path="/bar-builder" element={<BarBuilder />} />
        <Route path="/my-work" element={<MyWork />} />
        <Route path="/recording-studio" element={<RecordingStudio />} />
        <Route path="/dev/fallbacks" element={<FallbackSandbox />} />

        {/* Simulate */}
        <Route path="/simulate" element={<SimulateBattle />} />

        {/* ✅ Battlers */}
        <Route path="/battlers" element={<BrowseBattlers />} />
        <Route path="/battlers/:id" element={<BattlerProfile />} />
        <Route path="/battlers/:id/upload" element={<UploadBattle />} />

        {/* Smoke tests */}
        <Route path="/hello" element={<HelloRoute />} />
        <Route path="/bb-test" element={<BrowseBattlersSmoke />} />

        {/* Wildcard LAST */}
        <Route path="*" element={<div style={{ padding: 24 }}>No route matched ❌</div>} />
      </Routes>
    </BrowserRouter>
    // </ErrorBoundary>
  );
}


