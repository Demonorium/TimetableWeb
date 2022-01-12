import React from 'react';
import {List} from "@mui/material";
import {DAY_NAMES, nameOffset} from "../../utils/time";
import {connect} from "react-redux";
import Day, {DayProps, InternalDayRepresentation, LessonDur, LessonPair} from "./Day";
import {RootState} from "../../store/store";
import RangeObject from "../../utils/range";
import {Changes, Day as dbDay, ScheduleElement, SourcePriority, User, Week, WeekDay} from "../../database";
import axios from "axios";
import {ScheduleState} from "../../store/schedule";
import {PrioritiesState} from "../../store/priorities";
import getComponentInfo, {Scrolls} from "../../utils/componentInfo";
import dayjs, {Dayjs} from "dayjs";
import {addElement, arrayEq, containsElement, findElement} from "../../utils/arrayUtils";
import {InternalRepresentationState} from "../../store/sourceMap";

/**
 * Данные хранит описание дня, может загружать его с сервера
 */
class DayState {
    index: number;

    date: string;
    dayOfWeek: string;
    dateOffset: string;
    ref?: any;

    downloadedState?: InternalDayRepresentation;

    constructor(index: number, date: dayjs.Dayjs, ref?: any) {
        this.index = index;
        this.ref = (index == 0) ? ref : undefined;

        this.date = date.format("DD.MM.YYYY");
        this.dayOfWeek = DAY_NAMES[date.day()];
        this.dateOffset = nameOffset(Math.ceil(date.diff(dayjs(), 'day', true)));
    }

    getState(): InternalDayRepresentation | undefined {
       return this.downloadedState;
    }
}

interface DayRep {
    day: dbDay;
    schedule: Array<ScheduleElement>;
}

function inside(time: number, d: LessonDur): boolean {
    if (d.end) {
        return (time >= d.start.time) && (time <= d.end.time);
    }
    return false;
}

function intercept(d1: LessonDur, d2: LessonDur): boolean {
    if (d1.start == d2.start) {
        if ((d1.end != undefined) && (d2.end != undefined) || (d1.end != d2.end))
            return true;
    }

    if (d1.end) {
        if (d2.end) {
            if (d1.start.time > d2.start.time) {
                return (d1.start.time < d2.end.time);
            } else {
                return (d2.start.time < d1.end.time);
            }
        } else {
            return inside(d2.start.time, d1);
        }
    } else {
        if (d2.end) {
            return inside(d1.start.time, d2);
        } else {
            return false;
        }
    }
}

async function downloadScope(maps: InternalRepresentationState, user: User,
                             startDate: Dayjs, days: Array<DayState>,
                             downloadCounter: () => void, priorities?: Array<SourcePriority>) {

    if (priorities == undefined) {
        for (let i = 0; i < days.length; ++i) {
            days[i].downloadedState = {lessons:  new Array<LessonPair>()};
        }
        downloadCounter();
        return;
    }

    const changesMap: {[keys: number]: Array<Changes>} = (await axios.get("/api/find/changes",{
        auth: user,
        params: {
            startDate: startDate.valueOf(),
            endDate: startDate.add(days.length-1, 'day').valueOf()
        }
    })).data;

    for (let i = 0; i < days.length; ++i) {
        const date = i > 0 ? startDate.add(i, 'day') : startDate;

        const changes = changesMap[date.valueOf()];

        const dayOfWeek = date.day();

        const dayVariants = new Array<DayRep>();
        for (let prId = 0; prId < priorities.length; ++prId) {
            const priority = priorities[prId];
            const source = maps.sources[priority.sourceId];

            if (source.endDate && (date.valueOf() > source.endDate)) {
                continue;
            }

            const defSchedule = (source && source.defaultSchedule && (source.defaultSchedule.length > 0))
                ? source.defaultSchedule
                : undefined;

            const change = changes ? findElement<Changes>(changes, (ch) => ch.priority == priority.priority) : undefined;

            if (change) {
                const day_db = maps.days[change.day]

                const schedule = (day_db.schedule && (day_db.schedule.length > 0))
                    ? day_db.schedule
                    : defSchedule;

                if (schedule) {
                    dayVariants.push({
                        day: day_db,
                        schedule: schedule
                    });
                }
            } else if (source.weeks.length > 0) {
                const weekNumber = Math.abs(Math.floor(date.diff(dayjs(source.startDate), "weeks", true))) % source.weeks.length;
                const week = findElement<Week>(source.weeks, (week) => week.number == weekNumber);

                // @ts-ignore
                const day = findElement<WeekDay>(week.days, (day) => day.number == dayOfWeek);

                if (day) {
                    const day_db = maps.days[day.day]
                    const schedule = (day_db.schedule && (day_db.schedule.length > 0))
                        ? day_db.schedule
                        : defSchedule;

                    if (schedule) {
                        dayVariants.push({
                            day: day_db,
                            schedule: schedule
                        });
                    }
                }
            }
        }

        const lessonDurs = new Array<LessonDur>();
        let lessons = new Array<LessonPair>();

        for (let j = 0; j < dayVariants.length; ++j) {
            const variant = dayVariants[j];
            const clessons = variant.day.lessons;
            let call = 0;

            let currentCallStart: ScheduleElement = {hour:0, minute: 0, time: 0, id:-1};
            let currentCallEnd: ScheduleElement | undefined;
            let callChanged = false;

            let lessonIndex = 0;
            let insertIndex = 0;

            for (let lId = 0; lId < clessons.length; ++lId, ++lessonIndex) {
                callChanged = call < variant.schedule.length;
                if (callChanged) {
                    currentCallStart = variant.schedule[call];
                    ++call;
                } else if (call == variant.schedule.length) {
                    if (currentCallEnd) {
                        currentCallStart = currentCallEnd;
                    }
                    ++call;
                }

                if (call < variant.schedule.length) {
                    currentCallEnd = variant.schedule[call];
                    ++call;
                } else {
                    currentCallEnd = undefined;
                }

                if (lessonIndex > clessons[lId].number) {
                    lessonIndex = clessons[lId].number;
                }

                if (lessonIndex != clessons[lId].number) {
                    --lId;
                    continue;
                }

                const dur = {
                    start: currentCallStart,
                    end: currentCallEnd
                };

                if (callChanged) {
                    if (containsElement(lessonDurs, (exDur) => intercept(exDur, dur))) {
                        continue;
                    }

                    lessonDurs.push(dur);
                }

                while ((insertIndex < lessons.length)
                    && (lessons[insertIndex].dur.start.time <= dur.start.time)) {
                    ++insertIndex;
                }

                lessons = addElement<LessonPair>(lessons, {
                    dur: dur,
                    lesson: clessons[lId]
                }, insertIndex);

                ++insertIndex;
            }
        }

        days[i].downloadedState = {lessons: lessons};
    }

    downloadCounter();
}


/**
 * Сдвигает скролл так, чтобы удаление элементов не было заметным
 * @param scroll текущее состояние скролла
 * @param scrollElement объект хранящий скролл
 * @param list список элементов из которых происходит удаление
 * @param first последний удаляемый элемент
 * @param last первый удаляемый элемент
 * @param dir направление сдвига при удалении
 */
function removeFromScroll(scroll: Scrolls, scrollElement: any,
                        list: Array<HTMLElement>, first: number, last: number, dir: number = 1) {
    let offset: number = 0;

    for (let i = first; i < last; ++i) {
        if (list[i] != undefined) {
            offset += list[i].getBoundingClientRect().height
        }
    }

    scrollElement.scrollTo(scroll.x, scroll.y + offset*dir);
}

interface InfiniteDaysSliderProps {
    /**
     * Ссылка на контейнер в котором находится список
     */
    containerRef: any;
    /**
     * Размер списка
     */
    listSize: number;
    /**
     * Список источников для загрузки
     */
    priorities: PrioritiesState;
    /**
     * Текущее раписание звонков поумолчанию
     */
    schedule: ScheduleState;
    /**
     * Текущий пользователь
     */
    user: User;
    /**
     * Количество загрузок, после которого страница должна обновиться
     */
    downloadsForRender: number;

    /**
     *  Описывает день, который должен находится первый при загрузке
     */
    origin: dayjs.Dayjs;
    /**
     * Все источники и их содержимое
     */
    maps: InternalRepresentationState;
    /**
     * Установить текущий день на просмотр
     */
    setDay: (props: DayProps) => void;
}

interface InfiniteDaysSliderState {
    /**
     * Окно просмотра
     */
    range: RangeObject;
    /**
     * Количество успешных загрузок с последнего обновления
     */
    successDownloadCount: number;
    /**
     * Запрос на обновление страницы
     */
    update: boolean;
}

/**
 * Класс, который предназначен для отображения бесконечного двунаправленного списка дней.
 */
class InfiniteDaysSlider extends React.Component<InfiniteDaysSliderProps, InfiniteDaysSliderState> {
    /**
     * Список всех дней для отображения
     */
    list: Array<DayState>;

    /**
     * Предыдущее окно просмотра
     */
    prevRange: RangeObject;

    /**
     * Предыдущий контейнер
     */
    prevContainer?: any;

    /**
     * Верхний якорь для прорисовки списка
     */
    firstRef: any;

    /**
     * Нижний якорь для прорисовки списка
     */
    lastRef: any;

    /**
     * Ссылка на список, в который будет отрендерено содержимое
     */
    listRef: any;

    /**
     * Ссылка на сегодняшний день
     */
    currentRef: any;

    /**
     * Событие для регистрации в DOM
     */
    eventHandler: any;

    /**
     * увеличить счётчик успешных загрузок
     */
    incSuccessDownloadCounter: any;

    /**
     * увеличить счётчик начатых загрузок
     */
    incDownloadCounter: any;

    /**
     * количество активных загрузок
     */
    currentDownloadCount: number;

    /**
     *  Надо ли сделать перемотку к сегодняшнему дню
     */
    scrollToStart: boolean;

    constructor(props: InfiniteDaysSliderProps) {
        super(props);

        //Начальное состояние
        this.state = {
            range: new RangeObject(this.props.listSize),
            update: true,
            successDownloadCount: 0
        };

        this.list = new Array<DayState>();

        //Предыдущие состояния
        this.prevRange = new RangeObject(this.props.listSize, 0, 0, 0);

        this.firstRef = React.createRef<any>();
        this.lastRef = React.createRef<any>();
        this.listRef = React.createRef<any>();

        this.currentRef = React.createRef<any>();

        this.scrollToStart = true;
        this.eventHandler = () => {this.handleContainerChanges()};
        this.incSuccessDownloadCounter = () => {this.setState({successDownloadCount: this.state.successDownloadCount + 1})};
        this.incDownloadCounter = () => {++this.currentDownloadCount;};

        this.currentDownloadCount = 0;
    }

    isStorageUpdated(nextProps: Readonly<InfiniteDaysSliderProps>, prevProps?: Readonly<InfiniteDaysSliderProps>) {
        if (prevProps == undefined) {
            prevProps = this.props;
        }

        return ( //Если сменилось хранилище - обновляем
            !arrayEq(nextProps.priorities.list, prevProps.priorities.list)
            || !arrayEq(nextProps.schedule.schedule, prevProps.schedule.schedule)
            || (nextProps.user.username !== prevProps.user.username)
        );
    }

    isRangeChanged(range: RangeObject): boolean {
        return (range.first !== this.state.range.first)
            || (range.last !== this.state.range.last);
    }

    updateRange(range: RangeObject) {
        if (this.isRangeChanged(range)) {
            this.setState({range:range});
        }
    }

    shouldComponentUpdate(nextProps: Readonly<InfiniteDaysSliderProps>, nextState: Readonly<InfiniteDaysSliderState>, nextContext: any): boolean {
        return nextState.update
            || (nextState.successDownloadCount >= nextProps.downloadsForRender) //Если число загрузок, больше лимита, обновляем стр
            || ((nextState.successDownloadCount == this.currentDownloadCount) && (this.currentDownloadCount > 0)) //Если число загрузок равно числу ожидаемых загрузок и мы ожидаем загрузки - обновляем стр
            || (nextProps.origin != this.props.origin)
            || (nextProps.containerRef.current !== this.prevContainer) //Если сменился контейнер - обновляем
            || this.isRangeChanged(nextState.range)           //Если сменился промежуток - обновляем
            || this.isStorageUpdated(nextProps);    //Если сменилось хранилище - обновляемся
    }

    /**
     * По текущему состоянию якорей пытается определить надо ли что-то дописывать.
     * Далее перематывает скрол чтобы скрыть удаление элементов.
     */
    handleContainerChanges() {
        if ((this.listRef.current == null) || (this.props.containerRef.current == null)) return;

        const {pos, dims, scrolls} = getComponentInfo(this.props.containerRef);

        if (this.firstRef.current != null) {
            const firstPosition = this.firstRef.current.getBoundingClientRect().top;

            if ((firstPosition + 20) > pos.y) {
                const {offset, range} = this.state.range.move(-5);

                if (offset > 0) {
                    removeFromScroll(scrolls, this.props.containerRef.current,
                        this.listRef.current.children,
                        this.listRef.current.children.length - offset,
                        this.listRef.current.children.length, 1);
                }
                this.updateRange(range);
            }
        }

        if (this.lastRef.current != null) {
            const lastPosition = this.lastRef.current.getBoundingClientRect().top;

            if ((lastPosition - 20 - pos.y) < dims.height) {
                const {offset, range} = this.state.range.move( 5);

                if (offset > 0) {
                    removeFromScroll(scrolls, this.props.containerRef.current,
                        this.listRef.current.children,
                        0, offset, -1);
                }
                this.updateRange(range);
            }
        }
    }

    componentWillUnmount() {
        //Если сейчас есть контейнер - отписываемся
        if (this.props.containerRef.current != null) {
            this.props.containerRef.current.removeEventListener('resize', this.eventHandler);
            this.props.containerRef.current.removeEventListener('scroll', this.eventHandler);
        }
    }

    componentDidMount() {
        this.prevContainer = this.props.containerRef.current;

        //Подписываемся на контейнер, если он есть
        if (this.props.containerRef.current != null) {
            //Если есть текущий элемент, то скролимся к нему
            this.scrollToCurrent();
            this.props.containerRef.current.addEventListener("scroll", this.eventHandler);
            this.props.containerRef.current.addEventListener('resize', this.eventHandler);
            this.setState({update: false});
        }
    }

    componentDidUpdate(prevProps: Readonly<InfiniteDaysSliderProps>, prevState: Readonly<InfiniteDaysSliderState>, snapshot?: any) {
        //Если бы запрос обновления - выключем его
        if (this.state.update) {
            this.setState({update: false});
        }

        if (this.state.successDownloadCount > 0) {
            this.currentDownloadCount -= this.state.successDownloadCount;
            this.setState({successDownloadCount: 0});
        }

        //Пытаемся промотать до текущего объекта
        this.scrollToCurrent();

        //Если сменился контейнер
        if (this.props.containerRef.current != this.prevContainer) {
            //Отписываемся от старого
            if (this.prevContainer != null) {
                this.prevContainer.removeEventListener('resize', this.eventHandler);
                this.prevContainer.removeEventListener('scroll', this.eventHandler);
            }

            //Обновляем прошлое состояние
            this.prevContainer = this.props.containerRef.current;

            //Подписываемся на новый
            if (this.props.containerRef.current != null) {
                this.props.containerRef.current.addEventListener("scroll", this.eventHandler);
                this.props.containerRef.current.addEventListener('resize', this.eventHandler);
            }
        }

        //Хранилище было обновлено: сбрасываем текущее состояние, но не трогаем range
        if (this.isStorageUpdated(this.props, prevProps)) {
            this.list = new Array<DayState>();
            this.prevRange = new RangeObject(this.props.listSize, 0, 0, 0);
            this.setState({update: true});
        }

        if (this.props.origin != prevProps.origin) {
            this.list = new Array<DayState>();
            this.prevRange = new RangeObject(this.props.listSize, 0, 0, 0);

            this.scrollToStart = true;
            this.setState({update: true});
        }
    }

    //Перемотать скрол к текущему элементу, так, чтобы верх текущего компонента стал серединой экрана
    scrollToCurrent() {
        //запрошена перемотка в начало, существует контейнер и начало, а также расписание загружено
        if (this.scrollToStart && (this.props.containerRef.current != null) && (this.currentRef.current != null)) {
            //Получаем информацию о контейнере и текущем элементе
            const containerInfo = getComponentInfo(this.props.containerRef);
            const currentInfo = getComponentInfo(this.currentRef);
            const currentDownSide = currentInfo.pos.y;
            const offset = currentDownSide + containerInfo.scrolls.y;

            //Перемотка, так, чтобы верх текущего компонента стал серединой экрана
            this.props.containerRef.current.scrollTo(
                containerInfo.scrolls.x, offset - Math.floor(containerInfo.dims.height) / 2 + 90
            );
            this.scrollToStart = false;
        }
    }

    //Добавляет описание дня в список
    appendDay(list: Array<DayState>, i: number) {
        const calendar = this.props.origin.add(i, "day");
        const data = new DayState(i, calendar, this.currentRef);
        list.push(data);
        return data;
    }

    constructList() {
        //Если промежуток отображения сменился
        if (this.isRangeChanged(this.prevRange)) {
            //Запоминаем его
            const range = this.state.range;

            //Если сейчас нет объектов для отображения - рендерим весь промежуток, а потом перематываемся к последнему
            if (this.list.length == 0) {
                const list = new Array<DayState>();
                for (let i = range.first; i < range.last; ++i) {
                    this.appendDay(list, i);
                }

                downloadScope(
                    this.props.maps, this.props.user,
                    this.props.origin.add(range.first, "day"), list,
                    this.incDownloadCounter, this.props.priorities.list
                ).then(() => {
                   this.incSuccessDownloadCounter();
                }).catch(() => {
                    this.incSuccessDownloadCounter();
                });
                this.list = list;
                this.scrollToStart = true;
            } else {
                const list = new Array<DayState>();
                const downloads = new Array<DayState>();
                //Дополняем начало списка
                for (let i = range.first; i < this.prevRange.first; ++i) {
                    downloads.push(this.appendDay(list, i));
                }

                //Возвращаем старые элементы списка
                for (let i = Math.max(range.first, this.prevRange.first); i < Math.min(range.last, this.prevRange.last); ++i)
                    list.push(this.list[i - this.prevRange.first]);

                //Дополняем конец списка
                for (let i = this.prevRange.last; i < range.last; ++i) {
                    downloads.push(this.appendDay(list, i));
                }

                downloadScope(
                    this.props.maps, this.props.user,
                    this.props.origin.add(range.first, "day"), downloads,
                    this.incDownloadCounter, this.props.priorities.list
                ).then(() => {
                    this.incSuccessDownloadCounter();
                }).catch(() => {
                    this.incSuccessDownloadCounter();
                });

                this.list = list;
            }
            this.prevRange = range;
        }

    }

    render() {
        this.constructList();

        return (
            <>
                <div ref={this.firstRef} />

                <List ref={this.listRef}>
                    {this.list.map((state) =>
                        <Day currentRef={state.ref} day={state.getState()}
                             index={state.index}
                             setDay={this.props.setDay}
                             selected={state.index == 0}
                             date={state.date} dateOffset={state.dateOffset} dayOfWeek={state.dayOfWeek}/>
                        )
                    }
                </List>

                <div ref={this.lastRef} />
            </>
        );
    }
}

function mapStateToProps(state: RootState) {
    return {
        priorities: state.priorities,
        schedule: state.schedule,
        user: state.user,
        maps: state.sourceMap
    }
}

export default connect(mapStateToProps)(InfiniteDaysSlider);