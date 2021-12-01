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
import {ChangesInfo, Day, Lesson, LessonTemplate, Note, Teacher} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {
    Button,
    Divider,
    Grid,
    IconButton,
    List,
    ListItemText,
    Paper,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {EditorProps} from "../EditSource";
import {addElement, arrayEq, containsElement, removeElement} from "../../../utils/arrayUtils";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {Close} from "@material-ui/icons";
import Selector from "../../modals/Selector";
import TeacherListEditor from "./TeacherListEditor";
import {DatePicker} from "@mui/lab";
import dayjs from "dayjs";
import DayScheduleEditor from "./DayScheduleEditor";
import {Simulate} from "react-dom/test-utils";

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
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12}>
                    <DayScheduleEditor source={props.source} createDay={async () => {
                        const data = (await axios.get("api/create/changes", {
                            auth: user,
                            params: {
                                sourceId: props.source.id,
                                date: state.date
                            }
                        })).data;


                        dispatch(addChanges({
                            day: {
                                id: data.day,
                                source: props.source.id,
                                lessons: new Array<Lesson>()
                            },
                            date: state.date
                        }));

                        return data.day;
                    }} index={open ? 1 : 0}/>
                </Grid>
            </Grid>
        )
    }

    const changes = props.source.changes.map((change) => ({
        ...change,
        dayValue: maps.days[change.day]
    }));

    return <ItemListEditor<ChangesInfoExtended>
        rights={props.source.rights}
        titleFormat={props.titleFormat}
        exclude={props.exclude}
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список заданий/заметок"}
        list={changes}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText
                primary={dayjs(item.date).format("YYYY.MM.DD")}
            />
        }
        remove={(item) => {
            axios.get("api/delete/changes", {
                auth: user,
                params: {
                    sourceId: props.source.id,
                    date: item.date
                }
            }).then(() => {
                dispatch(removeChanges({item: item.date, source: props.source.id}))
            });
        }}
        editorTitle="Заметка/Задание"
        editor={editor}
    />;
}