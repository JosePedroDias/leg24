import { humanTime, parseSrt } from './subtitles.mjs';
import { computeStats } from './stats.mjs';

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

async function computeGlobalWordSearch() {
    const debates = await fetch('./content/index.json').then(r => r.json());

    const wordOccurrences = new Map();

    for (const name of debates) {
        const metadata = await fetch(`content/${name}.json`).then(r => r.json());

        const subtitleSrt = await fetch(`content/${name}.srt`).then(r => r.text());
        const subtitles = parseSrt(subtitleSrt);

        const stats = computeStats(subtitles, metadata);

        for (const [w, occurrences] of stats.wordOccurrences) {
            const prevOccurrences = wordOccurrences.get(w) || [];
            const newOccurrences = occurrences.map(([t, speaker]) => [name, t, speaker]);
            const updatedOccurrences = [...prevOccurrences, ...newOccurrences];
            wordOccurrences.set(w, updatedOccurrences);
        }
    }

    return { wordOccurrences, debates };
}

function partialMatch(word, words) {
    return words.filter((w) => w.includes(word));
}

function plural(word, count, suffix = 's') {
    return `${word}${count === 1 ? '' : suffix}`;
}

function fillSelect(selectEl, options) {
    selectEl.innerHTML = '';
    for (const option of options) {
        const el = document.createElement('option');
        el.value = option;
        el.appendChild(document.createTextNode(option));
        selectEl.appendChild(el);
    }
}

const MAX_VISIBLE_RESULTS = 200;
const ALL = '-todos-';

export async function search() {
    const listEl = document.getElementById('list');
    const searchEl = document.getElementById('search');
    const searchInputEl = document.getElementById('search-input');
    const searchExactWordEl = document.getElementById('search-exact-word');
    const searchSpeakerEl = document.getElementById('search-speaker');
    const searchDebateEl = document.getElementById('search-debate');
    const searchResultsCountEl = document.getElementById('search-results-count');
    const searchResultsEl = document.getElementById('search-results');

    const { wordOccurrences: wo, debates } = await computeGlobalWordSearch();
    const words = Array.from(wo.keys());
    let speakers = new Set();
    for (const values of wo.values()) {
        for (const [_, __, speaker] of values) {
            speaker && speakers.add(speaker);
        }   
    }
    speakers = Array.from(speakers);

    debates.sort();
    debates.unshift(ALL);
    speakers.sort();
    speakers.unshift(ALL);

    fillSelect(searchDebateEl, debates);
    fillSelect(searchSpeakerEl, speakers);

    searchEl.style.display = '';

    const updateResults = () => {
        listEl.style.display = 'none';
        searchResultsEl.innerHTML = '';
        const w = searchInputEl.value.toLowerCase();
        const isExact = searchExactWordEl.checked;
        const desiredSpeaker = searchSpeakerEl.value;
        const filterSpeaker = desiredSpeaker !== ALL;
        const desiredDebate = searchDebateEl.value;
        const filterDebate = desiredDebate !== ALL;

        if (w.length < 2) {
            searchResultsCountEl.innerHTML = '';
            return;
        }

        let hits;
        if (isExact) {
            hits = wo.get(w) || [];
        } else {
            hits = partialMatch(w, words).reduce((prev, curr) => {
                return [...prev, ...(wo.get(curr).map(arr => [...arr, curr]) || [])];
            }, []);
        }

        let renderedCount = 0;
        let availableCount = 0;

        for (const [name, time, speaker, _word] of hits) {
            if (filterDebate && desiredDebate !== name) continue;
            if (filterSpeaker && desiredSpeaker !== speaker) continue;

            ++availableCount;

            if (renderedCount >= MAX_VISIBLE_RESULTS) continue;
            ++renderedCount;

            const [_, title] = name.split('_');

            const resultEl = document.createElement('p');
            const aEl = document.createElement('a');
            const url = `./?r=${Date.now() % 10000}#${name}/${time}`;
            aEl.href = url;
            let label = `${humanTime(time)}`;
            if (!filterDebate) label += ` no debate ${title}`;
            if (!filterSpeaker) label = `${speaker} ao ` + label;
            if (_word) label = `'${_word}' ` + label;
            aEl.appendChild(document.createTextNode(label));
            resultEl.appendChild(aEl);
            searchResultsEl.appendChild(resultEl);
        }

        searchResultsCountEl.innerHTML = `${plural('Existe', availableCount, 'm')} ${availableCount} ${plural('resultado', availableCount)}. A mostrar ${renderedCount}.`
    };
    const debounceUpdateResults = debounce(updateResults, 200);

    function setupEvents(unset) {
        const fn = unset ? 'removeEventListener' : 'addEventListener';
        searchInputEl[fn]('keyup', debounceUpdateResults);
        searchExactWordEl[fn]('change', debounceUpdateResults);
        searchSpeakerEl[fn]('change', debounceUpdateResults);
        searchDebateEl[fn]('change', debounceUpdateResults);
    }

    setupEvents(false);
}
