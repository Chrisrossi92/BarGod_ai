import React, { useState, useEffect } from "react";
import SyllableCounter from "../components/barbuilder/SyllableCounter";
import RhymeHighlighter from "../components/barbuilder/RhymeHighlighter";
import SaveStatus from "../components/barbuilder/SaveStatus";
import RhymeSettingsPanel from "../components/barbuilder/RhymeSettingsPanel";
import RhymeFamilyLegend from "../components/barbuilder/RhymeFamilyLegend";
import usePhoneticMap from "../lib/hooks/usePhoneticMap";
import { initPhonetics } from "../lib/phonetics";
import { getCmuDict } from "../lib/loadCmuDict";
import { getPhonemes } from "../lib/phonetics";

export default function BarBuilder() {
  const [bars, setBars] = useState("");
  const [syllables, setSyllables] = useState(0);
  const [saved, setSaved] = useState(true);
  const [depth, setDepth] = useState(2);
  const [internal, setInternal] = useState(false);
  const [ready, setReady] = useState(false);

  const { coloredWords, buckets } = usePhoneticMap(bars, { depth, internal });

  useEffect(() => {
    initPhonetics().then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) {
      const dict = getCmuDict();
      console.log("CMUdict loaded with", Object.keys(dict || {}).length, "entries");
      console.log("Phonemes for 'finesse':", getPhonemes("finesse"));
    }
  }, [ready]);

  useEffect(() => {
    const savedDraft = localStorage.getItem("draft-bars");
    if (savedDraft) setBars(savedDraft);
  }, []);

  useEffect(() => {
    const words = bars.split(/\s+/);
    const count = words.reduce((acc, word) => {
      const matches = word.toLowerCase().match(/[aeiouy]+/g);
      return acc + (matches ? matches.length : 0);
    }, 0);
    setSyllables(count);
  }, [bars]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem("draft-bars", bars);
      setSaved(true);
    }, 500);
    setSaved(false);
    return () => clearTimeout(timeout);
  }, [bars]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Bar Builder</h1>
        <p className="text-center text-gray-400 text-sm mb-2">
          Write, analyze, and refine your bars.
        </p>
        <SyllableCounter count={syllables} />
        <SaveStatus saved={saved} />
        <RhymeSettingsPanel
          depth={depth}
          setDepth={setDepth}
          internal={internal}
          setInternal={setInternal}
        />

        <textarea
          value={bars}
          onChange={(e) => setBars(e.target.value)}
          placeholder="Start writing your bars here..."
          rows={10}
          className="w-full p-4 bg-zinc-800 border border-zinc-600 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-lime-400 shadow-md mb-4"
        />

        {ready ? (
          <>
            <RhymeHighlighter text={bars} depth={depth} internal={internal} />
            <RhymeFamilyLegend buckets={buckets} />
          </>
        ) : (
          <div className="text-center text-sm text-gray-500 italic">
            Loading rhyme dictionary...
          </div>
        )}
      </div>
    </div>
  );
}
