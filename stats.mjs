import { getSubtitleSpeakerPairs } from './subtitles.mjs';

function tokenize(s) {
    return s.split(/[\s\.\,!\?]+/)
    .map(w => w.toLowerCase())
    .filter(w => w.length > 0 && !(['0', '1', '2', '3', '4', '5','6', '7', '8', '9'].includes(w[0])));
}

export function computeStats(subtitles, metadata) {
    const pairs = getSubtitleSpeakerPairs(subtitles, metadata);

    const times = new Map(); //   who => how many secs did they talk
    const lengths = new Map(); // who => how many chars did they talk

    const wordOccurrences = new Map(); // array of pairs [time, who]

    for (const [sub, speaker] of pairs) {
        const t = sub.start;
        const dur = sub.end - sub.start;
        times.set(speaker, (times.get(speaker) || 0) + dur);
        lengths.set(speaker, (lengths.get(speaker) || 0) + sub.content.length);

        const words = tokenize(sub.content);
        
        for (const w of words) {
            const bag = wordOccurrences.get(w) || [];
            bag.push([t, speaker]);
            wordOccurrences.set(w, bag);
        }
    }

    const wordHistogram = new Map();
    for (const [w, occurrences] of wordOccurrences) {
        const count = occurrences.length;
        wordHistogram.set(w, count);
    }

    const wordRank = Array.from(wordHistogram);
    wordRank.sort((a, b) => b[1] - a[1]);

    return { times, lengths, wordOccurrences, wordHistogram, wordRank };
}
