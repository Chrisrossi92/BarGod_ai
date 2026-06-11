import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import archetypes from "@/logic/archetypes";

export default function ArchetypePreview({ selected }) {
  const data = selected ? archetypes[selected] : null;

  return (
    <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl text-white min-h-[140px]">
      <h3 className="text-sm font-semibold text-gray-300 mb-2">
        Archetype Preview
      </h3>
      <AnimatePresence mode="wait">
        {data ? (
          <motion.div
            key={data.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-lime-400">
                  {data.name}
                </div>
                <p className="text-xs text-gray-300">
                  {data.description}
                </p>
              </div>
            </div>

            <blockquote className="text-xs italic text-lime-300 border-l border-lime-500/40 pl-2">
              {data.quote}
            </blockquote>

            <div className="mt-2">
              <div className="text-[0.65rem] uppercase tracking-wide text-gray-400 mb-1">
                Plays to these strengths
              </div>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(data.statEmphasis)
                  .filter(([_, weight]) => weight >= 0.7)
                  .map(([stat]) => (
                    <span
                      key={stat}
                      className="px-2 py-0.5 rounded-full bg-lime-500/10 border border-lime-500/40 text-[0.65rem] text-lime-200"
                    >
                      {stat}
                    </span>
                  ))}
                {Object.entries(data.statEmphasis).every(
                  ([_, weight]) => weight < 0.7
                ) && (
                  <span className="text-[0.65rem] text-gray-500">
                    Balanced skill set.
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-xs text-gray-400"
          >
            Pick an archetype to see what they specialize in and how they'll
            play in battles.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
