import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Import real client (adjust path if needed)
import Home from './components/Home';
import ProfilesPage from './components/ProfilesPage'; // Your new component
import BattlerProfile from './components/BattlerProfile';
import BattleSimulator from './components/BattleSimulator';
import BarBuilder from './components/BarBuilder';
import VersusMode from './components/VersusMode';
import Leaderboard from './components/Leaderboard';
import logo from './assets/logo.png';
import TranscriptUpload from './components/TranscriptUpload';

// Mock leaderboard data (keep for now; can make real later)
const mockLeaderboard = [
  { username: "SpitFireMC", wins: 25, score: 1500 },
  { username: "RhymeKilla", wins: 20, score: 1200 },
  { username: "BarGod420", wins: 15, score: 900 },
];

// Mock AI functions (keep placeholders; replace with real AI later)
const analyzeTranscript = (transcript) => {
  // Placeholder...
  return {
    battler1Stats: { rhymeComplexity: 7, punchlineFreq: 0.5, flowCadence: 'measured' },
    battler2Stats: { rhymeComplexity: 6, punchlineFreq: 0.4, flowCadence: 'measured' },
    references: [],
  };
};

const generateBars = (battler, type = "single", opponent = null) => {
  const baseBars = battler.sampleBars?.[0] || "Default bars"; // Use real if available
  if (type === "battle") {
    return `${baseBars} / Yo, ${opponent?.name || "fool"}, I’m back with the heat, you can’t compete / Your bars so soft, they belong in a tweet`;
  }
  return baseBars;
};

const buildBars = (theme, length = 4, style = null) => {
  const templates = [
    `I’m ${theme}, comin’ through with the spark / Light up the mic, leave ‘em lost in the dark`,
    `On ${theme}, I’m the king of the scene / Bars so clean, they shine like a gleam`,
  ];
  return templates.slice(0, length / 2).join(" / ");
};

function App() {
  const [battlers, setBattlers] = useState([]);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [user, setUser] = useState({ username: "Guest", id: null });

  useEffect(() => {
    const fetchBattlers = async () => {
      try {
        const { data, error } = await supabase.from("battlers").select('*'); // Fetch all columns
        if (error) throw error;
        setBattlers(data || []);
      } catch (error) {
        console.error('Error fetching battlers:', error.message);
        // Optional: Fallback to empty array or show toast/UI error
      }
    };
    fetchBattlers();
  }, []);

  const handleSimulate = async (bars) => {
    // Real insert (remove mock)
    await supabase.from("simulations").insert({ bars, userId: user.id });
  };

  const handleGenerate = async (bars) => {
    // Real insert
    await supabase.from("user_bars").insert({ bars, userId: user.id });
  };

  const handleVersusSubmit = async ({ bars, opponent }) => {
    // Real insert and update leaderboard (mock update for now)
    await supabase.from("versus_battles").insert({ bars, opponent, userId: user.id });
    setLeaderboard([...leaderboard, { username: user.username, wins: 1, score: 100 }]);
  };

  // Callback for upload analysis
  const handleUpload = async (analysis) => {
    console.log('Upload analysis result:', analysis);
    // Refetch battlers after upload
    const { data } = await supabase.from('battlers').select('*');
    setBattlers(data || []);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 p-4 sm:p-2">
      <header className="flex justify-between items-center mb-8 sm:mb-4">
        <Link to="/">
          <img src={logo} alt="BarGod.Ai Logo" className="h-12 sm:h-10 hover:scale-105 transition duration-300" />
        </Link>
        <div>
          <span className="mr-4 sm:text-sm">Welcome, {user.username}</span>
          <button className="bg-gray-700 px-4 py-2 rounded sm:text-sm">Login</button>
        </div>
      </header>

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profiles" element={<ProfilesPage battlers={battlers} />} />
          <Route path="/simulator" element={<BattleSimulator battlers={battlers} onSimulate={handleSimulate} generateBars={generateBars} />} />
          <Route path="/bar-builder" element={<BarBuilder onGenerate={handleGenerate} buildBars={buildBars} />} />
          <Route path="/versus" element={<VersusMode onSubmit={handleVersusSubmit} />} />
          <Route path="/leaderboard" element={<Leaderboard data={leaderboard} />} />
          <Route path="/upload" element={<TranscriptUpload onUpload={handleUpload} />} />
        </Routes>
      </main>

      <footer className="mt-8 text-center text-gray-500 sm:text-sm">
        <p>© 2025 BarGod.Ai. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
