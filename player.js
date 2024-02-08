async function player(name) {
    const audioUrl = `${name}.mp3`;
    const subtitleUrl = `${name}.srt`;

    const audio = new Audio(audioUrl);
    const subtitleSrt0 = await fetch(subtitleUrl).then(r => r.text());
    const subtitleSrt = subtitleSrt0.replaceAll(/\r\n/mg, '\n').replaceAll(/\r/mg, '\n');
    if (subtitleSrt !== subtitleSrt0) console.log('fixed line breaks');
    const subtitles = parseSrt(subtitleSrt);

    if (false) {
        fixSubtitles(subtitles);
        const subtitleSrt2 = serializeSrt(subtitles);
        window.subs = subtitleSrt2; // copy(subs)
    }
    
    return { audio, subtitles };
}
