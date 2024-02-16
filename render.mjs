import { lookForSpeaker } from './subtitles.mjs';

export function renderToSvg(subs, meta) {

}

export function renderVicinityInCanvas(ctx, [W, H], subs, metadata, t, deltaT) {
    const tScale = W / deltaT;
    const t0 = t - deltaT * 0.5;
    const t1 = t + deltaT * 0.5;

    ctx.clearRect(0, 0, W, H);

    for (const [_i, s] of Object.entries(subs)) {
        const i = parseInt(_i, 10) + 1;

        if (s.end < t0) continue;
        if (s.start > t1) continue;

        const j = i % 3;

        let barColor = 'blue';
        const speaker = lookForSpeaker(metadata, i);
        if (speaker) {
            barColor = metadata.speakers[speaker].color;
        }

        const x0 = (s.start - t0) * tScale;
        const w = (s.end - s.start) * tScale;

        const h = H / 3;
        const y0 = h * j;
        ctx.fillStyle = barColor;
        ctx.fillRect(x0, y0, w, h);

        const chars = s.content.split('');
        const charsLen = chars.length;
        const charW = w / charsLen;
        const fSize = Math.min(Math.round(charW * 1.6), h);

        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'white';
        ctx.font = `${fSize}px 'Arial Narrow',sans-serif`;
        ctx.lineWidth = fSize * 0.1;
        for (let k = 0; k < charsLen; ++k) {
            ctx.strokeText(chars[k], x0 + (k + 0.5) * charW, y0 + h/2);
            ctx.fillText(chars[k], x0 + (k + 0.5) * charW, y0 + h/2);
        }
    }
    
    ctx.fillStyle = 'red';
    ctx.fillRect(W/2, 0, 1, H);
}
