import React from "react";
import { useNavigate } from "react-router-dom";

export default function TrainingRoom() {
  const navigate = useNavigate();

  const tools = [
    {
      title: "Bar Builder",
      description: "Craft your bars with rhyme highlights, syllable counts, and scheme suggestions.",
      path: "/bar-builder",
    },
    {
      title: "Recording Studio",
      description: "Lay down your verses over beat packs or custom uploads using our in-app recorder.",
      path: "/recording-studio",
    },
    {
      title: "AI Feedback Coach",
      description: "Get AI-powered feedback on your flow, rhyme density, clarity, and delivery.",
      path: "/feedback-coach",
    },
    {
      title: "Freestyle Lab",
      description: "Improve your off-the-top game with random prompts, timers, and crowd meters.",
      path: "/freestyle-lab",
    },
    {
      title: "Vault",
      description: "Save, tag, and organize your lyrics, drafts, and recorded takes.",
      path: "/vault",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center">Train Your Craft</h1>
      <p className="text-center text-sm text-gray-400 max-w-md mx-auto">
        Welcome to the Training Room. Select a tool to build, refine, and elevate your skill set.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {tools.map((tool) => (
          <div
            key={tool.title}
            onClick={() => navigate(tool.path)}
            className="bg-gray-900 hover:bg-gray-800 transition cursor-pointer rounded-2xl shadow p-4 flex flex-col justify-between"
          >
            <h2 className="text-xl font-semibold mb-2">{tool.title}</h2>
            <p className="text-sm text-gray-400 flex-grow">{tool.description}</p>
            <button className="mt-3 bg-white text-black py-1 px-3 rounded-lg text-sm self-start">
              Enter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}