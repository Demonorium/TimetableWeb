import * as React from 'react';
import {useEffect} from 'react';
import {Divider, IconButton, List, ListItemButton, Tooltip} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {closeScreens, setScreen} from "../../store/appStatus";
import ButtonWithFadeAction from "../utils/ButtonWithFadeAction";
import {Close} from "@material-ui/icons";
import {removeEditorTab} from "../../store/editorList";
import {EditSourceParams} from "../screens/EditSource";

export interface TargetScreen {
    id: string;
    data: string;
}

export interface EditTargetMenuProps {
    menu: Array<TargetScreen>;
}

export default function LeftMenu({ menu}: EditTargetMenuProps) {
    const screen = useAppSelector(state => state.app.screen);
    const editorList = useAppSelector(state => state.editorList.list);
    const sources = useAppSelector(state => state.sourceMap.sources);

    const dispatch = useAppDispatch();

    useEffect( () => {
        if (sources == undefined) return;

        for (let i = 0; i < editorList.length; ++i) {
            const item = editorList[i];
            const params = item.params as EditSourceParams | undefined;
            if (params == undefined) {
                dispatch(removeEditorTab(item));
                continue;
            }

            if (!(params.sourceId in sources)) {
                dispatch(removeEditorTab(item));
            }
        }
    });

    return (
      <List>
          {menu.map((key: TargetScreen, index: number) =>
              <ListItemButton onClick={() => dispatch(setScreen({name:key.id}))} key={index} selected={key.id == screen.name}>{key.data}</ListItemButton>
          )}

          {
              ((editorList.length == 0) || (sources == undefined)) ? undefined : (
                  <>
                    <Divider />
                    {editorList.map((item, index) => {
                        const params = item.params as EditSourceParams | undefined;
                        if (params == undefined) return undefined;

                        const value = sources[params.sourceId];
                        if (value == undefined) return undefined;

                        return (
                            <ButtonWithFadeAction actions={
                                <Tooltip title="Закрыть">

                                    <IconButton onClick={() => {
                                        dispatch(removeEditorTab(item));

                                        dispatch(closeScreens({screen: item, comparator: (s1, s2) => {
                                            if (s1.name == s2.name) {
                                                if (s1.params == s2.params)
                                                    return true;
                                                if ((s1.params == undefined) || (s2.params == undefined))
                                                    return false;
                                                if (s1.params['sourceId'] == s2.params['sourceId']) {
                                                    return true;
                                                }
                                            }
                                            return false;
                                        }}))
                                    }}>
                                        <Close/>
                                    </IconButton>
                                </Tooltip>
                            } onClick={() => dispatch(setScreen(item))} selected={screen.params == undefined? false : screen.params['sourceId'] == params.sourceId}>

                                {value.name}
                            </ButtonWithFadeAction>
                        );
                    })}
                  </>
              )
          }
      </List>

    );
}