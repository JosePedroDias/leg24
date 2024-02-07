# Reference

- https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
- https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range
- https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView

# Log

## 2a 5 fev
### 21h SIC PS-IL
https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-05-Debate-entre-o-PS-esgotado-e-a-IL-radical-307dfc33
https://videos.impresa.pt/videos/hls/sicnot/2024/02/05/98ae8b49-f04e-4276-b3ee-9e78b9bc999c/video.m3u8

### 22h RTP3 PAN-CHEGA
https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-05-Debate-entre-Chega-e-PAN-clima-mais-quente-com-ataque-e-contra-ataque-4109d8c3
https://videos.impresa.pt/videos/hls/sicnot/2024/02/05/194d1b58-b9bc-49a0-8a02-9bef80690519/video.m3u8

## 3a 6 fev

### 18h RTP3 PCP-PAN
https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-CDU-e-PAN-os-partidos-cordiais-na-luta-pela-sobrevivencia--3aa76a72
https://videos.impresa.pt/videos/hls/sicnot/2024/02/06/f08ee1a3-ecd8-4e12-b9b0-1cbe8ddfedc1/video.m3u8

### 20h? TVI AD-BE
https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-Debate-entre-BE-e-PSD-Quem-e-que-sabe-salvar-o-SNS--a252ab7c
https://videos.impresa.pt/videos/hls/sicnot/2024/02/06/fdef0057-33b9-4e99-9f6e-64239a4fae86/video.m3u8

### 22h SICN IL-CHEGA

https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-Debate-entre-Chega-e-IL-o-Ventura-socialista-e-o-Rui-Rocha-contra-os-pensionistas-f0314e15
https://videos.impresa.pt/videos/hls/sicnot/2024/02/06/fda14f11-2adb-44db-ae95-6840100d5ab1/video.m3u8


## Process


### VLC download stream to file

save m3u8 stream to file on VLC:
vlc open network
first m3u8...
stream output
settings
file ... asd.ts
MPEG TS

### FFMPEG extract aac stream and convert to mp3

check it plays:
ffplay vlc-output.ts

video to audio without transcoding:
ffmpeg -i vlc-output.ts -vn -acodec copy audio.aac

aac to mp3
ffmpeg -i audio.aac -acodec mp3 audio.mp3


### transcribe mp3 to srt

pinokio + whisper webui
large v3
portuguese
mp3 file...
