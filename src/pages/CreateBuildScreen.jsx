import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import AvatarCard from '@/components/therise/avatar/AvatarCard';
import ArchetypeSelector from '@/components/therise/creator/ArchetypeSelector';
import ArchetypePreview from '@/components/therise/creator/ArchetypePreview';
import HometownSelector from '@/components/therise/hometown/HometownSelector';
import MoveLoadoutSelector from '@/components/therise/moves/MoveLoadoutSelector';
import RiseBackButton from '@/components/therise/RiseBackButton';
import { createBattler } from '@/lib/battlersApi';
import archetypes from '@/logic/archetypes';
import {
  previewBaseAttributes,
  getHometownBonus,
  computeEffectiveAttributes,
  computeOVR,
} from '@/logic/battlerStats';

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

  const statsPreview = useMemo(() => {
    if (!newBuild.archetype) return null;
    const base = previewBaseAttributes(newBuild.archetype);
    const bonus = getHometownBonus(newBuild.hometown);
    const effective = computeEffectiveAttributes(base, bonus);
    const ovr = computeOVR(effective);
    return { base, bonus, effective, ovr };
  }, [newBuild.archetype, newBuild.hometown]);

  const archetypeData = newBuild.archetype
    ? archetypes[newBuild.archetype]
    : null;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const disabled =
    !newBuild.name.trim() ||
    !newBuild.archetype ||
    saving;

  async function handleSave() {
    try {
      setError('');
      setSaving(true);
      await createBattler({
        ...newBuild,
        attributes: {}, // we'll flesh this out later
      });
      navigate('/battlers');
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to save battler');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white px-6 py-10">
      <RiseBackButton to="/therisehub" />

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
            setAvatarSeed={(avatarSeed) =>
              setNewBuild((prev) => ({ ...prev, avatarSeed }))
            }
            appearance={newBuild.appearance}
            setAppearance={(appearance) =>
              setNewBuild((prev) => ({ ...prev, appearance }))
            }
            name={newBuild.name}
            setName={(name) =>
              setNewBuild((prev) => ({ ...prev, name }))
            }
            title={newBuild.title}
            setTitle={(title) =>
              setNewBuild((prev) => ({ ...prev, title }))
            }
          />
        </div>

        {/* Archetype Selection */}
        <div className="space-y-4">
          <ArchetypeSelector
            value={newBuild.archetype}
            onChange={(archetype) =>
              setNewBuild((prev) => ({ ...prev, archetype }))
            }
          />
          <ArchetypePreview selected={newBuild.archetype} />
        </div>

        {/* Hometown Selection */}
        <HometownSelector
          value={newBuild.hometown}
          onChange={(hometown) =>
            setNewBuild((prev) => ({ ...prev, hometown }))
          }
        />

        {/* Move Loadout Selection */}
        <MoveLoadoutSelector
          selectedMoves={
            Array.isArray(newBuild.moves) ? newBuild.moves : []
          }
          setSelectedMoves={(moves) =>
            setNewBuild((prev) => ({
              ...prev,
              moves: Array.isArray(moves) ? moves : [],
            }))
          }
        />

        {/* Build Summary Preview */}
        {statsPreview && (
          <div className="bg-gray-900 p-4 rounded-xl shadow-xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div>
                <div className="text-xs uppercase text-gray-400">Overall</div>
                <div className="text-3xl font-extrabold text-lime-400">
                  {statsPreview.ovr}
                </div>
              </div>
              <div className="text-right text-xs text-gray-400">
                <div>Level 1 · XP 0</div>
                {archetypeData && (
                  <div className="mt-1">
                    Archetype:{" "}
                    <span className="text-gray-200">
                      {archetypeData.name}
                    </span>
                  </div>
                )}
                {newBuild.hometown && (
                  <div className="mt-1">
                    Hometown:{" "}
                    <span className="text-gray-200">
                      {newBuild.hometown}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                ["punchlines", "Punchlines"],
                ["schemes", "Schemes"],
                ["angles", "Angles"],
                ["rebuttals", "Rebuttals"],
                ["freestyle", "Freestyle"],
                ["presence", "Presence"],
                ["crowdControl", "Crowd Control"],
                ["delivery", "Delivery"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between gap-2"
                >
                  <span className="text-gray-300">{label}</span>
                  <span className="text-gray-100">
                    {statsPreview.effective[key] ?? 0}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="text-center mt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSave}
            disabled={disabled}
            className={`px-6 py-2 rounded-full shadow transition text-sm font-semibold
              ${disabled
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                : 'bg-lime-500 hover:bg-lime-600 text-black'}`}
          >
            {saving ? 'Saving…' : 'Save Battler'}
          </button>

          <button
            onClick={() => navigate('/therisehub')}
            className="px-6 py-2 rounded-full border border-zinc-700 text-sm text-zinc-200 hover:bg-zinc-900 transition"
          >
            Cancel / Return to Rise Hub
          </button>
        </div>

        {error && (
          <p className="text-center text-sm text-red-400 mt-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
