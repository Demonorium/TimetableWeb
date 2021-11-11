import * as React from "react";
import {Fade, IconButton, ListItem, ListItemButton} from "@mui/material";
import {useState} from "react";

interface ButtonWithFadeActionProps {
    actions: React.ReactElement<any, any>;
    children: any;
    onClick: () => void;
}
const NO_PADDING = {padding: "0"};

export default function ButtonWithFadeAction(props: ButtonWithFadeActionProps) {
    const [fade, setFade] = useState(false);

    return (
        <ListItemButton>
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