export function parseYyyyMmDd(dateS) {
    const [year, month, day] = dateS.split('-').map(parseFloat);
    const d = new Date(year, month - 1, day);
    return {
        year,
        month,
        day,
        dayOfWeek: d.getDay()
    };
}

export const monthsPt = [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
];

export const daysOfWeekPt = [
    'dom',
    'seg',
    'ter',
    'qua',
    'qui',
    'sex',
    'sáb',
];
