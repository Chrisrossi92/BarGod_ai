// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TheRiseHub from './pages/TheRiseHub';
import CreateBuildScreen from './pages/CreateBuildScreen';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/TheRiseHub" element={<TheRiseHub />} />
        <Route path="/therise/create" element={<CreateBuildScreen />} />
      </Routes>
    </Router>
  );
}

