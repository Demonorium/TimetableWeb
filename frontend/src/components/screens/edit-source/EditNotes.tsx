import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {addNote, changeNote, removeNote} from "../../../store/sourceMap";
import {Note} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {Grid, ListItemText, TextField} from "@mui/material";
import {EditorProps} from "../EditSource";
import {addElement} from "../../../utils/arrayUtils";
import {DatePicker} from "@mui/lab";
import dayjs from "dayjs";


export default function EditNotes(props: EditorProps<Note>) {
    const user = useAppSelector(state => state.user);
    const maps = useAppSelector(state => state.sourceMap);
    const dispatch = useAppDispatch();

    const defaultState: Note = {
        id: -1,
        source: props.source.id,
        text: "",
        date: -9999999
    }

    const [state, setState] = useState<Note>(defaultState);
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (prop: keyof Note) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (value.length > 4095)
            return;

        setState({ ...state,
            [prop]: value
        });
    };

    const editor: Editor<Note> = {
        onPartCreate: async (item) => {
            await axios.get("api/create/note", {
                auth: user,
                params: {
                    ...item,
                    sourceId: item.source,
                }
            }).then((response) => {
                item.id = response.data;
                dispatch(addNote({item: item, source: item.source}))
            });
            return item;
        },
        onPartUpdate: async (item) => {
            await axios.get("api/update/note", {
                auth: user,
                params: item
            }).then((response) => {
                dispatch(changeNote({item: item, source: item.source}))
            });
            return item;
        },

        createPartFromUI: () => {
            if (state.date == -9999999)
                return undefined;
            if (state.text.length == 0)
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
                        label="Целевая дата для заметки"
                        views={['year', 'month', 'day']}
                        value={state.date == -9999999 ? null : dayjs(state.date)}
                        onChange={(newValue: dayjs.Dayjs) => {
                            setState({
                                ...state,
                                date: newValue != null ? newValue.valueOf() : -9999999
                            });
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth multiline minRows={10} label="Заметка" value={state.text} onChange={handleChange("text")}/>
                </Grid>
            </Grid>
        )
    }

    const notes = addElement(props.source.notes);
    notes.sort((e1, e2) => e1.date - e2.date);

    return <ItemListEditor<Note>
        rights={props.source.rights}
        titleFormat={props.titleFormat}
        exclude={props.exclude}
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список заданий/заметок"}
        list={notes}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText
                primary={item.text.substring(0, Math.min(30, item.text.length)) + (item.text.length > 30 ? "...": "")}
                secondary={dayjs(item.date).format("DD.MM.YYYY")} />
        }
        remove={(item) => {
            axios.get("api/delete/note", {
                auth: user,
                params: {id: item.id}
            }).then(() => {
                dispatch(removeNote({item: item, source: props.source.id}))
            });
        }}
        editorTitle="Заметка/Задание"
        editor={editor}
    />;
}