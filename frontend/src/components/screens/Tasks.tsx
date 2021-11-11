import * as React from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {Paper} from "@mui/material";


export default function Tasks(props: ScreenInterface) {

    return (
        <TripleGrid leftMenu={props.menu}>
            <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "32px"}}>
            </Paper>
        </TripleGrid>
    );
}