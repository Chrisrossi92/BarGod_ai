// src/pages/CreateBuildScreen.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AvatarCard from '@/components/therise/avatar/AvatarCard';
import ArchetypeSelector from '@/components/therise/creator/ArchetypeSelector';
import ArchetypePreview from '@/components/therise/creator/ArchetypePreview';
import HometownSelector from '@/components/therise/hometown/HometownSelector';
import MoveLoadoutSelector from '@/components/therise/moves/MoveLoadoutSelector';
import RiseBackButton from '@/components/therise/RiseBackButton';

export default function CreateBuildScreen() {
  const navigate = useNavigate();

  const [newBuild, setNewBuild] = useState({
    avatarSeed: 'BarGodSeed',
    archetype: '',
    hometown: '',
    name: '',
    title: '',
    moves: [],
    appearance: {
      hairstyle: '',
      outfit: '',
      accessory: '',
    },
  });

  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-10">
      <RiseBackButton to="/therise" />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center text-lime-400"
        >
          Create Your Battler
        </motion.h1>

        <div className="text-center text-sm text-gray-400">
          Build your own legendary battler — choose your style, hometown, moveset, and name.
        </div>

        {/* Avatar Customization */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-xl">
          <AvatarCard
            avatarSeed={newBuild.avatarSeed}
            setAvatarSeed={(avatarSeed) => setNewBuild((prev) => ({ ...prev, avatarSeed }))}
            appearance={newBuild.appearance}
            setAppearance={(appearance) => setNewBuild((prev) => ({ ...prev, appearance }))}
            name={newBuild.name}
            setName={(name) => setNewBuild((prev) => ({ ...prev, name }))}
            title={newBuild.title}
            setTitle={(title) => setNewBuild((prev) => ({ ...prev, title }))}
          />
        </div>

        {/* Archetype Selection */}
        <div className="space-y-4">
          <ArchetypeSelector
            value={newBuild.archetype}
            onChange={(archetype) => setNewBuild((prev) => ({ ...prev, archetype }))}
          />
          <ArchetypePreview selected={newBuild.archetype} />
        </div>

        {/* Hometown Selection */}
        <HometownSelector
          value={newBuild.hometown}
          onChange={(hometown) => setNewBuild((prev) => ({ ...prev, hometown }))}
        />

        {/* Move Loadout Selection */}
        <MoveLoadoutSelector
          selectedMoves={newBuild.moves}
          setSelectedMoves={(moves) => setNewBuild((prev) => ({ ...prev, moves }))}
        />

        {/* Final Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/therise')}
            className="mt-6 px-6 py-2 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-full shadow transition"
          >
            Cancel / Return to Rise Hub
          </button>
        </div>
      </div>
    </div>
  );
}



