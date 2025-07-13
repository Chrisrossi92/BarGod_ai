import { useState } from 'react';

function BarBuilder({ onGenerate, buildBars }) {
  const [theme, setTheme] = useState("");
  const [length, setLength] = useState(4);
  const [style, setStyle] = useState("");
  const [result, setResult] = useState("");
  const [notebook, setNotebook] = useState([]);

  const handleGenerate = () => {
    if (theme) {
      const bars = buildBars(theme, length, style);
      setResult(bars);
      setNotebook([...notebook, bars]);
      onGenerate(bars);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg sm:p-4">
      <h3 className="text-2xl font-bold mb-4 sm:text-xl">Bar Builder</h3>
      <input
        type="text"
        placeholder="Theme (e.g., street, hustle)"
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
      />
      <select
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={length}
        onChange={(e) => setLength(Number(e.target.value))}
      >
        <option value={4}>4 Bars</option>
        <option value={8}>8 Bars</option>
        <option value={16}>16 Bars</option>
      </select>
      <input
        type="text"
        placeholder="Style (e.g., Dizaster, Pat Stay)"
        className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2"
        value={style}
        onChange={(e) => setStyle(e.target.value)}
      />
      <button
        className="bg-purple-600 px-6 py-3 rounded-lg text-lg sm:text-base sm:px-4 sm:py-2 hover:bg-purple-700"
        onClick={handleGenerate}
      >
        Generate Bars
      </button>
      {result && (
        <div className="mt-4 bg-gray-900 p-4 rounded-lg sm:p-2">
          <p className="sm:text-sm">{result}</p>
        </div>
      )}
      {notebook.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-bold sm:text-base">Notebook</h4>
          {notebook.map((bars, idx) => (
            <p key={idx} className="bg-gray-900 p-2 rounded-lg mt-2 sm:text-sm">{bars}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default BarBuilder;