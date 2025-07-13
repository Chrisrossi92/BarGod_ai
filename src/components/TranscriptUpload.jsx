import { useState } from 'react';
import { supabase } from '../supabaseClient';
import analyzeTranscript from '../utils/analyzeTranscript';

function TranscriptUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [battler1, setBattler1] = useState('');
  const [battler2, setBattler2] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;

      try {
        const analysis = analyzeTranscript(content, battler1, battler2);

        // Helper to fetch/create/update battler with aggregated stats
        const updateBattlerWithAggregate = async (name, newStats) => {
          let { data: battler, error } = await supabase
            .from('battlers')
            .select('*')
            .eq('name', name)
            .single();

          if (error && error.code === 'PGRST116') { // Not found, create
            ({ data: battler, error } = await supabase
              .from('battlers')
              .insert({ name, bio: '', photo_url: null, stats: newStats, biggest_punches: [], battle_count: 1 })
              .select('*')
              .single());
            if (error) throw error;
          } else if (error) throw error;
          else { // Exists, aggregate
            const oldStats = battler.stats || {};
            const count = (battler.battle_count || 0) + 1;
            const aggregatedStats = {};
            Object.keys(newStats).forEach(key => {
              aggregatedStats[key] = Math.round(((oldStats[key] || 50) * (count - 1) + newStats[key]) / count);
            });
            ({ error } = await supabase
              .from('battlers')
              .update({ stats: aggregatedStats, battle_count: count, biggest_punches: [...(battler.biggest_punches || []), ...newStats.biggestPunches || []] })
              .eq('name', name));
            if (error) throw error;
          }
          return battler.id;
        };

        const battler1Id = await updateBattlerWithAggregate(battler1, analysis.battler1Stats);
        const battler2Id = await updateBattlerWithAggregate(battler2, analysis.battler2Stats);

        // Insert transcript
        const { error: transcriptError } = await supabase
          .from('transcripts')
          .insert({ battler1_id: battler1Id, battler2_id: battler2Id, content });
        if (transcriptError) throw transcriptError;

        onUpload(analysis);
      } catch (error) {
        console.error('Processing error:', error.message);
      }
      setUploading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg sm:p-4">
      <h3 className="text-2xl font-bold mb-4 sm:text-xl">Upload Transcript</h3>
      <input type="text" placeholder="Battler 1 Name" className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2" value={battler1} onChange={(e) => setBattler1(e.target.value)} />
      <input type="text" placeholder="Battler 2 Name" className="bg-gray-700 p-3 rounded-lg w-full mb-4 text-lg sm:text-base sm:p-2" value={battler2} onChange={(e) => setBattler2(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} className="mb-4" />
      <button className="bg-green-600 px-6 py-3 rounded-lg text-lg sm:text-base sm:px-4 sm:py-2 hover:bg-green-700" onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload and Analyze'}
      </button>
    </div>
  );
}

export default TranscriptUpload;