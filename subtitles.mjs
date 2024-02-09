
// 00:03:02,100
function parseTime(str) {
    const parts = str.split(/[:,]/);

    const hh = parseInt(parts[0], 10);
    const mm = parseInt(parts[1], 10);
    const ss = parseInt(parts[2], 10);
    const frac = parseFloat('0.' + parts[3]);

    return hh * 3600 + mm * 60 + ss + frac;
}

function machineTime(secs) {
    const hh = Math.floor(secs / 3600); secs -= hh * 3600;
    const mm = Math.floor(secs /   60); secs -= mm *   60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0').replace('.', ',')}`;
}

export function humanTime(secs) {
    const hh = Math.floor(secs / 3600); secs -= hh * 3600;
    const mm = Math.floor(secs /   60); secs -= mm *   60;
    const ss = Math.floor(secs);
    if (hh) return `${hh}:${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
    return `${mm}:${ss.toString().padStart(2, '0')}`;
}

export function parseSrt(str) {
    str = str.replaceAll(/\r\n/mg, '\n').replaceAll(/\r/mg, '\n');
    const lines = str.split('\n');
    const result = [];
    try {
        while (true) {
            let l = lines.shift();
            const srtIndex = parseInt(l, 10); // 1

            l = lines.shift();
            const parts = l.split(' --> '); // 00:00:11,380 --> 00:00:16,620
            const [start, end] = parts.map(parseTime);

            let content = '';
            while (true) {
                l = lines.shift();
                if (!l) break;
                if (!content) content = l;
                else content = content + '\n' + l;
            }

            const o = { start, end, content, srtIndex };
            result.push(o);
        }
    } catch (err) {
        //console.log('err', err);
    }
    return result;
}

export function serializeSrt(subs) {
    fixSubtitles(subs);

    let result = '';
    let li = 0;
    for (const sub of subs) {
        const isLast = li === subs.length - 1;
        result += sub.srtIndex + '\n';
        result += machineTime(sub.start) + ' --> ' + machineTime(sub.end) + '\n';
        result += sub.content + (isLast ? '\n' : '\n\n');
        ++li;
    }
    return result;
}

export function fixSubtitles(subs) {
    let lastSub = {
        srtIndex: 0,
        start: 0,
        end: 0,
        content: '',
    };
    const stats = {
        indexChanges: 0,
        startShifts: 0,
    };
    for (const sub of subs) {
        if (sub.srtIndex !== lastSub.srtIndex + 1) {
            sub.srtIndex = lastSub.srtIndex + 1;
            ++stats.indexChanges;
            //console.log(`fixed #${sub.srtIndex} srtIndex`);
        }
        const gap = sub.start - lastSub.end;
        if (gap < 0) {
            sub.start = lastSub.end;
            ++stats.startShifts;
            //console.log(`moved #${sub.index} start to later`);
        } else if (gap > 0.5) {
            //console.log(`gap #${sub.index} ${gap.toFixed(1)}`);
        }
        if (sub.end - sub.start < 0.2) {
            //console.log(`sub #${sub.index} is too short: ${sub.end - sub.start} "${sub.content}"`);
        }

        lastSub = sub;
    }

    console.log('stats', stats);
}

//////

export function lookForSpeaker(metadata, index) {
    for (const [k, v] of Object.entries(metadata.speakers)) {
        if (v.subtitles.includes(index)) return k;
    }
}

export function setSubtitleSpeaker(metadata, index, name) {
    for (const [k, v] of Object.entries(metadata.speakers)) {
        const foundPos = v.subtitles.indexOf(index);
        if (k === name) {
            if (foundPos === -1) {
                v.subtitles.push(index);
                v.subtitles.sort((a, b) => a - b);
            }
        } else {
            if (foundPos !== -1) {
                v.subtitles.splice(foundPos, 1);
            }
        }
    }
}

export function reassignSpeakerIndices(metadata, fn) {
    for (const [_, v] of Object.entries(metadata.speakers)) {
        v.subtitles = v.subtitles.map(fn).filter(i => i !== -1);
    }
}

export function getSubtitleSpeakerPairs(subtitles, metadata) {
    return subtitles.map((sub) => {
        const speaker = lookForSpeaker(metadata, sub.srtIndex);
        return [sub, speaker];
    });
}
