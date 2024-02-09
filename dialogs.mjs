function alertDialog(contentText, buttonLabels = ['ok'], dialogClass) {
    return new Promise((resolve) => {
        const dialogEl = document.createElement('dialog');
        dialogEl.className = dialogClass || 'default';
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

        let firstButtonEl;
        for (const buttonLabel of buttonLabels) {
            const buttonEl = document.createElement('button');
            if (!firstButtonEl) firstButtonEl = buttonEl;
            buttonEl.type = 'button';
            buttonEl.appendChild( document.createTextNode(buttonLabel) );
            buttonEl.addEventListener('click', () => onEnd(buttonLabel));
            dialogEl.appendChild(buttonEl);
        }

        const onKeyDown = (ev) => {
            const key = ev.key;
            if (key === 'Escape') onEnd('');
        };

        window.addEventListener('keydown', onKeyDown);

        document.body.appendChild(dialogEl);

        firstButtonEl?.focus();

        const o = dialogEl.getBoundingClientRect();
        dialogEl.style.marginLeft = `-${o.width  / 2}px`;
        dialogEl.style.marginTop  = `-${o.height / 2}px`;
    });
}

function promptDialog(contentText, initialValue = '', dialogClass) {
    return new Promise((resolve) => {
        const dialogEl = document.createElement('dialog');
        dialogEl.className = dialogClass || 'default';
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

        const inputEl = document.createElement('input');
        inputEl.type = 'text';
        inputEl.style.width = '80dvw';
        inputEl.value = initialValue;
        dialogEl.appendChild(inputEl);

        const onKeyDown = (ev) => {
            const key = ev.key;
            if (key === 'Escape') onEnd('');
        };

        window.addEventListener('keydown', onKeyDown);

        inputEl.addEventListener('keyup', () => {
            inputEl.value = inputEl.value.substring(0, inputEl.value.length - 1);
        }, {once: true});

        inputEl.addEventListener('keydown', (ev) => {
            if (ev.key !== 'Enter') return;
            ev.preventDefault();
            ev.stopPropagation();
            onEnd(inputEl.value);
        });

        document.body.appendChild(dialogEl);

        inputEl.focus();

        const o = dialogEl.getBoundingClientRect();
        dialogEl.style.marginLeft = `-${o.width  / 2}px`;
        dialogEl.style.marginTop  = `-${o.height / 2}px`;
    });
}

export function editDialog(initialValue) {
    return promptDialog('edit', initialValue);
}

export function joinDialog() {
    return alertDialog('join', ['with previous', 'with next']);
}

export function splitDialog() {
    return alertDialog('split', ['0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9']);
}
