import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {Box, Container, Grid, Paper} from '@mui/material';
import InfiniteDaysSlider from "./InfiniteDaysSlider";
import {SourcePriority} from "../database";
import {setSources} from "../store/sources";
import {useAppDispatch, useAppSelector} from "../store/hooks";
import CalendarPicker from '@mui/lab/CalendarPicker';
import dayjs from "dayjs";
import {getDimensions} from "../utils/componentInfo";

interface BodyProps {
    /**
     * Ссылка на заголовок, используется для определения размера слайдера дней
     */
    headerRef: any;
}

enum BodyState {
    DAYS
}

function DaysList() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const containerRef = useRef<any>();

    const [update, setUpdate] = useState(true);
    const [date, setDate] = useState(dayjs());

    useEffect(() =>{
        if (update) {
            axios.get("/api/find/current_sources", {
                auth: user
            }).then((response) => {
                dispatch(setSources(response.data));
            }).catch((response) => {
                dispatch(setSources(new Array<SourcePriority>()));
            })
            setUpdate(false);
        }
    }, [update]);

    const handleCalendar = (date: any) => {
        setDate(date);
    };

    return (
        <Grid container spacing={2} sx={{height: '100%', marginTop: '0'}}>
            <Grid item xs={3}>
                <Paper color="main" sx={{marginTop:"32px"}}>
                    <CalendarPicker date={date} onChange={handleCalendar}/>
                </Paper>
            </Grid>

            <Grid item xs={6} sx={{height: "100%", paddingTop: '0!important' }}>
                <Box ref={containerRef} sx={{
                    width: '100%', height: '100%',
                    overflow: 'hidden scroll',
                    padding: '0', margin: '0'}}>
                    <Paper color="main">
                        <InfiniteDaysSlider containerRef={containerRef} listSize={20} downloadsForRender={10} origin={date}/>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={3} sx={{paddingTop:"16px"}}>

            </Grid>
        </Grid>
    );
}


export default function Body(props: BodyProps) {
    const [state, setState] = useState(BodyState.DAYS);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        setUpdate(update => !update);
    }, [props.headerRef.current])

    return (
        <Container sx={{maxHeight: (props.headerRef.current == null)? '92%' : ((window.innerHeight - getDimensions(props.headerRef).height) + "px")}} maxWidth="xl" component="main">
            <DaysList/>
        </Container>
    );
}

