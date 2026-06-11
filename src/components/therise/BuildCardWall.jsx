import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BattlerCard from "@/components/therise/battlers/BattlerCard";

// BuildCardWall now expects a list of actual battler builds passed in as props.
// Each build should at least include: id, name, archetypeLabel (or style), ovr, signature (array of tags), and optional color.

export default function BuildCardWall({ builds = [] }) {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate("/therise/create");
  };

  const cards = [
    ...builds,
    { id: "new", name: "New Build Slot", isNew: true },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((build) => {
        if (build.isNew) {
          return (
            <motion.div
              key={build.id}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-700 to-gray-900 text-white p-4 rounded-xl shadow-lg flex flex-col items-start justify-between border border-dashed border-gray-500"
            >
              <h3 className="text-xl font-bold mb-2">New Build Slot</h3>
              <p className="text-sm text-gray-200 mb-4">
                Create a new battler to rise through the ranks.
              </p>
              <button
                onClick={handleCreate}
                className="mt-auto px-4 py-1 text-sm bg-black bg-opacity-30 border border-white rounded-full hover:bg-white hover:text-black transition"
              >
                Create Build
              </button>
            </motion.div>
          );
        }

        return (
          <BattlerCard
            key={build.id}
            name={build.name}
            archetypeLabel={build.archetypeLabel}
            archetypeId={build.archetypeId}
            ovr={build.ovr}
            signature={build.signature}
            level={build.level}
            xp={build.xp}
            hometownLabel={build.hometownLabel}
            onClick={() => navigate(`/battlers/${build.id}`)}
          />
        );
      })}
    </div>
  );
}
