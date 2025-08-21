import React, { useEffect, useMemo, useRef, useState } from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";
import PROMPT_WORDS from "@/data/promptWords";

// Small helper to pick random words without repeats in a short session
function sampleWords(bank, n) {
  const arr = [...bank];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, n);
}

export default function PromptDrill({
  rec,                 // required: useRecorder() instance
  beatURL,             // optional: URL to play under the drill
  durationSec = 60,    // total drill length
  intervalSec = 6,     // new word every N sec
  onExit,              // called when user ends drill
}) {
  const [status, setStatus] = useState("idle"); // idle | countdown | running | finished
  const [count, setCount] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const totWords = Math.max(1, Math.floor(durationSec / intervalSec));
  const words = useMemo(() => sampleWords(PROMPT_WORDS, totWords), [durationSec, intervalSec]);
  const [idx, setIdx] = useState(0);

  const audioRef = useRef(null);
  const tickRef = useRef(null);

  // Load/unload beat element when beatURL changes
  useEffect(() => {
    if (!beatURL) return;
    const a = new Audio(beatURL);
    a.crossOrigin = "anonymous";
    a.loop = true;
    audioRef.current = a;
    return () => {
      a.pause();
      audioRef.current = null;
    };
  }, [beatURL]);

  const startDrill = async () => {
    setStatus("countdown");
    setCount(3);
  };

  // Countdown -> start
  useEffect(() => {
    if (status !== "countdown") return;
    const t = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(t);
          // begin
          audioRef.current?.play().catch(() => {}); // no-op if blocked
          rec.start?.(); // your hook
          setStatus("running");
          setElapsed(0);
          setIdx(0);
          // begin ticking
          tickRef.current = setInterval(() => {
            setElapsed((e) => e + 1);
          }, 1000);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Advance words & stop at end
  useEffect(() => {
    if (status !== "running") return;
    const nextIdx = Math.floor(elapsed / intervalSec);
    if (nextIdx !== idx && nextIdx < words.length) setIdx(nextIdx);

    if (elapsed >= durationSec) finishDrill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elapsed, status]);

  const skipWord = () => {
    if (status !== "running") return;
    setIdx((i) => Math.min(i + 1, words.length - 1));
  };

  const finishDrill = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    audioRef.current?.pause();
    rec.stop?.();
    setStatus("finished");
  };

  const discardDrill = () => {
    if (tickRef.current) clearInterval(tickRef.current);
    audioRef.current?.pause();
    rec.discard?.();
    setStatus("idle");
    setElapsed(0);
    setIdx(0);
    onExit?.();
  };

  // safety: clean up timers on unmount
  useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      audioRef.current?.pause();
    };
  }, []);

  const remaining = Math.max(0, durationSec - elapsed);
  const mm = String(Math.floor(remaining / 60)).padStart(1, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  return (
    <Card className="relative overflow-hidden">
      {/* header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Prompt Drill</h3>
        <div className="text-xs text-gray-400">New word every {intervalSec}s • Total {durationSec}s</div>
      </div>

      {/* big prompt word */}
      <div className="flex flex-col items-center justify-center py-8">
        {status === "idle" && (
          <p className="text-sm text-gray-400 text-center">
            Pick a beat (optional), then hit Start. We’ll flash a new word every {intervalSec}s.
          </p>
        )}

        {status === "countdown" && (
          <div className="text-6xl font-black tracking-widest">{count || "GO"}</div>
        )}

        {status === "running" && (
          <>
            <div className="text-4xl md:text-5xl font-extrabold tracking-wide mb-3 select-none">
              {words[idx]}
            </div>
            <div className="text-xs text-gray-400">
              {idx + 1}/{words.length} prompts
            </div>
          </>
        )}

        {status === "finished" && (
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">Drill complete</div>
            <p className="text-sm text-gray-400">Replay your take below or run it back.</p>
          </div>
        )}
      </div>

      {/* controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-gray-400">Time left: {mm}:{ss}</div>
        <div className="flex items-center gap-2">
          {status === "idle" && <Button variant="primary" onClick={startDrill}>Start</Button>}
          {status === "countdown" && <Button onClick={discardDrill}>Cancel</Button>}
          {status === "running" && (
            <>
              <Button onClick={skipWord}>Skip</Button>
              <Button variant="danger" onClick={finishDrill}>Stop</Button>
            </>
          )}
          {status === "finished" && (
            <>
              <Button onClick={startDrill}>Run Again</Button>
              <Button onClick={onExit}>Done</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
