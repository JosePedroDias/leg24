import { player } from './player.mjs';
import { humanTime } from './subtitles.mjs';

export function main() {
    const listEl = document.getElementById('list');
    const uiEl = document.getElementById('ui');

    const timeEl = document.getElementById('time');
    const durationEl = document.getElementById('duration');
    const togglePlayEl = document.getElementById('toggle-play');
    const rew15El = document.getElementById('rew-15');
    const ffw15El = document.getElementById('ffw-15');
    const progressEl = document.getElementById('progress');
    const contentEl = document.getElementById('content');

    let subEls, audio, subtitles, currentSubIndex;
    currentSubIndex = -1;

    const highlightSub = (idx) => {
        subEls.forEach((subEl, i) => subEl.classList.toggle('highlight', i === idx));
        subEls[idx]?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
    }

    const onClickContentEl = (el) => {
        const idx = subEls.indexOf(el);
        const sub = subtitles[idx];
        if (!sub) return;
        currentSubIndex = idx;
        audio.currentTime = sub.start;
        highlightSub(currentSubIndex);
        if (audio.paused) audio.play();
        togglePlayEl.focus();
    }

    contentEl.addEventListener('click', (ev) => onClickContentEl(ev.target));

    async function run(name) {
        listEl.style.display = 'none';
        uiEl.style.display = 'block';

        if (audio) audio.pause();

        const p = (await player('content/' + name));
        ({ audio, subtitles } = p);

        //console.log(subtitles)

        contentEl.innerHTML = '';
        subEls = [];

        for (const { content } of subtitles) {
            const divEl = document.createElement('div');
            divEl.appendChild(document.createTextNode(content));
            contentEl.appendChild(divEl);
            subEls.push(divEl);
        }

        const onDuration = () => {
            const d = audio.duration;
            durationEl.innerHTML = humanTime(d);
            progressEl.max = Math.ceil(d);
        }

        const move = (deltaSecs) => {
            audio.currentTime = audio.currentTime + deltaSecs;
            if (audio.paused) audio.play();
            togglePlayEl.focus();
        }

        if (audio.duration) onDuration();
        audio.addEventListener('loadedmetadata', onDuration);
        audio.addEventListener('timeupdate', () => {
            const t = audio.currentTime;
            const ti = Math.round(t);
            const ts = humanTime(ti);
            if (timeEl.innerHTML != ts) timeEl.innerHTML = ts;
            if (ti != progressEl.value) progressEl.value = ti;

            const sub = subtitles[currentSubIndex];
            if (!sub || t < sub.start || t > sub.end) {
                const newIndex = subtitles.findIndex((s) => s && t >= s.start && t <= s.end);
                if (newIndex !== -1) {
                    currentSubIndex = newIndex;
                    highlightSub(currentSubIndex);
                }
            }
        });

        progressEl.addEventListener('change', () => {
            audio.currentTime = progressEl.value;
            togglePlayEl.focus();
        });

        togglePlayEl.addEventListener('click', () => {
            audio.paused ? audio.play() : audio.pause();
        });

        togglePlayEl.addEventListener('keydown', (ev) => {
            let deltaSecs = 0;
            let deltaIndex = 0;
            if      (ev.key === 'ArrowLeft')  deltaSecs = -15;
            else if (ev.key === 'ArrowRight') deltaSecs =  15;
            else if (ev.key === 'ArrowUp')    deltaIndex = -1;
            else if (ev.key === 'ArrowDown')  deltaIndex =  1;

            if (deltaSecs || deltaIndex) {
                ev.preventDefault();
                ev.stopPropagation();
                if (deltaSecs) {
                    move(deltaSecs);
                } else {
                    const el = subEls[currentSubIndex + deltaIndex];
                    if (el) onClickContentEl(el);
                }
            }
        });

        rew15El.addEventListener('click', () => move(-15));
        ffw15El.addEventListener('click', () => move( 15));

        audio.play();
        togglePlayEl.focus();
    }

    return run;
}
