// src/hooks/useRecorder.js
import { useEffect, useRef, useState } from "react";

export default function useRecorder() {
  const [permission, setPermission] = useState(null); // null | "granted" | "denied"
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(0);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // ask for mic early (non-blocking)
  useEffect(() => {
    navigator.mediaDevices?.getUserMedia?.({ audio: true })
      .then((s) => { setPermission("granted"); s.getTracks().forEach(t => t.stop()); })
      .catch(() => setPermission("denied"));
  }, []);

  useEffect(() => {
    return () => {
      // cleanup object URL on unmount
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  const startTimer = () => {
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL((old) => { if (old) URL.revokeObjectURL(old); return url; });
      };

      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
      startTimer();
    } catch (e) {
      console.error(e);
      setError("Microphone access failed. Check browser permissions.");
      setPermission("denied");
    }
  };

  const stop = () => {
    const mr = mediaRecorderRef.current;
    if (mr && mr.state !== "inactive") mr.stop();
    setIsRecording(false);
    stopTimer();
  };

  const discard = () => {
    chunksRef.current = [];
    if (audioURL) URL.revokeObjectURL(audioURL);
    setAudioURL(null);
    setSeconds(0);
  };

  return { permission, isRecording, audioURL, error, seconds, start, stop, discard };
}

