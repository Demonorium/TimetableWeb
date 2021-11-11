import * as React from 'react';
import {Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography} from "@mui/material";
import {DatePicker} from "@mui/lab";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {EditSourceParams} from "../EditSource";
import {SourcesRepresentation, updateSource} from "../../../store/sourceMap";
import dayjs from "dayjs";

interface SourceTitleProps {
    source: SourcesRepresentation;
}

export default function SourceTitle({source}: SourceTitleProps) {
    const params = useAppSelector(state => state.app.screen.params) as EditSourceParams;
    const dispatch = useAppDispatch();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSource({
            ...source,
            "source": {...source.source,
                "name": event.target.value
            }
        }));
    };

    return (
        <Grid container spacing={2} sx={{marginTop: "0"}}>
            <Grid item xs={12}>
                <Typography variant="h6">Редактирование источника</Typography>
            </Grid>

            <Grid item xs={12}>
                <TextField fullWidth label="Название источника" defaultValue={source.source.name} onChange={handleInput}/>
            </Grid>
            <Grid item xs={6}>
                <DatePicker
                    label="Дата начала занятий"
                    views={['year', 'month', 'day']}
                    value={dayjs(source.source.startDate)}
                    onChange={(newValue: dayjs.Dayjs) => {
                        if (newValue != null) {
                            dispatch(updateSource({
                                ...source,
                                "source": {...source.source,
                                    "startDate": newValue.valueOf()
                                }
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
                    value={source.source.endDate == null ? null : dayjs(source.source.endDate)}
                    onChange={(newValue: dayjs.Dayjs) => {
                        if (newValue != null) {
                            dispatch(updateSource({
                                ...source,
                                "source": {...source.source,
                                    "endDate": newValue.valueOf()
                                }
                            }));
                        } else {
                            dispatch(updateSource({
                                ...source,
                                "source": {...source.source,
                                    "endDate": undefined
                                }
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
                    value={source.source.startWeek}
                    onChange={(event: SelectChangeEvent<number>) => {
                        dispatch(updateSource({
                            ...source,
                            "source": {...source.source,
                                "startWeek": typeof(event.target.value) == "number"? event.target.value as number : 0
                            }
                        }));
                    }}
                    fullWidth
                    disabled={source.weeks.length < 2}
                >
                    {source.weeks.length < 2 ? <MenuItem value={source.source.startWeek}>1</MenuItem>: source.weeks.map((value, index) =>  <MenuItem value={value.number}>{index+1}</MenuItem>)}
                </Select>

            </Grid>
        </Grid>
    );

}

