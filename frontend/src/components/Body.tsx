import * as React from 'react';
import axios from "axios";
import {Container} from '@mui/material';
import InfiniteDaysSlider from "./InfiniteDaysSlider";
import {connect} from "react-redux";
import {SourcePriority} from "../store/database";
import {useEffect, useState} from "react";

interface BodyProps {
    sources: Array<{[key: string]: any}>
    store: any,
    container: any
}

function Body(props: BodyProps) {
    const store = props.store;
    const container = props.container;
    const [sources, setSources] = useState(new Array<SourcePriority>());
    const [update, setUpdate] = useState(true)

    useEffect(() =>{
        if (update) {
            axios.get("/api/find/current_sources", {
                auth: store.user
            }).then((response) => {
               setSources(response.data);
            }).catch((response) => {
            })
            setUpdate(false);
        }
    }, [update])

    if (sources.length == 0) {
        return (
            <Container maxWidth="sm" component="main">

            </Container>
        );
    } else {
        return (
            <Container sx={{bgcolor:'#FFFFFF'}}  maxWidth="sm" component="main" >
                <InfiniteDaysSlider containerReference={container} sources={sources}/>
            </Container>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        store: state
    }
}
export default connect(mapStateToProps)(Body);