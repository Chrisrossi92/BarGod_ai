import { Link } from 'react-router-dom';
import { FaMicrophoneAlt, FaChartBar, FaHammer, FaFistRaised, FaTrophy, FaUpload } from 'react-icons/fa'; // Added FaUpload for uploader icon
import battleStage from '../assets/battle-stage.jpg'; // Ensure this file exists

function Home() {
  return (
    <div className="text-center">
      {/* Hero Section with Extended Background */}
      <div 
        className="relative bg-cover bg-center min-h-[60vh] py-16 mb-8 rounded-lg shadow-lg"
        style={{ backgroundImage: `url(${battleStage})` }}
      >
        <div className="absolute inset-0 bg-black opacity-60 rounded-lg"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 sm:text-4xl text-white drop-shadow-lg">BarGod.Ai</h1>
          <p className="text-xl mb-6 sm:text-lg text-gray-200 font-semibold">Forge Your Bars, Dominate the Ring – AI-Powered Battle Rap Practice</p>
          <button className="bg-red-600 px-8 py-4 rounded-lg text-lg font-bold hover:bg-red-700 transition duration-300 text-white">
            Start Your Battle Now
          </button>
          <p className="mt-4 text-gray-300 sm:text-sm">Join 10K+ MCs – Build Fire Bars & Climb the Ranks!</p>
        </div>
      </div>

      {/* Daily Challenge Hook */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-2xl font-bold mb-2 text-white">Today's Challenge 🔥</h2>
        <p className="text-gray-400 mb-4">Craft an 8-Bar Diss on "Fake MCs" – Top Entry Wins a Feature Spotlight!</p>
        <Link to="/bar-builder" className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 text-white font-bold">Enter Now</Link>
      </div>

      {/* Navigation Cards Grid with Upload Card */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        <Link to="/profiles" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaChartBar className="text-4xl mb-2 text-blue-500" />
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Battler Profiles</h2>
          <p className="text-gray-300 sm:text-sm">Analyze legends like Dizaster and Pat Stay</p>
        </Link>
        <Link to="/simulator" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaMicrophoneAlt className="text-4xl mb-2 text-red-500" />
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Battle Simulator</h2>
          <p className="text-gray-300 sm:text-sm">Simulate epic clashes in real styles</p>
        </Link>
        <Link to="/bar-builder" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaHammer className="text-4xl mb-2 text-purple-500" />
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Bar Builder</h2>
          <p className="text-gray-300 sm:text-sm">Craft 4s, 8s, or 16s with AI help</p>
        </Link>
        <Link to="/versus" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaFistRaised className="text-4xl mb-2 text-green-500" />
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Versus Mode</h2>
          <p className="text-gray-300 sm:text-sm">Battle users with crowd reactions</p>
        </Link>
        <Link to="/leaderboard" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaTrophy className="text-4xl mb-2 text-yellow-500" />
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Leaderboard</h2>
          <p className="text-gray-300 sm:text-sm">Climb ranks and see top MCs</p>
        </Link>
        <Link to="/upload" className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 hover:scale-105 transition duration-300 shadow-md border border-gray-700">
          <FaUpload className="text-4xl mb-2 text-indigo-500" /> {/* New icon for upload */}
          <h2 className="text-2xl font-bold mb-2 sm:text-xl text-white">Upload Battles</h2>
          <p className="text-gray-300 sm:text-sm">Add and analyze new battle transcripts</p>
        </Link>
      </div>
    </div>
  );
}

export default Home;