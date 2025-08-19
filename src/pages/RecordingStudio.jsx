// src/pages/RecordingStudio.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "@/components/TopBar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import BeatPicker from "@/components/studio/BeatPicker";
import TakePlayer from "@/components/studio/TakePlayer";
import RecorderControls from "@/components/studio/RecorderControls";
import useRecorder from "@/hooks/useRecorder";
import { getById, upsertTake } from "@/utils/myWorkStore";


export default function RecordingStudio() {
  const navigate = useNavigate();
  const [search] = useSearchParams();

  // meta
  const [takeId, setTakeId] = useState(null);
  const [title, setTitle] = useState("");
  const [beatName, setBeatName] = useState("");
  const [beatURL, setBeatURL] = useState(null);
  const [savedDuration, setSavedDuration] = useState(0);

  // recorder
  const rec = useRecorder();

  // load existing take meta if ?open=id
  useEffect(() => {
    const openId = search.get("open");
    if (openId) {
      const it = getById(openId);
      if (it && it.type === "take") {
        setTakeId(it.id);
        setTitle(it.title || "");
        setBeatName(it.beatName || "");
        setSavedDuration(Number(it.duration) || 0);
      }
    }
  }, [search]);

  // beat picker handlers
  const onBeatPick = ({ url, name }) => {
    if (beatURL) URL.revokeObjectURL(beatURL);
    setBeatURL(url);
    setBeatName(name);
  };
  const onBeatClear = () => {
    if (beatURL) URL.revokeObjectURL(beatURL);
    setBeatURL(null);
    setBeatName("");
  };

  const downloadRecording = () => {
    if (!rec.audioURL) return;
    const a = document.createElement("a");
    a.href = rec.audioURL;
    a.download = `${title || "take"}.webm`;
    a.click();
  };

  const saveTake = () => {
    const id = upsertTake({
      id: takeId || undefined,
      title: title || "Untitled Take",
      duration: rec.seconds || savedDuration || 0,
      beatName: beatName || "",
    });
    if (!takeId) setTakeId(id);
    setSavedDuration(rec.seconds || savedDuration || 0);
  };

  const fmt = (n) => new Date(n * 1000).toISOString().substring(14, 19);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <TopBar right="studio" />

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <h1 className="text-3xl font-bold text-center mb-1">Studio</h1>
        <p className="text-center text-gray-400 text-sm mb-4">
          Record over a beat, review, and save your take to My Work.
        </p>

        {/* Title + beat controls */}
        <Card className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Take title"
              className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <BeatPicker beatURL={beatURL} beatName={beatName} onPick={onBeatPick} onClear={onBeatClear} />
            </div>
          </div>
        </Card>

        {/* Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BeatPicker beatURL={beatURL} beatName={beatName} onPick={onBeatPick} onClear={onBeatClear} />
          <TakePlayer audioURL={rec.audioURL} />
        </div>

        {/* Recorder controls */}
        <div className="mt-4">
          <RecorderControls
            permission={rec.permission}
            isRecording={rec.isRecording}
            audioURL={rec.audioURL}
            error={rec.error}
            seconds={rec.seconds}
            start={rec.start}
            stop={rec.stop}
            discard={rec.discard}
            onDownload={downloadRecording}
          />
        </div>

        {/* Save row */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-400">
            {savedDuration ? `Last saved: ${fmt(savedDuration)}` : "No saved takes yet."}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="primary" onClick={saveTake}>Save to My Work</Button>
            <Button onClick={() => navigate("/my-work")}>Go to My Work</Button>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          “Save to My Work” stores title, beat name, and duration. Use <span className="px-1 rounded bg-zinc-800 border border-zinc-700">Download</span> to keep audio.
        </p>
      </div>
    </div>
  );
}

