import * as React from "react";
import {useState} from "react";
import {Fade, ListItem, ListItemButton} from "@mui/material";

interface ButtonWithFadeActionProps {
    actions: React.ReactElement<any, any>;
    children: any;
    onClick?: () => void;
    selected?: boolean;
    toKey?: any;
}
const NO_PADDING = {padding: "0"};

export default function ButtonWithFadeAction(props: ButtonWithFadeActionProps) {
    const [fade, setFade] = useState(false);

    return (
        <ListItemButton key={props.toKey} selected={props.selected}>
            <ListItem sx={NO_PADDING} secondaryAction={
                <Fade in={fade} appear={false}>
                    {props.actions}
                </Fade>
            }
            onMouseEnter={() => {if (!fade) setFade(true)}}
            onMouseOver ={() => {if (!fade) setFade(true)}}
            onMouseLeave={() => {if (fade) setFade(false)}}>
                <ListItem sx={NO_PADDING} onClick={props.onClick}>
                    {props.children}
                </ListItem>
            </ListItem>
        </ListItemButton>
    );
}