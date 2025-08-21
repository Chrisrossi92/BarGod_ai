import React, { useEffect, useState } from "react";
import TopBar from "@/components/TopBar";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import BeatPicker from "@/components/studio/BeatPicker";
import TakePlayer from "@/components/studio/TakePlayer";
import RecorderControls from "@/components/studio/RecorderControls";
import PromptDrill from "@/components/lab/PromptDrill";
import useRecorder from "../../hooks/useRecorder";

export default function FreestyleLab() {
  // meta
  const [mode, setMode] = useState("home"); // home | quick | drill
  const [beatURL, setBeatURL] = useState(null);
  const [beatName, setBeatName] = useState("");

  const rec = useRecorder();

  // clean blob urls
  useEffect(() => {
    return () => beatURL && URL.revokeObjectURL(beatURL);
  }, [beatURL]);

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

  const download = () => {
    if (!rec.audioURL) return;
    const a = document.createElement("a");
    a.href = rec.audioURL;
    a.download = `${mode === "drill" ? "drill" : "freestyle"}.webm`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white">
      <TopBar right="studio" />

      <div className="max-w-3xl mx-auto px-4 pb-16">
        <h1 className="text-3xl font-bold text-center mt-2 mb-1">Freestyle Lab</h1>
        <p className="text-center text-gray-400 text-sm mb-4">
          Half game, half tool — train your craft with drills and quick freestyles.
        </p>

        {/* Beat picker row (shared) */}
        <Card className="mb-3">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center gap-2">
              <BeatPicker beatURL={beatURL} beatName={beatName} onPick={onBeatPick} onClear={onBeatClear} />
            </div>
          </div>
        </Card>

        {mode === "home" && (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">Quick Freestyle</div>
                  <div className="text-sm text-gray-400">Pick a beat and record. Simple and clean.</div>
                </div>
                <Button variant="primary" onClick={() => setMode("quick")}>Open</Button>
              </div>
            </Card>
            <Card>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">Prompt Drill</div>
                  <div className="text-sm text-gray-400">New word every few seconds. Stay on beat.</div>
                </div>
                <Button variant="primary" onClick={() => setMode("drill")}>Open</Button>
              </div>
            </Card>
            <Card className="opacity-60">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">Battle Arena (Coming Soon)</div>
                  <div className="text-sm text-gray-400">Asynchronous battles, voting, and leaderboards.</div>
                </div>
                <Button disabled>Soon</Button>
              </div>
            </Card>
          </div>
        )}

        {mode === "quick" && (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div className="font-semibold">Quick Freestyle</div>
                <Button onClick={() => setMode("home")}>Back</Button>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* show the chosen beat name as a simple reminder */}
              <Card>
                <div className="text-sm text-gray-400 mb-1">Beat</div>
                <div className="font-medium">{beatName || "None"}</div>
                <div className="text-xs text-gray-500 mt-2">Tip: headphones recommended to avoid echo.</div>
              </Card>
              <TakePlayer audioURL={rec.audioURL} />
            </div>

            {/* Recorder controls */}
            <RecorderControls rec={rec} />
            <div className="flex items-center justify-end">
              <Button onClick={download} disabled={!rec.audioURL}>Download</Button>
            </div>
          </div>
        )}

        {mode === "drill" && (
          <div className="grid grid-cols-1 gap-4">
            <Card>
              <div className="flex items-center justify-between">
                <div className="font-semibold">Prompt Drill</div>
                <Button onClick={() => setMode("home")}>Back</Button>
              </div>
            </Card>

            <PromptDrill
              rec={rec}
              beatURL={beatURL}
              durationSec={60}
              intervalSec={6}
              onExit={() => setMode("home")}
            />

            {/* After drill ends, user can replay or download via TakePlayer */}
            <TakePlayer audioURL={rec.audioURL} />
            <div className="flex items-center justify-end">
              <Button onClick={download} disabled={!rec.audioURL}>Download</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
