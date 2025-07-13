import { useState, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

function BattlerProfile({ battler }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => setIsFlipped(!isFlipped);

  // Calculate overall as average of stats
  const statsValues = Object.values(battler.stats || {});
  const overall = statsValues.length > 0 ? Math.round(statsValues.reduce((a, b) => a + b, 0) / statsValues.length) : 50;

  useEffect(() => {
    if (isFlipped) { // Only init chart on back side
      try {
        const ctx = document.getElementById(`chart-${battler.id}`).getContext("2d");
        new Chart(ctx, {
          type: 'radar',
          data: {
            labels: Object.keys(battler.stats || {}),
            datasets: [{
              label: `${battler.name}'s Stats`,
              data: Object.values(battler.stats || {}),
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgba(59, 130, 246, 1)',
              borderWidth: 2,
            }],
          },
          options: {
            scales: { r: { beginAtZero: true, max: 100, ticks: { stepSize: 20 } } },
            plugins: { legend: { display: false } },
          },
        });
      } catch (e) {
        console.error("Chart error for", battler.name, ":", e);
      }
    }
  }, [isFlipped, battler]);

  return (
    <>
      <style>{`
        .card-container {
          perspective: 1000px;
          width: 100%;
          height: 400px; /* Adjust as needed */
        }
        .card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        .card-flipped .card-inner {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          border-radius: 8px;
          background: #1f2937; /* Matches your dark theme */
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>
      <div className={`card-container ${isFlipped ? 'card-flipped' : ''}`} onClick={handleFlip}>
        <div className="card-inner">
          {/* Front Side */}
          <div className="card-front">
            {battler.photoUrl && <img src={battler.photoUrl} alt={`${battler.name} photo`} className="w-32 h-32 rounded-full mb-4" />}
            <h3 className="text-2xl font-bold sm:text-xl">{battler.name}</h3>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">Overall: {overall}</span>
            <p className="text-gray-400 sm:text-sm text-center">{battler.bio}</p>
            <p className="text-gray-500 mt-2 text-sm">Click to flip for details</p>
          </div>
          {/* Back Side */}
          <div className="card-back">
            <h3 className="text-2xl font-bold sm:text-xl mb-2">{battler.name} Stats</h3>
            <canvas id={`chart-${battler.id}`} className="mt-2 mb-4 w-full max-w-xs"></canvas>
            <div className="grid grid-cols-2 gap-2 text-sm sm:text-xs w-full">
              {Object.entries(battler.stats || {}).map(([key, value]) => (
                <div key={key}><strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong> {value}</div>
              ))}
            </div>
            <p className="mt-4 sm:text-sm"><strong>Biggest Punches:</strong> {battler.stats?.biggestPunches?.join(', ') || 'N/A'}</p>
            <p className="text-gray-500 mt-2 text-sm">Click to flip back</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default BattlerProfile;