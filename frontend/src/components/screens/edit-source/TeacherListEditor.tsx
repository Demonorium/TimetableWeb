import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {addTeacher, changeTeacher, removeTeacher} from "../../../store/sourceMap";
import {Teacher} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {Grid, ListItemText, TextField} from "@mui/material";
import {EditorProps} from "../EditSource";


export default function TeacherListEditor(props: EditorProps<Teacher>) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const defaultState: Teacher = {
        id: -1,
        source: props.source.source.id,
        name: "",
        position: ""
    }
    const [state, setState] = useState<Teacher>(defaultState);

    const handleChange = (prop: keyof Teacher) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (value.length > 50)
            value = value.substr(0, 50);

        setState({ ...state,
            [prop]: value
        });
    };

    const editor: Editor<Teacher> = {
        onPartCreate: (item) => {
            axios.get("api/create/teacher", {
                auth: user,
                params: {
                    sourceId: props.source.source.id,

                    note: item.note,
                    name: item.name,
                    position: item.position
                }
            }).then((response) => {
                item.id = response.data;
                dispatch(addTeacher({item: item, source: props.source.source.id}))
            });
        },
        onPartUpdate: (item) => {
            axios.get("api/update/teacher", {
                auth: user,
                params: item
            }).then((response) => {
                dispatch(changeTeacher({item: item, source: props.source.source.id}))
            });
        },

        createPartFromUI: () => state,
        isPartChanged: (prev, next) => {
            const set = ['id', 'note', 'name', 'position'];
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
                <Grid item xs={8}>
                    <TextField fullWidth label="ФИО" defaultValue={state.name} onChange={handleChange("name")}/>
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth label="Должность" defaultValue={state.position} onChange={handleChange("position")}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Заметка" defaultValue={state.note} onChange={handleChange("note")}/>
                </Grid>
            </Grid>
        )
    }

    return <ItemListEditor<Teacher>
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список преподавателей"}
        list={props.source.teachers}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText primary={item.name + " (" + item.position + ")"} secondary={item.note} />
        }
        remove={(item) => {
            axios.get("api/delete/teacher", {
                auth: user,
                params: {id: item.id}
            }).then(() => {
                dispatch(removeTeacher({item: item, source: props.source.source.id}))
            });
        }}
        editorTitle="Преподаватель"
        editor={editor}
    />;
}