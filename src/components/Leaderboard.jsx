function Leaderboard({ data }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg sm:p-4">
      <h3 className="text-2xl font-bold mb-4 sm:text-xl">Leaderboard</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left p-2 sm:p-1 sm:text-sm">Rank</th>
            <th className="text-left p-2 sm:p-1 sm:text-sm">Username</th>
            <th className="text-left p-2 sm:p-1 sm:text-sm">Wins</th>
            <th className="text-left p-2 sm:p-1 sm:text-sm">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className="border-b border-gray-700">
              <td className="p-2 sm:p-1 sm:text-sm">{idx + 1}</td>
              <td className="p-2 sm:p-1 sm:text-sm">{entry.username}</td>
              <td className="p-2 sm:p-1 sm:text-sm">{entry.wins}</td>
              <td className="p-2 sm:p-1 sm:text-sm">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;