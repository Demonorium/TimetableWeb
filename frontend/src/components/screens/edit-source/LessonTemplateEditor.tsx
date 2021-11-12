import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {addTemplate, changeTemplate, removeTemplate} from "../../../store/sourceMap";
import {LessonTemplateDto} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {Grid, ListItemText, TextField} from "@mui/material";
import {EditorProps} from "../EditSource";


export default function LessonTemplateEditor(props: EditorProps<LessonTemplateDto>) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const defaultState = {
        id: -1,
        name: "",
        hours: 0,
        defaultTeachers: new Array<number>()
    }
    const [state, setState] = useState<LessonTemplateDto>(defaultState);

    const handleChange = (prop: keyof LessonTemplateDto) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (value.length > 50)
            value = value.substr(0, 50);

        setState({ ...state,
            [prop]: value
        });
    };

    const editor: Editor<LessonTemplateDto> = {
        onPartCreate: (item) => {
            axios.get("api/create/lessonTemplate", {
                auth: user,
                params: {
                    sourceId: props.source.source.id,
                    name: item.name,
                    note: item.note,
                }
            }).then((response) => {
                item.id = response.data;
                dispatch(addTemplate({item: item, source: props.source.source.id}))
            });
        },
        onPartUpdate: (item) => {
            axios.get("api/update/place", {
                auth: user,
                params: item
            }).then((response) => {
                dispatch(changeTemplate({item: item, source: props.source.source.id}))
            });
        },

        createPartFromUI: () => state,
        isPartChanged: (prev, next) => {
            const set = ['id', 'note', 'auditory', 'building'];
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
                    <TextField fullWidth label="Название" defaultValue={state.name} onChange={handleChange("name")}/>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Заметка" defaultValue={state.note} onChange={handleChange("note")}/>
                </Grid>
            </Grid>
        )
    }

    return <ItemListEditor<LessonTemplateDto>
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список мест проведения занятий"}
        list={props.source.templates}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText primary={item.name} secondary={item.note} />
        }
        remove={(item) => {
            axios.get("api/delete/place", {
                auth: user,
                params: {id: item.id}
            }).then(() => {
                dispatch(removeTemplate({item: item, source: props.source.source.id}))
            });
        }}
        editorTitle="Место проведения занятия"
        editor={editor}
    />;
}