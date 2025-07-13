// src/utils/analyzeTranscript.js

// Simple syllable count (approximation)
function syllableCount(word) {
  word = word.toLowerCase();
  let count = 0;
  const vowels = 'aeiouy';
  if (vowels.includes(word[0])) count++;
  for (let i = 1; i < word.length; i++) {
    if (vowels.includes(word[i]) && !vowels.includes(word[i - 1])) count++;
  }
  if (word.endsWith('e')) count--;
  return Math.max(count, 1);
}

// Main analysis function
export default function analyzeTranscript(content, battler1, battler2) {
  // Extract rounds using regex (assumes format like [Round 1: Battler])
  const extractRounds = (text, battler) => {
    const regex = new RegExp(`\\[Round \\d: ${battler}\\](.*?)(\\[Round|\\Z)`, 'gs');
    const matches = text.match(regex) || [];
    return matches.map(match => match.trim());
  };

  const rounds1 = extractRounds(content, battler1).join('\n');
  const rounds2 = extractRounds(content, battler2).join('\n');

  // Helper to compute stats for one battler's text
  const computeStats = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (!lines.length) return { rhyme: 50, flow: 50, punchlines: 50, rebuttals: 50, crowdControl: 50, angles: 50, consistency: 50 };

    // Rhyme: Avg syllables in end-words (higher = more complex multis)
    let rhymeSum = 0, rhymeCount = 0;
    for (let i = 0; i < lines.length - 1; i++) {
      const word1 = lines[i].trim().split(/\s+/).pop() || '';
      const word2 = lines[i + 1].trim().split(/\s+/).pop() || '';
      if (word1.toLowerCase().endsWith(word2.toLowerCase().slice(-word1.length)) || word2.toLowerCase().endsWith(word1.toLowerCase().slice(-word2.length))) {
        rhymeSum += (syllableCount(word1) + syllableCount(word2)) / 2;
        rhymeCount++;
      }
    }
    const rhyme = Math.min(100, Math.round((rhymeSum / rhymeCount || 5) * 10)); // Scale to 0-100

    // Flow: Avg words/line (rapid >10, measured <=10)
    const wordsPerLine = lines.map(line => line.split(/\s+/).length);
    const avgWords = wordsPerLine.reduce((a, b) => a + b, 0) / wordsPerLine.length || 8;
    const flow = Math.min(100, Math.round(avgWords * 8)); // Higher for faster flow

    // Punchlines: Freq of impact words (!, caps, slang like 'fuck', 'bitch')
    const punchKeywords = /fuck|bitch|faggot|cocksucker|pop|die|!|[A-Z]{3,}/g;
    const punchCount = lines.reduce((count, line) => count + (line.match(punchKeywords) || []).length, 0);
    const punchlines = Math.min(100, Math.round((punchCount / lines.length) * 50)); // Scale

    // Rebuttals/Angles: Placeholder (detect opponent mentions/personal attacks; refine later)
    const rebuttals = Math.round(Math.random() * 20 + 80); // Temp 80-100; use keyword count for 'you', opponent name
    const angles = Math.round(Math.random() * 20 + 80);

    // CrowdControl/Consistency: Based on line variety/length std dev
    const lenStdDev = Math.sqrt(wordsPerLine.reduce((sum, len) => sum + Math.pow(len - avgWords, 2), 0) / wordsPerLine.length) || 5;
    const crowdControl = Math.min(100, 100 - Math.round(lenStdDev * 5)); // Lower variance = better control
    const consistency = crowdControl; // Similar for now

    return { rhyme, flow, punchlines, rebuttals, crowdControl, angles, consistency };
  };

  return {
    battler1Stats: computeStats(rounds1),
    battler2Stats: computeStats(rounds2),
    references: [], // Future: Extract cited battles/schemes
  };
}