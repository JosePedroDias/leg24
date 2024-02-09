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

export function splitDialog() {
    return alertDialog('split', ['0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8']);
}

export function tweakTimesDialog(subtitles, currentSubIndex, audio) {
    return baseDialog('tweak subtitle timings', (dialogEl, onEnd) => {
        const W = 400;
        const H = 60;

        const canvasEl = document.createElement('canvas');
        canvasEl.setAttribute('width', W);
        canvasEl.setAttribute('height', H);
        dialogEl.appendChild(canvasEl);
        const ctx = canvasEl.getContext('2d');
        const inputsEls = [];

        const s0 = subtitles[currentSubIndex - 1];
        const s1 = subtitles[currentSubIndex    ];
        const s2 = subtitles[currentSubIndex + 1];
        const sub3 = [s0, s1, s2];

        const references = [
            [s0, 'end'],
            [s1, 'start'],
            [s1, 'end'],
            [s2, 'start'],
        ];

        let t0, t1, dur, scale;

        const refresh = () => {
            t0 = s0.end - 1;
            t1 = s2.start + 1;
            dur = t1 - t0;
            scale = W / dur;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = 'blue';
            for (let i = 0; i < 3; ++i) {
                const s = sub3[i];
                const x0 = (s.start - t0) * scale;
                const w = (s.end - s.start) * scale;
                const h = H / 3;
                const y0 = i * h;
                ctx.fillRect(x0, y0, w, h);
            }
        };
        refresh();

        for (const s of sub3) {
            const pEl = document.createElement('p');
            pEl.appendChild(document.createTextNode(s.content));
            dialogEl.appendChild(pEl);
        }

        references.forEach(([s, attr]) => {
            const inputEl = document.createElement('input');
            inputEl.type = 'text';
            inputEl.value = s[attr];
            dialogEl.appendChild(inputEl);
            inputsEls.push[inputEl];
            inputEl.addEventListener('change', () => {
                s[attr] = parseFloat(inputEl.value);
                refresh();
            });
        });

        audio.addEventListener('timeupdate', () => {
            const t = audio.currentTime;
            refresh();
            const x = (t - t0) * scale;
            ctx.fillStyle = 'red';
            ctx.fillRect(x, 0, 1, H);
            if (t >= t1) audio.pause();
        });

        for (const label of ['play', 'done']) {
            const buttonEl = document.createElement('button');
            buttonEl.appendChild(document.createTextNode(label));
            dialogEl.appendChild(buttonEl);
            buttonEl.addEventListener('click', () => {
                if (label === 'play') {
                    if (audio.paused) {
                        audio.currentTime = t0;
                        audio.play();
                    } else {
                        audio.pause();
                    }
                } else {
                    onEnd();
                }
                
            });
        }
    });
}
