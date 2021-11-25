import * as React from 'react';
import {
    Button,
    Container, DialogActions, Divider,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {DatePicker, LoadingButton} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {EditSourceParams} from "../EditSource";
import {updateSource} from "../../../store/sourceMap";
import dayjs from "dayjs";
import {ScheduleElement, Source, Week} from "../../../database";
import {useEffect, useState} from "react";
import axios from "axios";
import ScheduleEditor from "../../modals/ScheduleEditor";

interface SourceTitleProps {
    sourceOrigin: Source;
}

export default function SourceTitle({sourceOrigin}: SourceTitleProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [source, setSource] = useState(sourceOrigin);

    const [scheduleEditor, setScheduleEditor] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSource({
            ...source,
            name: event.target.value
        });
    };

    const saveSource = () => {
        const toSend: {[keys: string] : any} = {
            id: source.id,
            name: source.name,
            startDate: source.startDate,
            startWeek: source.startWeek,
            defaultSchedule: source.defaultSchedule ? source.defaultSchedule.map(el => el.time) : undefined
        }
        if (source.endDate != undefined) {
            toSend['endDate'] = source.endDate
        }

        setLoading(true);
        axios.get("api/part-update/source/basic-info",
            {
                auth: user,
                params: toSend
            }
        ).then(() => {
            dispatch(updateSource(source));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    useEffect(() => {
        setSource(sourceOrigin);
    }, [sourceOrigin]);

    return (
        <Grid container spacing={2} sx={{marginTop: "0"}}>
            <Grid item xs={12}>
                <Typography variant="h6">Редактирование источника</Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField fullWidth label="Название источника" value={source.name} onChange={handleInput}/>
            </Grid>
            <Grid item xs={6}>
                <DatePicker
                    label="Дата начала занятий"
                    views={['year', 'month', 'day']}
                    value={dayjs(source.startDate)}
                    onChange={(newValue: dayjs.Dayjs) => {
                        if (newValue != null) {
                            dispatch(updateSource({
                                ...source,
                                startDate: newValue.valueOf()
                            }));
                        }
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth/>}
                />
            </Grid>
            <Grid item xs={6}>
                <DatePicker
                    label="Дата окончания занятий"
                    views={['year', 'month', 'day']}
                    value={source.endDate == null ? null : dayjs(source.endDate)}
                    onChange={(newValue: dayjs.Dayjs) => {
                        if (newValue != null) {
                            dispatch(updateSource({
                                ...source,
                                "endDate": newValue.valueOf()
                            }));
                        } else {
                            dispatch(updateSource({
                                ...source,
                                "endDate": undefined
                            }));
                        }
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth/>}
                />
            </Grid>

            <Grid item xs={12}>
                <Container maxWidth="xs" sx={{textAlign:"center"}}>
                    <InputLabel id="select-week-label">Номер первой недели</InputLabel>
                    <Select
                        id="select-week"
                        labelId="select-week-label"
                        value={source.startWeek}
                        onChange={(event: SelectChangeEvent<number>) => {
                            dispatch(updateSource({
                                ...source,
                                "startWeek": typeof(event.target.value) == "number"? event.target.value as number : 0
                            }));
                        }}
                        fullWidth
                        disabled={source.weeks.length < 2}
                    >
                        {source.weeks.length < 2 ? <MenuItem value={source.startWeek}>1</MenuItem>: source.weeks.map((value: Week, index: number) =>  <MenuItem value={value.number}>{index+1}</MenuItem>)}
                    </Select>
                </Container>
            </Grid>
            <Grid item xs={12}>
                <Container maxWidth="xs" sx={{textAlign:"center"}}>
                    <Button variant="outlined" onClick={() => setScheduleEditor(true)}>
                        Редактировать расписание звонков
                    </Button>
                </Container>
                <ScheduleEditor onAccept={(schedule) => {
                    setSource({
                        ...source,
                        defaultSchedule: schedule.length > 0 ? schedule : undefined
                    });
                    setScheduleEditor(false);
                }}
                                onCancel={() => setScheduleEditor(false)}
                                schedule={source.defaultSchedule ? source.defaultSchedule : new Array<ScheduleElement>()}
                                open={scheduleEditor}/>

            </Grid>
            <Grid item xs={12}>
                <Divider/>
                <DialogActions>
                    <LoadingButton loading={loading} onClick={saveSource}>
                        Сохранить
                    </LoadingButton>
                </DialogActions>
            </Grid>
        </Grid>
    );

}

