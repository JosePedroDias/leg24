
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

function machineTime(secs) {
    const hh = Math.floor(secs / 3600); secs -= hh * 3600;
    const mm = Math.floor(secs /   60); secs -= mm *   60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}:${secs.toFixed(3).padStart(6, '0').replace('.', ',')}`;
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

function serializeSrt(subs) {
    let result = '';
    for (const sub of subs) {
        result += sub.index + '\n';
        result += machineTime(sub.start) + ' --> ' + machineTime(sub.end) + '\n';
        result += sub.content + '\n\n';
    }
    return result;
}

function fixSubtitles(subs) {
    let lastSub = {
        index: 0,
        start: 0,
        end: 0,
        content: '',
    };
    const stats = {
        indexChanges: 0,
        startShifts: 0,
    };
    for (const sub of subs) {
        if (sub.index !== lastSub.index + 1) {
            sub.index = lastSub.index + 1;
            ++stats.indexChanges;
            //console.log(`fixed #${sub.index} index`);
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
