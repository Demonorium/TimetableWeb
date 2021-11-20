import * as React from "react";
import {useEffect} from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {useAppSelector} from "../../store/hooks";
import RightMenu from "./edit-source/RightMenu";
import {TargetScreen} from "../ScreenStruct/LeftMenu";
import SourceTitle from "./edit-source/SourceTitle";
import {CircularProgress, Paper} from "@mui/material";
import PlaceListEditor from "./edit-source/PlaceListEditor";
import axios from "axios";
import TeacherListEditor from "./edit-source/TeacherListEditor";
import LessonTemplateEditor from "./edit-source/LessonTemplateEditor";
import WeekListEditor from "./edit-source/WeekListEditor";
import {Source} from "../../database";

export interface EditSourceParams {
    sourceId: number;
    subscreen: string;
}

const MENU: Array<TargetScreen> = [
    {id: "TITLE", data: "Основная информация"},
    {id: "TASKS", data: "Задания"},
    {id: "WEEKS", data: "Недели"},
    {id: "LESSONS", data: "Предметы"},
    {id: "PLACES", data: "Места проведения занятий"},
    {id: "TEACHERS", data: "Преподаватели"},
]

export interface EditorProps<T> {
    /**
     * Является ли редактор окном выбора
     */
    isSelect: boolean;
    /**
     * Должен ли будет использоваться особенный заголовок
     */
    overrideTitle?: string;

    /**
     * Описание источника
     */
    source: Source;
    /**
     * При закрытии окна редактирования/Выбора будет вызван данный метод
     */
    requestClose?: (item?: T) => void;
    /**
     * Данные объекты не будут показаны в списке
     */
    exclude?: (item: T) => boolean;
}

export default function EditSource(props: ScreenInterface) {
    const user = useAppSelector(state => state.user)
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;
    const source = useAppSelector(state => state.sourceMap.sources[params.sourceId]) as Source | undefined;

    useEffect(() => {
        return () => {
            if (source != undefined) {

                const toSend: {[keys: string] : any} = {
                    id: params.sourceId,
                    name: source.name,
                    startDate: source.startDate,
                    startWeek: source.startWeek
                }
                if (source.endDate != undefined) {
                    toSend['endDate'] = source.endDate
                }

                axios.get("api/part-update/source/basic-info",
                    {
                        auth: user,
                        params: toSend
                    }
                );
            }
        }
    }, [source]);

    return (
        <TripleGrid leftMenu={props.menu} rightMenu={<RightMenu menu = {MENU}/>}>
            {
                (source == undefined) ?
                    <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "16px"}}>
                        <CircularProgress />
                    </Paper> :
                    <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "16px"}}>
                        {params.subscreen == "TITLE"    ? <SourceTitle source={source} /> :undefined}
                        {params.subscreen == "WEEKS"    ? <WeekListEditor source={source}/> :undefined}
                        {params.subscreen == "LESSONS"  ? <LessonTemplateEditor isSelect={false} source={source}/> :undefined}
                        {params.subscreen == "PLACES"   ? <PlaceListEditor isSelect={false} source={source}/> :undefined}
                        {params.subscreen == "TEACHERS" ? <TeacherListEditor isSelect={false} source={source}/> :undefined}
                    </Paper>
            }
        </TripleGrid>
    );
}