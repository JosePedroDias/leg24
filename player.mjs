import { parseSrt, serializeSrt, fixSubtitles } from './subtitles.mjs';

export async function player(name) {
    document.title = name;

    const audioUrl = `content/${name}.mp3`;
    const subtitleUrl = `content/${name}.srt`;
    const metadataUrl = `content/${name}.json`;

    const audio = new Audio(audioUrl);
    
    const metadata = await fetch(metadataUrl).then(r => {
        if (r.ok) r.json();
        return {
            bindings: ['moderator', 'A', 'B'],
            speakers: {
                'moderator': { color: 'gray',   subtitles: [] },
                'A':         { color: 'cyan',   subtitles: [] },
                'B':         { color:'magenta', subtitles: [] },
            }
        };
    });

    window.metadata = metadata; // copy(JSON.stringify(window.metadata, null, 2))

    const subtitleSrt0 = await fetch(subtitleUrl).then(r => r.text());
    const subtitleSrt = subtitleSrt0.replaceAll(/\r\n/mg, '\n').replaceAll(/\r/mg, '\n');
    if (subtitleSrt !== subtitleSrt0) console.log('fixed line breaks');
    const subtitles = parseSrt(subtitleSrt);

    if (false) {
        fixSubtitles(subtitles);
        const subtitleSrt2 = serializeSrt(subtitles);
        window.subs = subtitleSrt2; // copy(subs)
    }
    
    return { audio, subtitles, metadata };
}
