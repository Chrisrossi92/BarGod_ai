import { useState } from 'react';

function VersusMode({ onSubmit }) {
  const [bars, setBars] = useState("");
  const [opponent, setOpponent] = useState("");
  const [crowdScore, setCrowdScore] = useState(0);

  const handleSubmit = () => {
    if (bars && opponent) {
      // Mock crowd score based on bar content
      const score = bars.split(" ").length * 5 + (bars.includes("fire") ? 20 : 0); // Simple mock
      setCrowdScore(score);
      onSubmit({ bars, opponent });
      setBars("");
      setOpponent("");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg sm:p-4">
      <h3 className="text-2xl font-bold mb-4 sm:text-xl">Versus Mode</h3>
      <textarea
        placeholder="Write your bars..."
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={bars}
        onChange={(e) => setBars(e.target.value)}
      />
      <input
        type="text"
        placeholder="Opponent username"
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={opponent}
        onChange={(e) => setOpponent(e.target.value)}
      />
      <button
        className="bg-red-600 px-6 py-3 rounded-lg text-lg sm:text-base sm:px-4 sm:py-2 hover:bg-red-700"
        onClick={handleSubmit}
      >
        Submit Battle
      </button>
      {crowdScore > 0 && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg sm:p-2">
          <p className="sm:text-sm">Crowd Reaction: {crowdScore}/100 {crowdScore > 70 ? "(Ooooh! Fire!)" : "(Solid effort)"}</p>
        </div>
      )}
    </div>
  );
}

export default VersusMode;