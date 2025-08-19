// src/components/RhymePreview.jsx
import React from "react";

function rhymeTail(word) {
  const w = (word || "").toLowerCase().replace(/[^a-zà-öø-ÿ']/gi, "");
  const m = w.match(/[aeiouyà-öø-ÿ][a-zà-öø-ÿ']*$/i);
  return m ? m[0] : w || null;
}

export default function RhymePreview({ text }) {
  const lines = (text || "").split(/\r?\n/);

  // last word per line
  const lastWords = lines.map((line) => {
    const words = line.match(/[A-Za-zÀ-ÖØ-öø-ÿ']+(?:[-'][A-Za-zÀ-ÖØ-öø-ÿ']+)*/g);
    return words && words.length ? words[words.length - 1] : null;
  });

  // count rhyme tails & pick the most common (ties don’t matter for this test)
  const tails = lastWords.map((w) => (w ? rhymeTail(w) : null));
  const tally = tails.reduce((acc, t) => (t ? ((acc[t] = (acc[t] || 0) + 1), acc) : acc), {});
  const [topTail] = Object.entries(tally).sort((a, b) => b[1] - a[1])[0] || [null, 0];

  const wrapped = []; // for console logging

  return (
    <div data-test="rhyme-preview" className="whitespace-pre-wrap leading-7">
      {lines.map((line, li) => {
        const tokens = line.split(/(\s+)/); // keep spaces

        // find last word token index
        let lastWordIdx = -1;
        for (let i = tokens.length - 1; i >= 0; i--) {
          if (/[A-Za-zÀ-ÖØ-öø-ÿ']+/.test(tokens[i])) { lastWordIdx = i; break; }
        }

        if (lastWordIdx !== -1) {
          const raw = tokens[lastWordIdx];
          const tail = rhymeTail(raw);
          const shouldHighlight = topTail && tail === topTail && tally[topTail] >= 2;

          if (shouldHighlight) {
            wrapped.push({ line: li + 1, word: raw, tail });
            tokens[lastWordIdx] = (
              <span
                key={`w-${li}-${lastWordIdx}`}
                className="rh"
                style={{
                  fontWeight: 800,
                  padding: "0 .15rem",
                  textDecoration: "underline",
                  textDecorationStyle: "dotted",
                  background: "rgba(250, 204, 21, .25)", // amber-300 @ 25%
                  borderRadius: "4px",
                }}
              >
                {raw}
              </span>
            );
          }
        }

        return (
          <div key={`line-${li}`}>
            {tokens.map((t, i) => (
              <React.Fragment key={`frag-${li}-${i}`}>{t}</React.Fragment>
            ))}
          </div>
        );
      })}
      {console.log("RhymePreview wrapped:", wrapped)}
    </div>
  );
}



