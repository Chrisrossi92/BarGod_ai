import React from "react";
import { archetypeList } from "@/logic/archetypes";

export default function ArchetypeSelector({ value, onChange }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl text-white space-y-6">
      <h3 className="text-lg font-bold text-lime-400">Select Your Archetype</h3>
      <p className="text-xs text-gray-300 mb-2">
        Choose the style that best fits how you want to battle. Your archetype
        affects how your stats grow and how you perform in the sim.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {archetypeList.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onChange(type.id)}
            className={`text-left p-4 rounded-lg border transition duration-200 shadow-md hover:shadow-lg
              ${
                value === type.id
                  ? "border-lime-400 bg-gray-800"
                  : "border-gray-700 bg-gray-950"
              }`}
          >
            <h4 className="text-md font-semibold text-white mb-1">
              {type.name}
            </h4>
            <p className="text-xs text-gray-300 mb-2">{type.description}</p>
            <blockquote className="text-xs italic text-lime-300">
              {type.quote}
            </blockquote>
          </button>
        ))}
      </div>
    </div>
  );
}
