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

- 18h CNN  [PCP - Livre](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-13-Debate-CDU-vs-Livre-o-pela-paz-e-o-europeista-e62971dc)
- 22h RTP3 [Chega - BE](https://sicnoticias.pt/especiais/eleicoes-legislativas/2024-02-13-Debate-BE-vs-Chega-vistos-gold-terroristas-imigracao-e-corrupcao--ate-Robles-voltou--6d3e1883)

## 14/2

- 18h RTP3 [Livre - PAN](https://sicnoticias.pt/especiais/eleicoes-legislativas/debates/2024-02-14-Debate-Livre-vs-PAN-a-ode-do-voto--in-util-a530565a)
- 21h TVI  [PS - Chega](https://sicnoticias.pt/especiais/eleicoes-legislativas/debates/2024-02-14-Debate-PS-vs-Chega-a-amnesia-de-Pedro-Nuno-e-a-cobardia-de-Ventura-d70a4fde)
- 22h RTP3 [IL - PCP](https://sicnoticias.pt/especiais/eleicoes-legislativas/debates/2024-02-14-Debate-CDU-vs-IL-os-dois-opostos-atraem-se-mas-so-num-tema-8b641f3b)

## 15/2

- 18h CNN [IL - BE]()

## 16/2

- 20.30 RTP3 [PS - BE]
- 21h   TVI  [PSD - IL]
- 22h   RTP3 [Chega - Livre]

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

# navigation key bindings

- `space` - toggle playback
- `up/down` - move to previous/next subtitle
- `left/right` - review/fast forward by 15 seconds

# onboarding new debates and editing text and speaker tags

For each new debate (an mp3 file), we expect 2 additional files to be created:
- a subtitles file (srt), which initially comes from running whisper over the mp3
- a json file listing the speakers and which subtitles indices belong to each speaker
the index.json needs to updated to also list the name of this new debate (used in the search features of the main page)

When the site is running locally for editing purposes,
`node server.mjs` should also be running. It changes the file system debate files according to the operations defined in the front end.

There's a set of key bindings for manipulating SRT and JSON files in tandem:
- `j`oins the current subtitle with either its previous or next one
- `s`plits the current subtitle by a ratio into 2 new ones
- `e`dits the current subtitle's text content
- `t`ime tweaks the start and end placements for the current subtitle and its neighbors
- `x` deletes the current subtitle
- `f` fills the space between the previous subtitle and the current one with a new subtitle

- `1` assigns the moderator role to the current subtitle (typically gray)
- `2` assigns the 1st debater role to the current subtitle (typically cyan)
- `3` assigns the 2nd debater role to the current subtitle (typically magenta)
- `§` (before 1, on mac) clears any speaker role from the current subtitle
