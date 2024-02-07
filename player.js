
    // 00:03:02,100
function parseTime(str) {
    const parts = str.split(/[:,]/);

    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const ss = parseInt(parts[2], 10);
    const frac = parseFloat('0.' + parts[3]);

    return hh * 3600 + mm * 60 + ss + frac;
}

function humanTime(secs) {
    const hh = Math.floor(secs / 3600); secs -= hh * 3600;
    const mm = Math.floor(secs /   60); secs -= mm *   60;
    const ss = Math.floor(secs);
    if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
}

function parseSrt(str) {
    const lines = str.split('\n');
    const result = [];
    try {
        while (true) {
            let l = lines.shift();
            const index = parseInt(l, 10); // 1

            l = lines.shift();
            parts = l.split(' --> '); // 00:00:11,380 --> 00:00:16,620
            const [start, end] = parts.map(parseTime);

            let content = '';
            while (true) {
                l = lines.shift();
                if (!l) break;
                if (!content) content = l;
                else content = content + '\n' + l;
            }

            const o = { start, end, content, index };
            result.push(o);
        }
    } catch (err) {
        //console.log('err', err);
    }
    return result;
}

async function player(name) {
    const audioUrl = `${name}.mp3`;
    const subtitleUrl = `${name}.srt`;

    const audio = new Audio(audioUrl);
    const subtitleSrt = await fetch(subtitleUrl).then(r => r.text());
    const subtitles = parseSrt(subtitleSrt);

    return { audio, subtitles };
}
