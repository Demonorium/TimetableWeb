import * as React from 'react';
import {List, ListItemButton} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {setScreen} from "../../store/appStatus";

export interface TargetScreen {
    id: string;
    data: string;
}

export interface EditTargetMenuProps {
    menu: Array<TargetScreen>;
}

export default function LeftMenu({ menu}: EditTargetMenuProps) {
    const screen = useAppSelector(state => state.app.screen);
    const dispatch = useAppDispatch();

    return (
      <List>
          {menu.map((key: TargetScreen, index: number) =>
              <ListItemButton onClick={() => dispatch(setScreen({name:key.id}))} key={index} selected={key.id == screen.name}>{key.data}</ListItemButton>
          )}
      </List>
    );
}