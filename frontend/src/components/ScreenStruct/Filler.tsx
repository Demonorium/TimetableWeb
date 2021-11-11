import * as React from "react";
import {useEffect, useState} from "react";
import {Container} from "@mui/material";
import {getDimensions} from "../../utils/componentInfo";

export function Filler(props: any) {
    const [update, setUpdate] = useState(false);
    useEffect(() => {
        setUpdate(update => !update);
    }, [props.headerRef.current])
    return (
        <Container
            sx={{maxHeight: (props.headerRef.current == null) ? '92%' : ((window.innerHeight - getDimensions(props.headerRef).height) + "px")}}
            maxWidth="xl" component="main">
            {props.children}
        </Container>
    );
}