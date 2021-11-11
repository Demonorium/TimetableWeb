import * as React from "react";
import {useEffect} from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import RightMenu from "./edit-source/RightMenu";
import {TargetScreen} from "../ScreenStruct/LeftMenu";
import SourceTitle from "./edit-source/SourceTitle";
import {CircularProgress, Paper} from "@mui/material";
import PlaceListEditor from "./edit-source/PlaceListEditor";
import {removeSource, SourcesRepresentation, updateSource} from "../../store/sourceMap";
import axios from "axios";

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
    const user = useAppSelector(state => state.user)
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;
    const source = useAppSelector(state => state.sourceMap.sources[params.sourceId]) as SourcesRepresentation | undefined;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (source == undefined) {
            axios.get("api/find/source",
                {
                    auth: user,
                    params: {
                        id: params.sourceId
                    }
                }
            ).then((response) => {
                dispatch(updateSource(response.data));
            }).catch(() => {
                dispatch(removeSource(params.sourceId));
            });
        }
        return () => {
            if (source != undefined) {

                const toSend: {[keys: string] : any} = {
                    id: params.sourceId,
                    name: source.source.name,
                    startDate: source.source.startDate,
                    startWeek: source.source.startWeek
                }
                if (source.source.endDate != undefined) {
                    toSend['endDate'] = source.source.endDate
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
                        {params.subscreen == "TITLE" ? <SourceTitle source={source} /> :undefined}
                        {params.subscreen == "PLACES" ? <PlaceListEditor isSelect={false} source={source}/> :undefined}
                    </Paper>
            }
        </TripleGrid>
    );
}