// src/pages/TrainingRoom.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import BarGodLogo from "@/components/BarGodLogo";

export default function TrainingRoom() {
  const navigate = useNavigate();

  // Three flagship tools (Vault + AI Feedback are integrated in Builder/Studio)
  const tools = [
    {
      title: "Bar Builder",
      emoji: "📝",
      description:
        "Write with AI help: rhyme highlights, syllable counts, scheme ideas, and smart edits.",
      badges: ["Includes AI Feedback", "Saves to My Work"],
      path: "/bar-builder",
    },
    {
  title: "Studio",
  emoji: "🎤",
  description:
    "Record over beat packs or your own uploads. Layer takes, review, and refine.",
  badges: ["Includes AI Feedback", "Saves to My Work"],
  path: "/recording-studio",
},
    {
      title: "Freestyle Lab",
      emoji: "⚡",
      description:
        "Off-the-top training with random prompts, timers, and a crowd meter.",
      badges: ["Practice modes", "AI sparring (soon)"],
      path: "/freestyle-lab",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header: Logo (click → Home) + quick link to My Work */}
        <div className="flex items-center justify-between">
          {/* BarGodLogo already navigates to "/" on click per your component */}
          <BarGodLogo size="text-3xl" />

          <button
            onClick={() => navigate("/my-work")}
            className="inline-flex items-center gap-2 bg-white text-black px-3 py-1.5 rounded-xl text-sm border border-white hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-lime-400"
          >
            <span>My Work</span>
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center mt-6">Train Your Craft</h2>
        <p className="text-center text-sm text-gray-400 max-w-xl mx-auto mt-2">
          Focused tools to build, record, and practice—AI feedback and auto-save to your Vault are built in.
        </p>

        {/* 3 hero cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {tools.map((tool) => (
            <button
              key={tool.title}
              onClick={() => navigate(tool.path)}
              className="group text-left bg-zinc-900 hover:bg-zinc-800 transition rounded-2xl shadow p-5 flex flex-col gap-3 outline-none focus:ring-2 focus:ring-lime-400"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{tool.emoji}</div>
                <h3 className="text-xl font-semibold">{tool.title}</h3>
              </div>

              <p className="text-sm text-gray-300">{tool.description}</p>

              <div className="flex flex-wrap gap-2 mt-1">
                {tool.badges.map((b) => (
                  <span
                    key={b}
                    className="text-[11px] tracking-wide bg-zinc-800 border border-zinc-700 rounded-full px-2 py-1 text-gray-300"
                  >
                    {b}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <span className="inline-block bg-white text-black py-1 px-3 rounded-lg text-sm group-hover:translate-x-0.5 transition">
                  Enter
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Your work saves to <button onClick={() => navigate("/my-work")} className="underline hover:text-gray-300">My Work</button>.
          AI Feedback appears inside Builder and Studio once you add content.
        </p>
      </div>
    </div>
  );
}




