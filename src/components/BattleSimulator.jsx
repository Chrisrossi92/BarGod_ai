import { useState } from 'react';

function BattleSimulator({ battlers, onSimulate, generateBars }) {
  const [battler1, setBattler1] = useState(null);
  const [battler2, setBattler2] = useState(null);
  const [simType, setSimType] = useState("single");
  const [result, setResult] = useState("");

  const handleSimulate = () => {
    if (battler1) {
      const bars = generateBars(battler1, simType, battler2);
      setResult(bars);
      onSimulate(bars);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg sm:p-4">
      <h3 className="text-2xl font-bold mb-4 sm:text-xl">Battle Simulator</h3>
      <div className="grid grid-cols-1 gap-4 sm:gap-2">
        <select
          className="bg-gray-700 p-3 rounded-lg text-lg sm:text-base sm:p-2"
          onChange={(e) => setBattler1(battlers.find((b) => b.id === Number(e.target.value)))}
        >
          <option value="">Select Battler 1</option>
          {battlers.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select
          className="bg-gray-700 p-3 rounded-lg text-lg sm:text-base sm:p-2"
          onChange={(e) => setBattler2(battlers.find((b) => b.id === Number(e.target.value)))}
        >
          <option value="">Select Battler 2 (Optional)</option>
          {battlers.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <select
        className="bg-gray-700 p-3 rounded-lg text-lg mt-4 w-full sm:text-base sm:p-2"
        onChange={(e) => setSimType(e.target.value)}
      >
        <option value="single">Single Bar</option>
        <option value="battle">Full Battle</option>
      </select>
      <button
        className="mt-4 bg-blue-600 px-6 py-3 rounded-lg text-lg sm:text-base sm:px-4 sm:py-2 hover:bg-blue-700"
        onClick={handleSimulate}
      >
        Simulate
      </button>
      {result && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg animate-pulse sm:p-2">
          <p className="sm:text-sm">{result}</p>
        </div>
      )}
    </div>
  );
}

export default BattleSimulator;