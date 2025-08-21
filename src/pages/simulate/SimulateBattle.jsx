import React, { useState } from "react";
import { Link } from "react-router-dom";
import RapperSelector from "../../components/simulate/RapperSelector";
import BattleArena from "../../components/simulate/BattleArena";
import BattleResult from "../../components/simulate/BattleResult";
import Button from "@/components/common/Button"; // ✅ your actual button

/**
 * SimulateBattle
 * Page flow:
 * 1) Select two rappers
 * 2) Enter Battle Arena (progress through rounds)
 * 3) View Result
 */
export default function SimulateBattle() {
  const [stage, setStage] = useState("select"); // select | arena | result
  const [players, setPlayers] = useState({ a: null, b: null });
  const [result, setResult] = useState(null);

  const handleStart = (picked) => {
    setPlayers(picked);
    setStage("arena");
  };

  const handleFinish = (battleSummary) => {
    setResult(battleSummary);
    setStage("result");
  };

  const handleReset = () => {
    setPlayers({ a: null, b: null });
    setResult(null);
    setStage("select");
  };

  return (
    <div className="min-h-screen w-full px-4 py-6 md:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="text-center space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Simulate Battles
          </h1>
          <p className="text-sm text-zinc-400">
            Half game, half tool to sharpen your craft.
          </p>
        </header>

        {stage === "select" && <RapperSelector onStart={handleStart} />}

        {stage === "arena" && (
          <BattleArena
            players={players}
            onFinish={handleFinish}
            onBack={handleReset}
          />
        )}

        {stage === "result" && (
          <BattleResult
            summary={result}
            onRematch={() => setStage("arena")}
            onHome={handleReset}
          />
        )}

        {/* Back-to-home button using your shared Button component */}
        <div className="flex justify-center mt-6">
          <Link to="/">
            <Button variant="primary" size="md">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
