import React from "react";
import Card from "@/components/common/Card";
import Button from "@/components/common/Button";

export default function RecorderControls({ rec }) {
  if (!rec) {
    throw new Error("RecorderControls: missing `rec` prop. Did you pass useRecorder() from the page?");
  }

  const { isRecording, seconds, error, start, stop, discard } = rec;

  return (
    <Card>
      <h3 className="font-semibold mb-2">Recorder</h3>
      {error && <p className="text-sm text-red-400 mb-2">{String(error)}</p>}

      <div className="flex items-center gap-2 mb-2">
        {!isRecording ? (
          <Button variant="primary" onClick={start}>Start</Button>
        ) : (
          <Button variant="danger" onClick={stop}>Stop</Button>
        )}
        <Button onClick={discard} disabled={isRecording}>Discard</Button>
      </div>

      <p className="text-sm text-gray-400">Elapsed: {seconds}s</p>
    </Card>
  );
}


