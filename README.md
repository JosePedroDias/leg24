# TL;DR

I wanted to have transcriptions of the debates and tried to do it myself.

# Calendar

## 5/2
- 21h SIC: [PS - IL](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-05-Debate-entre-o-PS-esgotado-e-a-IL-radical-307dfc33)
- 22h RTP3: [PAN - Chega](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-05-Debate-entre-Chega-e-PAN-clima-mais-quente-com-ataque-e-contra-ataque-4109d8c3)

## 6/2
- 18h RTP3: [PCP - PAN](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-CDU-e-PAN-os-partidos-cordiais-na-luta-pela-sobrevivencia--3aa76a72)
- 20h TVI: [AD - BE](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-Debate-entre-BE-e-PSD-Quem-e-que-sabe-salvar-o-SNS--a252ab7c)
- 22h SICN: [IL - Chega](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-06-Debate-entre-Chega-e-IL-o-Ventura-socialista-e-o-Rui-Rocha-contra-os-pensionistas-f0314e15)

## 7/2

- 18h CNN: [IL - Livre](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-07-Debate-Livre-vs-IL-os-dois-Ruis-o-canalizador-e-o-transformador-b721084e)

## 8/2

- 18h SICN: [BE - Livre](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-08-Debate-BE-vs.-Livre-e-mais-o-que-nos-une-do-que-nos-separa--2fddbf55)

## 9/2

- 18h SICN: [IL - PAN](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-09-Debate-IL-PAN-na-integra-76ed618c)
- 21h RTP:  [PS - Livre]
- 22h CNN:  [Chega - PCP]


## Process

### VLC download stream to file

- save m3u8 stream to file on VLC:
- vlc open network
- first m3u8...
- stream output
- settings
- file ... asd.ts
- MPEG TS

### FFMPEG extract aac stream and convert to mp3

- check it plays: `ffplay vlc-output.ts`
- video to audio without transcoding: `ffmpeg -i vlc-output.ts -vn -acodec copy audio.aac`
- aac to mp3: `ffmpeg -i audio.aac -acodec mp3 audio.mp3`

### transcribe mp3 to srt

- pinokio + whisper webui
- large v3
- portuguese
- mp3 file...

### editing tools

- vscode
- https://www.nikse.dk/subtitleedit/online
