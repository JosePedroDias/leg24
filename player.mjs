import { parseSrt, serializeSrt, fixSubtitles } from './subtitles.mjs';

export async function player(name) {
    document.title = name;

    const audioUrl = `content/${name}.mp3`;
    const subtitleUrl = `content/${name}.srt`;
    const metadataUrl = `content/${name}.json`;

    const audio = new Audio(audioUrl);
    
    const metadata = await fetch(metadataUrl).then(r => {
        if (r.ok) return r.json();
        return {
            bindings: ['moderator', 'A', 'B'],
            speakers: {
                'moderator': { color: 'gray',   subtitles: [] },
                'A':         { color: 'cyan',   subtitles: [] },
                'B':         { color:'magenta', subtitles: [] },
            }
        };
    });

    const subtitleSrt = await fetch(subtitleUrl).then(r => r.text());
    const subtitles = parseSrt(subtitleSrt);
    
    return { audio, subtitles, metadata };
}
