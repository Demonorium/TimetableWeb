import * as React from 'react';
import {Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography} from "@mui/material";
import {DatePicker} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {EditSourceParams} from "../EditSource";
import {updateSource} from "../../../store/sourceMap";
import dayjs from "dayjs";
import {Source, Week} from "../../../database";

interface SourceTitleProps {
    source: Source;
}

export default function SourceTitle({source}: SourceTitleProps) {
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;
    const dispatch = useAppDispatch();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSource({
            ...source,
            name: event.target.value
        }));
    };

    return (
        <Grid container spacing={2} sx={{marginTop: "0"}}>
            <Grid item xs={12}>
                <Typography variant="h6">Редактирование источника</Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField fullWidth label="Название источника" defaultValue={source.name} onChange={handleInput}/>
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

            <Grid item xs={4}>
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
            </Grid>
        </Grid>
    );

}

