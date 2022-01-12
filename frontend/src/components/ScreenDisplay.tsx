import * as React from 'react';
import {useEffect} from 'react';
import LeftMenu, {TargetScreen} from "./ScreenStruct/LeftMenu";
import {Filler} from "./ScreenStruct/Filler";
import {DaysList} from "./screens/DaysList";
import {EditSourcesList} from "./screens/EditSourcesList";
import {reverse} from "../store/appStatus";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import Tasks from "./screens/Tasks";
import EditSource from "./screens/EditSource";

interface BodyProps {
    /**
     * Ссылка на заголовок, используется для определения размера слайдера дней
     */
    headerRef: any;
}

export interface ScreenInterface {
    menu: any;
}

const MENU: Array<TargetScreen> = [
    {id:"DAYS", data:"Основное расписание"},
    {id:"TASKS", data:"Задания"},
    {id:"SOURCES", data:"Список источников"}
];

const EscapeButton = 27;

export default function ScreenDisplay(props: BodyProps) {
    const screen = useAppSelector(state => state.app.screen);
    const dispatch = useAppDispatch();

    const menu = <LeftMenu menu={MENU}/>

    const esc = (event: any) => {
        if(event.keyCode === EscapeButton) {
            dispatch(reverse());
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", esc, false);
        return () => {
            document.removeEventListener("keydown", esc, false);
        }
    });

    return (
        <Filler headerRef={props.headerRef}>
            {screen.name == "DAYS"          && <DaysList         menu={menu}/>}
            {screen.name == "TASKS"         && <Tasks            menu={menu}/>}
            {screen.name == "SOURCES"       && <EditSourcesList  menu={menu}/>}
            {screen.name == "EDIT_SOURCE"   && <EditSource       menu={menu}/>}
        </Filler>
    );
}

