import * as React from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {useAppSelector} from "../../store/hooks";
import RightMenu from "./edit-source/RightMenu";
import {TargetScreen} from "../ScreenStruct/LeftMenu";
import SourceTitle from "./edit-source/SourceTitle";
import {Paper} from "@mui/material";

export interface EditSourceParams {
    sourceId: number;
    subscreen: string;
}

const MENU: Array<TargetScreen> = [
    {id: "TITLE", data: "Основная информация"},
    {id: "TASKS", data: "Задания"},
    {id: "WEEKS", data: "Расписания"},
    {id: "LESSONS", data: "Предметы"},
    {id: "PLACES", data: "Места проведения занятий"},
    {id: "TEACHERS", data: "Преподаватели"},
]

export default function EditSource(props: ScreenInterface) {
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;

    return (
        <TripleGrid leftMenu={props.menu} rightMenu={<RightMenu menu = {MENU}/>}>
            <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "32px"}}>
                {params.subscreen == "TITLE" ? <SourceTitle /> :undefined}
            </Paper>
        </TripleGrid>
    );
}