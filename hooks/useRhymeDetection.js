import { useMemo } from "react";
const vowelTail = (w="") => {
  const s = w.toLowerCase().replace(/[^a-zà-öø-ÿ']/gi,"");
  const m = s.match(/[aeiouyà-öø-ÿ][a-zà-öø-ÿ']*$/i);
  return m ? m[0] : s || null;
};

export default function useRhymeDetection(text) {
  const lines = (text || "").split(/\r?\n/);
  return useMemo(() => {
    const lastWords = lines.map(l => (l.match(/[A-Za-zÀ-ÖØ-öø-ÿ']+(?:[-'][A-Za-zÀ-ÖØ-öø-ÿ']+)*/g)||[]).pop() || null);
    const tails = lastWords.map(w => w ? vowelTail(w) : null);
    const tally = tails.reduce((a,t)=> (t ? (a[t]=(a[t]||0)+1, a) : a), {});
    const topTail = Object.entries(tally).sort((a,b)=>b[1]-a[1])[0];
    return { lines, tails, topTail: topTail && topTail[1] >= 2 ? topTail[0] : null };
  }, [text]);
}
