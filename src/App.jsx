// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "@/pages/Home";
import TheRiseHub from "@/pages/TheRiseHub";
import CreateBuildScreen from "@/pages/CreateBuildScreen";
import TrainingRoom from "@/pages/TrainingRoom";
import BarBuilder from "@/pages/BarBuilder";
import MyWork from "@/pages/MyWork";
import RecordingStudio from "@/pages/RecordingStudio";
import FreestyleLab from "@/pages/FreestyleLab";
import BattlersPage from "@/pages/BattlersPage";
import BattlerProfilePage from "@/pages/BattlerProfilePage";
import BattleSimScreen from "@/pages/BattleSimScreen";
import HelloRoute from "@/pages/HelloRoute";
import Login from "@/pages/Login";
import MyCareer from "@/pages/MyCareer";
import BottomNav from "@/components/navigation/BottomNav";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen pb-[calc(78px+env(safe-area-inset-bottom))]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />

          {/* Rise / creation */}
          <Route path="/mycareer" element={<MyCareer />} />
          <Route path="/career" element={<MyCareer />} />
          <Route path="/therise" element={<TheRiseHub />} />
          <Route path="/therisehub" element={<TheRiseHub />} />
          <Route path="/therise/create" element={<CreateBuildScreen />} />

          {/* Tools & training */}
          <Route path="/training-room" element={<TrainingRoom />} />
          <Route path="/bar-builder" element={<BarBuilder />} />
          <Route path="/my-work" element={<MyWork />} />
          <Route path="/recording-studio" element={<RecordingStudio />} />
          <Route path="/freestyle-lab" element={<FreestyleLab />} />

          {/* Battlers & sim */}
          <Route path="/battlers" element={<BattlersPage />} />
          <Route path="/battlers/:id" element={<BattlerProfilePage />} />
          <Route path="/simulate" element={<BattleSimScreen />} />
          <Route path="/login" element={<Login />} />

          {/* Smoke test */}
          <Route path="/hello" element={<HelloRoute />} />

          {/* Fallback */}
          <Route
            path="*"
            element={<div style={{ padding: 24 }}>No route matched ❌</div>}
          />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}
