import { player } from './player.mjs';
import { humanTime, serializeSrt, lookForSpeaker, setSubtitleSpeaker, reassignSpeakerIndices, splitText } from './subtitles.mjs';
import { alertDialog, joinDialog, splitDialog, editDialog, tweakTimesDialog } from './dialogs.mjs';
import { computeStats } from './stats.mjs';

const IS_EDITING = ['127.0.0.1', 'localhost'].includes(location.hostname);

function updateFile(name, ext, content) {
    if (!IS_EDITING) return;
    return fetch(
        `http://${location.hostname}:9091/${name}.${ext}`,
        {
            method: 'POST',
            mode: 'cors',
            body: content,
        }
    );
}

function parseHash() {
    if (!location.hash) return ['', 0];
    let [name, time] = location.hash.slice(1).split('/');
    time = parseFloat(time);
    if (isNaN(time)) time = 0;
    return [name, time];
}

function updateHash(name, time = 0) {
    location.hash = `${name}/${time}`;
}

export function main() {
    const listEl = document.getElementById('list');
    const uiEl = document.getElementById('ui');
    const searchEl = document.getElementById('search');

    const timeEl = document.getElementById('time');
    const durationEl = document.getElementById('duration');
    const togglePlayEl = document.getElementById('toggle-play');
    const toMenuEl = document.getElementById('to-menu');
    const rew15El = document.getElementById('rew-15');
    const ffw15El = document.getElementById('ffw-15');
    const progressEl = document.getElementById('progress');
    const contentEl = document.getElementById('content');

    let subEls, audio, subtitles, metadata;
    let currentSubIndex = -1;

    {
        const name = parseHash()[0];
        if (name) run(name);
    }

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
        const saveSubs = () => updateFile(name, 'srt', serializeSrt(subtitles));
        const saveMeta = () => updateFile(name, 'json', JSON.stringify(metadata, null, 4));
        const saveBoth = () => Promise.all([saveSubs(), saveMeta()]);

        listEl.style.display = 'none';
        searchEl.style.display = 'none';
        uiEl.style.display = 'block';

        if (audio) audio.pause();

        const p = (await player(name));
        ({ audio, subtitles, metadata } = p);

        //audio.playbackRate = 0.8; // optional
        //audio.playbackRate = 1.3; // optional

        const colorizeSub = (divEl) => {
            const index = Number(divEl.dataset.srtIndex);
            const speaker = lookForSpeaker(metadata, index);
            if (speaker) {
                const color = metadata.speakers[speaker].color;
                divEl.style.borderLeft = `4px solid ${color}`;
            } else {
                divEl.style.borderLeft = ``;
            }
        }

        const updateList = () => {
            contentEl.innerHTML = '';
            subEls = [];

            for (const { srtIndex, content } of subtitles) {
                const divEl = document.createElement('div');
                subEls.push(divEl);
                divEl.appendChild(document.createTextNode(content));
                divEl.dataset.srtIndex = srtIndex;
                colorizeSub(divEl);
                contentEl.appendChild(divEl);
            }
        }

        updateList();

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

            updateHash(name, t.toFixed(1));

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

        togglePlayEl.addEventListener('keydown', async (ev) => {
            const sub = subtitles[currentSubIndex];
            let deltaSecs = 0;
            let deltaIndex = 0;
            if      (ev.key === 'ArrowLeft')  deltaSecs = -15;
            else if (ev.key === 'ArrowRight') deltaSecs =  15;
            else if (ev.key === 'ArrowUp')    deltaIndex = -1;
            else if (ev.key === 'ArrowDown')  deltaIndex =  1;
            else if (IS_EDITING && sub && ['j', 's', 'e', 't', 'x', 'f', '1', '2', '3', '§'].includes(ev.key)) {
                if (ev.key === 'j') {
                    audio.pause();
                    const mode = await joinDialog();
                    if (mode === '') { return togglePlayEl.focus();
                    } else if (mode === 'with previous') {
                        const prevSub = subtitles[currentSubIndex - 1];
                        sub.start = prevSub.start;
                        sub.content = prevSub.content + ' ' + sub.content;
                        subtitles.splice(currentSubIndex - 1, 1);
                        --currentSubIndex;
                        
                    } else if (mode === 'with next') {
                        const nextSub = subtitles[currentSubIndex + 1];
                        sub.end = nextSub.end;
                        sub.content = sub.content + ' ' + nextSub.content;
                        subtitles.splice(currentSubIndex + 1, 1);
                    }

                    const decreaseFrom = currentSubIndex;
                    reassignSpeakerIndices(metadata, (idx) => idx > decreaseFrom ? idx - 1 : idx);
                    updateList();
                    saveBoth();
                } else if (ev.key === 's') {
                    const sub = subtitles[currentSubIndex];
                    if (!sub) return togglePlayEl.focus();

                    audio.pause();

                    // preview
                    const ratios = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
                    for (const ratio of ratios) {
                        try {
                            const [a, b] = splitText(sub.content, ratio);
                            console.log(`${ratio}`);
                            console.log(`  [${a}]`);
                            console.log(`  [${b}]`);
                        } catch (_) {}
                    }

                    const result = await splitDialog(ratios);
                    if (result === '') return togglePlayEl.focus();
                    const ratio = parseFloat(result);

                    let content0, content1;
                    try {
                        [content0, content1] = splitText(sub.content, ratio);
                    } catch (err) {
                        return alertDialog(err.message || err);
                    }

                    const tCut = sub.start + ratio * (sub.end - sub.start);
                    const nextSub = {
                        srtIndex: currentSubIndex + 1,
                        start: tCut,
                        end: sub.end,
                        content: content1,
                    }
                    sub.end = tCut;
                    sub.content = content0;
                    subtitles.splice(currentSubIndex + 1, 0, nextSub);

                    const increaseFrom = currentSubIndex;
                    reassignSpeakerIndices(metadata, (idx) => idx > increaseFrom ? idx + 1 : idx);

                    updateList();
                    saveBoth();
                } else if (ev.key === 'e') {
                    audio.pause();
                    const content = await editDialog(sub.content);
                    if (!content) return togglePlayEl.focus();
                    sub.content = content;

                    updateList();
                    saveSubs();
                } else if (ev.key === 't') {
                    audio.pause();
                    await tweakTimesDialog(subtitles, metadata, currentSubIndex, audio);
                    saveSubs();
                } else if (ev.key === 'x') {
                    if (currentSubIndex === -1) return togglePlayEl.focus();
                    subtitles.splice(currentSubIndex, 1);
                    reassignSpeakerIndices(metadata, (idx) => idx >= currentSubIndex ? idx - 1 : idx);
                    updateList();
                    saveBoth();
                } else if (ev.key === 'f') {
                    if (currentSubIndex < 1) return togglePlayEl.focus();
                    const prevSub = subtitles[currentSubIndex - 1];
                    const currSub = subtitles[currentSubIndex];
                    const newSub = {
                        srtIndex: currentSubIndex,
                        start: prevSub.end,
                        end: currSub.start,
                        content: 'TODO',
                    };
                    subtitles.splice(currentSubIndex, 0, newSub);
                    reassignSpeakerIndices(metadata, (idx) => idx >= currentSubIndex ? idx + 1 : idx);
                    updateList();
                    saveBoth();
                } else if (['1', '2', '3', '§'].includes(ev.key)) {
                    if (currentSubIndex === -1) return togglePlayEl.focus();
                    const speaker = metadata.bindings[Number(ev.key) - 1];
                    setSubtitleSpeaker(metadata, currentSubIndex + 1, speaker);
                    colorizeSub(subEls[currentSubIndex]);
                    saveMeta();
                }
            }

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

            togglePlayEl.focus();
        });

        rew15El.addEventListener('click', () => move(-15));
        ffw15El.addEventListener('click', () => move( 15));

        toMenuEl.addEventListener('click', () => location.href = '');

        const t = parseHash()[1];
        if (t) audio.currentTime = t;

        audio.play();
        togglePlayEl.focus();
    }

    return run;
}
