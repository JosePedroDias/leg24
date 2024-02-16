import { renderVicinityInCanvas } from './render.mjs';
import { machineTime, parseTime } from './subtitles.mjs';

function baseDialog(contentText, populateFn) {
    return new Promise((resolve) => {
        const dialogEl = document.createElement('dialog');
        dialogEl.setAttribute('open', '');

        dialogEl.addEventListener('mousedown', (ev) => ev.stopPropagation());

        const pEl = document.createElement('div');
        pEl.appendChild( document.createTextNode(contentText) );
        dialogEl.appendChild(pEl);

        const onEnd = (result) => {
            window.removeEventListener('keydown', onKeyDown);
            dialogEl.close();
            dialogEl.parentNode?.removeChild(dialogEl);
            resolve(result);
        }

        const onKeyDown = (ev) => {
            const key = ev.key;
            if (key === 'Escape') onEnd('');
        };

        window.addEventListener('keydown', onKeyDown);

        document.body.appendChild(dialogEl);

        populateFn(dialogEl, onEnd);

        const o = dialogEl.getBoundingClientRect();
        dialogEl.style.marginLeft = `-${o.width  / 2}px`;
        dialogEl.style.marginTop  = `-${o.height / 2}px`;
    });
}

export function alertDialog(contentText, buttonLabels = ['ok']) {
    return baseDialog(contentText, (dialogEl, onEnd) => {
        let firstButtonEl;
        for (const buttonLabel of buttonLabels) {
            const buttonEl = document.createElement('button');
            if (!firstButtonEl) firstButtonEl = buttonEl;
            buttonEl.type = 'button';
            buttonEl.appendChild( document.createTextNode(buttonLabel) );
            buttonEl.addEventListener('click', () => onEnd(buttonLabel));
            dialogEl.appendChild(buttonEl);
        }
        firstButtonEl?.focus();
    });
}

function promptDialog(contentText, initialValue = '', dialogClass) {
    return baseDialog(contentText, (dialogEl, onEnd) => {
        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.style.width = '80dvw';
        inputEl.value = initialValue;
        dialogEl.appendChild(inputEl);

        inputEl.addEventListener('keyup', () => {
            inputEl.value = inputEl.value.substring(0, inputEl.value.length - 1);
        }, {once: true});

        inputEl.addEventListener('keydown', (ev) => {
            if (ev.key !== 'Enter') return;
            ev.preventDefault();
            ev.stopPropagation();
            onEnd(inputEl.value);
        });

        inputEl.focus();
    });
}

export function editDialog(initialValue) {
    return promptDialog('edit', initialValue);
}

export function joinDialog() {
    return alertDialog('join', ['with previous', 'with next']);
}

export function splitDialog(ratios) {
    return alertDialog('split', ratios.map(r => r.toFixed(1)));
}

export function tweakTimesDialog(subtitles, metadata, currentSubIndex, audio) {
    return baseDialog('tweak subtitle timings', (dialogEl, onEnd) => {
        const W = 800;
        const H = 60;

        const canvasEl = document.createElement('canvas');
        canvasEl.setAttribute('width', W);
        canvasEl.setAttribute('height', H);
        dialogEl.appendChild(canvasEl);
        const ctx = canvasEl.getContext('2d');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `9px 'Arial Narrow',sans-serif`;
        const inputEls = [];

        const sub3 = [undefined, undefined, undefined];
        const references = [
            [sub3[0], 'end'],
            [sub3[1], 'start'],
            [sub3[1], 'end'],
            [sub3[2], 'start'],
        ];

        const updateSubTrio = () => {
            const s0 = subtitles[currentSubIndex - 1] || { content: 'STUB START', start: -1, end: 0 };
            const s1 = subtitles[currentSubIndex    ];
            const s2 = subtitles[currentSubIndex + 1] || { content: 'STUB END', start: audio.duration, end: audio.duration + 1 };
            sub3[0] = s0;
            sub3[1] = s1;
            sub3[2] = s2;
            references[0][0] = s0;
            references[1][0] = s1;
            references[2][0] = s1;
            references[3][0] = s2;
        }
        updateSubTrio();

        const deltaT = 4;

        const refresh = () => {
            renderVicinityInCanvas(ctx, [W, H], subtitles, metadata, audio.currentTime, deltaT);
        };
        refresh();

        references.forEach(([s, attr]) => {
            const inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = machineTime(s[attr]);
            dialogEl.appendChild(inputEl);
            inputEls.push(inputEl);
            inputEl.addEventListener('change', () => {
                s[attr] = parseTime(inputEl.value);
                refresh();
            });
        });

        const updateLabels = () => {
            let i = 0;
            for (const [s, attr] of references) {
                const el = inputEls[i];
                el.value = machineTime(s[attr]);
                ++i;
            }
        }

        const onTimeUpdate = () => {
            const t = audio.currentTime;
            refresh();
            const [_, s1, __] = sub3;
            if (t < s1.start || t > s1.end) {
                const newIndex = subtitles.findIndex((s) => s && t >= s.start && t <= s.end);
                if (newIndex !== -1 && newIndex !== currentSubIndex) {
                    currentSubIndex = newIndex;
                    updateSubTrio();
                    updateLabels();
                }
            }
        }
        audio.addEventListener('timeupdate', onTimeUpdate);

        for (const label of ['play', 'done']) {
            const buttonEl = document.createElement('button');
            buttonEl.appendChild(document.createTextNode(label));
            dialogEl.appendChild(buttonEl);
            buttonEl.addEventListener('click', () => {
                if (label === 'play') {
                    if (audio.paused) audio.play();
                    else audio.pause();
                } else {
                    audio.removeEventListener('timeupdate', onTimeUpdate);
                    onEnd();
                }
            });
        }
    });
}
