export const MONTH_NAMES = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
]

export const DAY_NAMES = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
];

export const OFFSET_NAMES: {[key: string]: string} = {
    '-7': "неделю назад",
    '-2': "позавчера",
    '-1': "вчера",
    '0': "сегодня",
    '1': "завтра",
    '2': "послезавтра",
};


export function nameOffset(index: number) {
    const str = index.toString();

    if (str in OFFSET_NAMES) {
        return OFFSET_NAMES[str];
    }

    if (index > 0) {
        index -= 1
    }

    if (Math.abs(index) < 5) {
        if (index > 0) {
            return "через " + index + " дня";
        } else {
            return -index + " дня назад";
        }
    }
    if (index > 0) {
        return "через " + index + " дней";
    } else {
        return -index + " дней назад";
    }
}

