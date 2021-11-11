import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {List, ListItemButton} from "@mui/material";
import {setScreen} from "../../../store/appStatus";
import * as React from "react";
import {EditTargetMenuProps, TargetScreen} from "../../ScreenStruct/LeftMenu";
import {EditSourceParams} from "../EditSource";

function clone<T>(obj: T): T {
    const R : {[key: string]: any} = {};
    for (let key in obj) {
        R[key] = obj[key];
    }
    // @ts-ignore
    return R;
}

function UpdateParams(params: EditSourceParams, subscreen: string) {
    params = clone<EditSourceParams>(params);
    params.subscreen = subscreen;
    return params;
}
export default function RightMenu({ menu }: EditTargetMenuProps) {
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;
    const screen = useAppSelector(state => state.app.screen);
    const dispatch = useAppDispatch();


    return (
        <List>
            {menu.map((key: TargetScreen, index: number) =>
                <ListItemButton onClick={() => dispatch(setScreen({name: screen.name, params: UpdateParams(params, key.id)}))} key={index} selected={key.id == params.subscreen}>{key.data}</ListItemButton>
            )}
        </List>
    );
}