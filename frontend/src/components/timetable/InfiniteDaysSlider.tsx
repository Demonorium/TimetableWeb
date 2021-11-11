import React from 'react';
import {List} from "@mui/material";
import {DAY_NAMES, nameOffset} from "../../utils/time";
import {connect} from "react-redux";
import Day, {InternalDayRepresentation, makeInternalDayRepresentation} from "./Day";
import {RootState} from "../../store/store";
import RangeObject from "../../utils/range";
import {Changes, Lesson, ScheduleElement, SourcePriority, User} from "../../database";
import axios from "axios";
import {ScheduleState} from "../../store/schedule";
import {PrioritiesState} from "../../store/priorities";
import getComponentInfo, {Scrolls} from "../../utils/componentInfo";
import dayjs from "dayjs";
import {arrayEq} from "../../utils/arrayUtils";

async function downloadChangesFromSource(user: User, priority: SourcePriority, date: dayjs.Dayjs): Promise<Changes> {
    return axios.get("/api/find/changes",{
            auth: user,

            params: {
                sourceId: priority.sourceId,
                year: date.year(),
                day: date.dayOfYear()
            }
        }
    )
}

async function downloadDay(user: User, date: dayjs.Dayjs, priorities: Array<SourcePriority>) {
    const array = new Array<Promise<any>>();

    for (let i=0; i < priorities.length; ++i) {
        try {
            array.push(downloadChangesFromSource(user, priorities[i], date));
        } catch (ignore:any) {}
    }

    const result = new Array<InternalDayRepresentation>();

    for (let i = 0; i < array.length; ++i) {
        try {
            const response = await array[i].catch((e: any) => {});
            if (response != undefined) {
                result.push(makeInternalDayRepresentation(response.data, priorities[i].priority))
            }
        } catch (ignore:any) {}
    }

    return result;
}

/**
 * Данные хранит описание дня, может загружать его с сервера
 */
class DayState {
    index: number;

    date: string;
    dayOfWeek: string;
    dateOffset: string;
    ref?: any;

    downloadedState?: Array<InternalDayRepresentation>;

    constructor(index: number, date: dayjs.Dayjs, ref?: any) {
        this.index = index;
        this.ref = (index == 0) ? ref : undefined;

        this.date = date.format("YYYY.MM.DD");
        this.dayOfWeek = DAY_NAMES[date.day()];
        this.dateOffset = nameOffset(Math.ceil(date.diff(dayjs(), 'day', true)));
    }

    getState(defaultSchedule?: Array<ScheduleElement>): InternalDayRepresentation | undefined {
        //Если нет загруженного состояния - значит загрузка ещё идёт
        if (this.downloadedState == undefined)
            return undefined;

        //Если загруженное состояние пустое, значит нет занятий
        if (this.downloadedState.length == 0)
            return {
                lessons: new Array<Lesson>(),
                schedule: new Array<ScheduleElement>(),
                priority: 0
            };

        //Пытаемся найти не пустое расписание звонков
        let selectedSchedule = defaultSchedule;
        for (let i = 0; i < this.downloadedState.length; ++i) {
            if ((this.downloadedState[i].schedule != undefined) && (this.downloadedState[i].schedule.length > 0)) {
                selectedSchedule = this.downloadedState[i].schedule;
                break;
            }
        }

        //Если нет расписания или расписание пустое: нельзя составить уроки, возврат
        if ((selectedSchedule == undefined) || (selectedSchedule.length == 0)) {
            return {
                lessons: new Array<Lesson>(),
                schedule: new Array<ScheduleElement>(),
                priority: 0
            }
        }

        //Если всё необходимое есть, возвращаем наиболее приоритетный день
        return {
            lessons: this.downloadedState[0].lessons,
            schedule: selectedSchedule,
            priority: 0
        }
    }
    startDownload(user: User, date: dayjs.Dayjs, successCounter: any, downloadCounter: any, priorities?: Array<SourcePriority>) {
        if (priorities == undefined) {
            this.downloadedState = new Array<InternalDayRepresentation>();
        } else {
            downloadCounter();

            downloadDay(user, date, priorities).then((data) => {
                this.downloadedState = data;
            }).catch((reason) => {
            }).finally(() => {
                successCounter();
            });
        }
    }
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
        if (list[i] != undefined)
            offset += list[i].getBoundingClientRect().height
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
        if (prevProps == undefined)
            prevProps = this.props;

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
        //запрошена перемотка в начало, существует контейнер и начало
        if (this.scrollToStart && (this.props.containerRef.current != null) && (this.currentRef.current != null)) {
            //Получаем информацию о контейнере и текущем элементе
            const containerInfo = getComponentInfo(this.props.containerRef);
            const currentInfo = getComponentInfo(this.currentRef);
            const currentDownSide = currentInfo.pos.y;
            const offset = currentDownSide + containerInfo.scrolls.y;

            //Перемотка, так, чтобы верх текущего компонента стал серединой экрана
            this.props.containerRef.current.scrollTo(
                containerInfo.scrolls.x, offset - Math.floor(containerInfo.dims.height / 2)
            );
            this.scrollToStart = false;
        }
    }

    //Добавляет описание дня в список
    appendDay(list: Array<DayState>, i: number) {
        const calendar = this.props.origin.add(i, "day");
        const data = new DayState(i, calendar, this.currentRef);
        data.startDownload(this.props.user, calendar, this.incSuccessDownloadCounter, this.incDownloadCounter,  this.props.priorities.list);
        list.push(data);
    }

    constructList() {
        //Если промежуток отображения сменился
        if (this.isRangeChanged(this.prevRange)) {
            //Запоминаем его
            const range = this.state.range;

            //Если сейчас нет объектов для отображения - рендерим весь промежуток, а потом перематываемся к последнему
            if (this.list.length == 0) {
                const list = new Array<DayState>(this.list.length);
                for (let i = range.first; i < range.last; ++i) {
                    this.appendDay(list, i);
                }
                this.list = list;
                this.scrollToStart = true;
            } else {
                const list = new Array<DayState>();

                //Дополняем начало списка
                for (let i = range.first; i < this.prevRange.first; ++i) {
                    this.appendDay(list, i);
                }

                //Возвращаем старые элементы списка
                for (let i = Math.max(range.first, this.prevRange.first); i < Math.min(range.last, this.prevRange.last); ++i)
                    list.push(this.list[i - this.prevRange.first]);

                //Дополняем конец списка
                for (let i = this.prevRange.last; i < range.last; ++i) {
                    this.appendDay(list, i);
                }

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
        user: state.user
    }
}

export default connect(mapStateToProps)(InfiniteDaysSlider);