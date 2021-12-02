import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {
    addChanges,
    addDay,
    addNote,
    addTemplate, changeDay,
    changeNote,
    changeTemplate, removeChanges,
    removeNote,
    removeTemplate,
    updateSource
} from "../../../store/sourceMap";
import {ChangesInfo, Day, Lesson, LessonTemplate, Note, Rights, Teacher, Week, WeekDay} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import ModalEditor, {Editor} from "../../modals/ModalEditor";
import {
    Button,
    Divider,
    Grid,
    IconButton,
    List, ListItem,
    ListItemText,
    Paper, Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {EditorProps} from "../EditSource";
import {addElement, arrayEq, containsElement, findElement, removeElement} from "../../../utils/arrayUtils";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {Close} from "@material-ui/icons";
import Selector from "../../modals/Selector";
import TeacherListEditor from "./TeacherListEditor";
import {DatePicker, LoadingButton} from "@mui/lab";
import dayjs from "dayjs";
import DayScheduleEditor from "./DayScheduleEditor";
import {Simulate} from "react-dom/test-utils";
import DayEdit from "../../modals/DayEdit";

interface ChangesInfoExtended extends ChangesInfo {
    dayValue: Day;
}

export default function EditChanges(props: EditorProps<ChangesInfoExtended>) {
    const user = useAppSelector(state => state.user);
    const maps = useAppSelector(state => state.sourceMap);
    const dispatch = useAppDispatch();

    const defaultState: ChangesInfoExtended = {
        day: -1,
        date: -9999999,
        dayValue: {
            id: -1,
            source: -1,
            lessons: new Array<Lesson>()
        }
    }


    const [state, setState] = useState<ChangesInfoExtended>(defaultState);
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (prop: keyof ChangesInfoExtended) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        setState({ ...state,
            [prop]: parseInt(value)
        });
    };

    const editor: Editor<ChangesInfoExtended> = {
        onPartCreate: async (item) => {
            await axios.get("api/create/changes", {
                auth: user,
                params: {
                    date: item.date,
                    sourceId: props.source.id,
                }
            }).then((response) => {
                const day = {
                    id: response.data.day,
                    source: props.source.id,
                    lessons: new Array<Lesson>()
                };
                item.day = response.data.day;
                item.dayValue = {
                    id: item.day,
                    source: props.source.id,
                    lessons: new Array<Lesson>()
                }
                dispatch(addChanges({day: response.data.day, date: item.date}));
            });
            return item;
        },
        onPartUpdate: async (item) => {
            await axios.get("api/update/day", {
                auth: user,
                params: item.dayValue
            }).then((response) => {
                dispatch(changeDay({item: item.dayValue, source: props.source.id}))
            });
            return item;
        },

        createPartFromUI: () => {
            if (state.date == -9999999)
                return undefined;

            return state;
        },
        isPartChanged: (prev, next) => {
            const set = ['id', 'text', 'date'];
            for (let i in set) {
                const key: string = set[i];

                // @ts-ignore
                if (prev[key] != next[key])
                    return true;
            }
            return false;
        },

        changeItem(item): void {
            if (item == undefined) {
                setState(defaultState);
            } else {
                setState(item);
            }
        },

        UI: (
            <Grid container spacing={2}>
            </Grid>
        )
    }

    const changes = props.source.changes.map((change) => ({
        ...change,
        dayValue: maps.days[change.day]
    }));
    changes.sort((e1, e2) => e1.date - e2.date);

    const [index, setIndex] = useState(-1);
    const createChanges = async () => {
        const data = (await axios.get("api/create/changes", {
            auth: user,
            params: {
                sourceId: props.source.id,
                date: state.date
            }
        })).data;

        const findDay = () => {
            const dayOfWeek = dayjs(state.date).day();
            const weekNumber = Math.abs(Math.floor(dayjs(state.date).diff(dayjs(props.source.startDate), "weeks", true))) % props.source.weeks.length;

            const week = findElement<Week>(props.source.weeks, (week) => week.number == weekNumber);

            if (!week)
                return undefined;

            const day = findElement<WeekDay>(week.days, (day) => day.number == dayOfWeek);

            if (!day)
                return undefined;

            return maps.days[day.day];
        }

        const day = findDay();

        // @ts-ignore
        dispatch(addChanges({
            day: day ? {
                ...day,
                id: data.day
            } : {
                id: data.day,
                source: props.source.id,
                lessons: new Array<Lesson>()
            },
            date: state.date
        }));

        return data.day;
    };

    return (
        <>
            <DayEdit day={(index >= 0) ? maps.days[changes[index].day] : undefined } open={index >= 0} close={(day) => {
                setIndex(-1);
            }} source={props.source} createDay={createChanges} date={(index < 0) ? "" : dayjs(changes[index].date).format("DD.MM.YYYY")}/>

            <ListItem secondaryAction={
                ((props.source.rights == Rights.OWNER) || (props.source.rights == Rights.READ_UPDATE) || (props.source.rights == Rights.UPDATE))
                    ?
                    <Stack direction="row">
                        <DatePicker
                            label="Дата изменений"
                            views={['year', 'month', 'day']}
                            value={state.date == -9999999 ? null : dayjs(state.date)}
                            onChange={(newValue: dayjs.Dayjs) => {
                                setState({
                                    ...state,
                                    date: newValue != null ? newValue.valueOf() : -9999999
                                });
                            }}
                            readOnly={state.day != -1}
                            renderInput={(params) => <TextField {...params} fullWidth/>}
                        />
                        <LoadingButton variant="outlined" disabled={state.date == -9999999} onClick={() => {
                            createChanges();
                        }}>
                            Создать
                        </LoadingButton>
                    </Stack>

                    : undefined
            } sx={{paddingBottom: "20px"}}>
                <Typography variant={props.titleFormat? props.titleFormat : "h5"}>Изменения в расписании</Typography>
            </ListItem>
            <Divider/>
            <List>
                {
                    changes.length == 0 ? <ListItem sx={{textAlign:"center", display: "block"}}>Нет объектов</ListItem> :
                        changes.map((item, index) => {
                            if (props.exclude && props.exclude(item))
                                return undefined;
                            return (
                                <>
                                    <ButtonWithFadeAction
                                        actions={
                                            (props.source.rights == Rights.OWNER)
                                                ?
                                                <Tooltip title="Удалить" arrow>
                                                    <IconButton onClick={() => {
                                                        axios.get("/api/delete/changes", {
                                                            auth: user,
                                                            params: {
                                                                date: item.date,
                                                                sourceId: props.source.id
                                                            }
                                                        }).then(() => {
                                                            dispatch(removeChanges({
                                                                source: props.source.id,
                                                                item: item.date
                                                            }));
                                                        });
                                                    }}>
                                                        <Close />
                                                    </IconButton>
                                                </Tooltip>
                                                : <Typography>

                                                </Typography>
                                        }
                                        onClick={() => {setIndex(index)}}>
                                        <ListItemText primary={dayjs(item.date).format("DD.MM.YYYY")}/>
                                    </ButtonWithFadeAction>
                                    {index == (changes.length - 1)? undefined: <Divider/>}
                                </>
                            );
                        })
                }
            </List>
        </>
    );
}