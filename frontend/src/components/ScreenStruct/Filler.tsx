import * as React from "react";
import {useEffect, useState} from "react";
import {Container} from "@mui/material";
import {getDimensions} from "../../utils/componentInfo";

export function Filler(props: any) {
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        setUpdate(update => !update);
    }, [props.headerRef.current]);

    const height = (props.headerRef.current == null) ? '92%' : ((window.innerHeight - getDimensions(props.headerRef).height) + "px");
    return (
        <Container
            sx={{
                maxHeight: height
            }}
            maxWidth="xl" component="main">
            {props.children}
        </Container>
    );
}