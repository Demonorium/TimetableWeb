
export const MILLISECOND = 1;
export const SECOND = 1000*MILLISECOND;
export const MINUTE = SECOND*60;
export const HOUR = MINUTE*60;
export const DAY = HOUR*24;
export const WEEK = DAY*7;
//Фиктивное значение, нужное для записи и извлечения
export const MONTH_OF_YEAR = WEEK*4;
export const NORMAL_YEAR = 365*DAY;
export const YEAR = NORMAL_YEAR;

export const LEAP_YEAR = 366*DAY;

const SIZES_LIST = [YEAR, MONTH_OF_YEAR, DAY, HOUR, MINUTE, SECOND, MILLISECOND]

export const NORMAL_MONTHS = [
    31, 28,
    31, 30, 31,
    30, 31, 31,
    30, 31, 30,
    31]
export const LEAP_MONTHS = [
    31, 29,
    31, 30, 31,
    30, 31, 31,
    30, 31, 30,
    31]

function makeDayCountList(months: Array<number>): Array<number> {
    let list: Array<number> = [0,0,0, 0,0,0, 0,0,0, 0,0,0]
    for (let i = 1; i < 12; ++i) {
        list[i] = list[i-1] + months[i-1]
    }
    return list;
}

//Количество дней до первого дня указанного месяца
const monthsAccumulationNormal = makeDayCountList(NORMAL_MONTHS);
//Количество дней до первого дня указанного месяца високосного года
const monthsAccumulationLeap = makeDayCountList(LEAP_MONTHS);

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
    '7': "через неделю"
};


export function nameOffset(index: number) {
    const str = index.toString();

    if (str in OFFSET_NAMES) {
        return OFFSET_NAMES[str];
    }
    if (Math.abs(index) < 5) {
        if (index > 0)
            return "через " + index + " дня";
        else
            return -index + " дня назад";
    }
    if (index > 0)
        return "через " + index + " дней";
    else
        return -index + " дней назад";
}


export function isLeapYear(year: number): boolean {
    if ((year % 4) == 0)
        if ((year % 400) == 0)
            return true;
        else return (year % 100) != 0;
    else
        return false
}

export function getYearTime(year: number): number {
    if (isLeapYear(year)) {
        return LEAP_YEAR;
    } else {
        return NORMAL_YEAR;
    }
}

export function month(num: number, year: number): number {
    if (isLeapYear(year)) {
        return LEAP_MONTHS[num];
    } else {
        return NORMAL_MONTHS[num];
    }
}

export function dayOfYear(dayOfMonth: number, monthOfYear: number, year: number): number {
    if (isLeapYear(year)) {
        return monthsAccumulationLeap[monthOfYear] + dayOfMonth;
    } else {
        return monthsAccumulationNormal[monthOfYear] + dayOfMonth;
    }
}

export class SimpleCalendar {
    date: Date;

    constructor(date?: Date) {
        if (date == null)
            this.date = new Date();
        else
            this.date = date;
    }

    add(count: number, type: number) {
        return new SimpleCalendar(new Date(this.date.getTime() + count*type));
    }
    get(type: number): number {
        switch (type) {
            case MILLISECOND:
                return this.date.getMilliseconds();
            case SECOND:
                return this.date.getSeconds();
            case MINUTE:
                return this.date.getMinutes();
            case HOUR:
                return this.date.getHours();
            case DAY:
                return this.date.getDate();
            case WEEK:
                return Math.floor(dayOfYear(this.date.getDay(), this.date.getMonth(), this.date.getFullYear()) / 7);
            case MONTH_OF_YEAR:
                return this.date.getMonth();
            case YEAR:
                return this.date.getFullYear();
            default:
                throw new Error("Unknown type with code: " + type);
        }
    }

    getValueOf(valueType: number, type?: number) {
        if (type == null)
            return this.get(valueType);

        if (valueType > type)
            throw new Error("Request is greater then container type (request look like 'year of day')");
        if (valueType == type)
            return 1;


        if ((valueType == MONTH_OF_YEAR)) {
            if (type == YEAR) {
                this.get(valueType);
            } else {
                throw new Error("Unknown use of type 'monthOfYear'");
            }
        }
        if ((valueType == WEEK)) {
            if (type == YEAR)
                return this.get(WEEK);
        }
        if ((type == YEAR) && (valueType == DAY)) {
            return dayOfYear(this.get(DAY), this.get(MONTH_OF_YEAR), this.get(YEAR));
        }
        let count: number;
        if (type == MONTH_OF_YEAR) {
            count = month(this.date.getMonth(), this.date.getFullYear());
        } else if (type == WEEK) {
            count = this.date.getDay()*DAY;
            return Math.floor( count / valueType);
        } else {
            count = type;
        }

        for (let i = 0; i < SIZES_LIST.length; ++i) {
            if (SIZES_LIST[i] <= valueType) {
                break;
            } else if (SIZES_LIST[i] < type) {
                if (SIZES_LIST[i] == MONTH_OF_YEAR) {
                    count += dayOfYear(0, this.get(SIZES_LIST[i]), this.date.getFullYear())*DAY;
                    ++i;
                } else {
                    count += this.get(SIZES_LIST[i]) * SIZES_LIST[i];
                }
            }
        }

        return Math.floor( count / valueType);
    }
}