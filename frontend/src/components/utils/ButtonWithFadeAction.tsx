import * as React from "react";
import {Fade, IconButton, ListItem, ListItemButton} from "@mui/material";
import {useState} from "react";

interface ButtonWithFadeActionProps {
    actions: React.ReactElement<any, any>;
    children: any;
    onClick: () => void;
}

export default function ButtonWithFadeAction(props: ButtonWithFadeActionProps) {
    const [fade, setFade] = useState(false);

    return (
        <ListItem secondaryAction={
            <Fade in={fade} appear={false}>
                {props.actions}
            </Fade>
        }
        onMouseEnter={() => {if (!fade) setFade(true)}}
        onMouseOver ={() => {if (!fade) setFade(true)}}
        onMouseLeave={() => {if (fade) setFade(false)}}>
            <ListItemButton onClick={props.onClick}>
                {props.children}
            </ListItemButton>
        </ListItem>
    );
}