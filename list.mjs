import { daysOfWeekPt, monthsPt, parseYyyyMmDd } from './date.mjs';

export async function populateList(run) {
    const debates = await fetch('./content/index.json').then(r => r.json());

    const dates = [];
    let lastItem;
    for (const debate of debates) {
        const [date, name] = debate.split('_');
        if (lastItem && lastItem.date === date) {
            lastItem.items.push(name);
        } else {
            lastItem && dates.push(lastItem);
            lastItem = { date, items: [name] };
        }
    }
    dates.push(lastItem);

    const listEl = document.getElementById('list');
    listEl.innerHTML = '';

    const unrevised = ['sem-assento'];

    for (const { date, items } of dates) {
        const dayUl = document.createElement('ul');
        const { dayOfWeek, day, month } = parseYyyyMmDd(date);
        const spanEl = document.createElement('span');
        spanEl.appendChild(document.createTextNode(`${daysOfWeekPt[dayOfWeek]}, ${day} ${monthsPt[month - 1]}`));
        dayUl.appendChild(spanEl);
        const dayItemsUl = document.createElement('ul');
        dayUl.appendChild(dayItemsUl);
        for (const item of items) {
            const itemLiEl = document.createElement('li');
            const buttonEl = document.createElement('button');
            if (unrevised.includes(item)) {
                buttonEl.title = 'por rever';
                buttonEl.classList.add('pending-review');
            }
            buttonEl.appendChild(document.createTextNode(item));
            buttonEl.dataset.debate = `${date}_${item}`;
            itemLiEl.appendChild(buttonEl);
            dayItemsUl.appendChild(itemLiEl);
        }
        listEl.appendChild(dayUl);
    }

    listEl.addEventListener('click', (ev) => {
        const el = ev.target;
        if (el.dataset?.debate) run(el.dataset.debate);
    });
}
