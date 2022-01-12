import * as React from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {useAppSelector} from "../../store/hooks";
import RightMenu from "./edit-source/RightMenu";
import {TargetScreen} from "../ScreenStruct/LeftMenu";
import SourceTitle from "./edit-source/SourceTitle";
import {CircularProgress, Paper} from "@mui/material";
import PlaceListEditor from "./edit-source/PlaceListEditor";
import TeacherListEditor from "./edit-source/TeacherListEditor";
import LessonTemplateEditor from "./edit-source/LessonTemplateEditor";
import WeekListEditor from "./edit-source/WeekListEditor";
import {Source} from "../../database";
import {OverridableStringUnion} from "@mui/types";
import {Variant} from "@mui/material/styles/createTypography";
import {TypographyPropsVariantOverrides} from "@mui/material/Typography/Typography";
import EditNotes from "./edit-source/EditNotes";
import EditChanges from "./edit-source/EditChanges";

export interface EditSourceParams {
    sourceId: number;
    subscreen: string;
}

const MENU: Array<TargetScreen> = [
    {id: "TITLE",   data: "Основная информация"},
    {id: "TASKS",   data: "Задания"},
    {id: "CHANGES", data: "Изменения"},
    {id: "WEEKS",   data: "Недели"},
    {id: "LESSONS", data: "Предметы"},
    {id: "PLACES",  data: "Места проведения занятий"},
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
     * размер титульника
     */
    titleFormat?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;
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

    return (
        <TripleGrid leftMenu={props.menu} rightMenu={<RightMenu menu = {MENU}/>}>
            {
                (source == undefined) ?
                    <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "16px"}}>
                        <CircularProgress />
                    </Paper> :

                    <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "16px"}}>
                        {params.subscreen == "TITLE"    && <SourceTitle          sourceOrigin={source}/>}

                        {params.subscreen == "WEEKS"    && <WeekListEditor       source={source}/>}

                        {params.subscreen == "TASKS"    && <EditNotes            isSelect={false} source={source}/>}
                        {params.subscreen == "CHANGES"  && <EditChanges          isSelect={false} source={source}/>}
                        {params.subscreen == "LESSONS"  && <LessonTemplateEditor isSelect={false} source={source}/>}
                        {params.subscreen == "PLACES"   && <PlaceListEditor      isSelect={false} source={source}/>}
                        {params.subscreen == "TEACHERS" && <TeacherListEditor    isSelect={false} source={source}/>}
                    </Paper>
            }
        </TripleGrid>
    );
}