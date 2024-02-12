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
- 21h RTP:  [PS - Livre](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-09-Debate-PS-vs.-Livre-o-apelo-ao-voto-util-e-a-vontade-da-maioria-a-esquerda-bc29de53)
- 22h CNN:  [Chega - PCP](https://sicnoticias.pt/especiais/eleicoes-legislativas/debates/2024-02-09-Debate-CDU-vs-Chega-uma-viagem-a-Troika-e-ao-PREC-1611faa1)


## 10/2

- 20.30 RTP1 [PSD - PCP](https://sicnoticias.pt/podcasts/legislativas-2024/2024-02-10-Luis-Montenegro-vs-Paulo-Raimundo-ouca-aqui-o-debate-entre-os-lideres-do-PSD-e-do-PCP-0a71e3a6)
- 21h   TVI  [PS - PAN](https://sicnoticias.pt/podcasts/legislativas-2024/2024-02-10-Pedro-Nuno-Santos-vs-Ines-Sousa-Real-ouca-aqui-o-debate-entre-os-lideres-do-PS-e-do-PAN-2f13f3a0)

## 11/2

- 21h SIC  [PSD - PAN](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-11-Debate-na-integra-entre-AD-e-PAN-3fc877a6)
- 22h SICN [BE - PCP](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-11-Debate-na-integra-entre-Mariana-Mortagua-e-Paulo-Raimundo-c97cfe26)

## 12/2

- 21h RTP [PSD - Chega](https://sicnoticias.pt/especiais/eleicoes-legislativas/debates/2024-02-12-Debate-AD-vs-Chega-o-idiota-util-da-esquerda-e-o-xenofobo-demagogo-991381b9)

## 13/2

- 18h [PCP - Livre]
- 22h [Chega - BE]

# Process

## simpler audio-only grab from podcast

PODCAST PROCESS

wget "url" -O 1.mp3
ffmpeg -i 1.mp3 -map 0:a -c:a copy -map_metadata -1 2.mp3
ffmpeg -i 2.mp3 -ss 35 -vcodec copy -acodec copy 3.mp3

## video stream grab w/ VLC + FFMPEG to extract aac stream and convert to mp3

- save m3u8 stream to file on VLC:
- vlc open network
- first m3u8...
- stream output
- settings
- file ... asd.ts
- MPEG TS

- video to audio without transcoding: `ffmpeg -i vlc-output.ts -vn -acodec copy audio.aac`
- aac to mp3: `ffmpeg -i audio.aac -acodec mp3 audio.mp3`

## transcribe mp3 to srt

- pinokio + whisper webui
- large v3
- portuguese
- mp3 file...
