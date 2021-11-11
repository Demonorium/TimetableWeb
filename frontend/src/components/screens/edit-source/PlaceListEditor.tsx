import * as React from 'react';
import ItemListEditor from "./ItemListEditor";
import {SourcesRepresentation} from "../../../store/sourceMap";
import {Place} from "../../../database";
import axios from "axios";
import {useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {MutableRefObject, useEffect, useRef, useState} from "react";
import {Grid, ListItemText, TextField, Typography} from "@mui/material";


interface PlaceListEditorProps {
    isSelect: boolean;
    source: SourcesRepresentation;
    /**
     * Закрыть это окно
     */
    requestClose?: (item: Place) => {};
}

export default function PlaceListEditor(props: PlaceListEditorProps) {
    const user = useAppSelector(state => state.user);
    const defaultState = {
        id: -1,
        source: props.source.source.id,
        building: "",
        auditory: ""
    }
    const [state, setState] = useState<Place>(defaultState);
    const handleChange = (prop: keyof Place) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({ ...state,
            [prop]: event.target.value
        });
    };

    const editor: Editor<Place> = {
        onPartCreate: (item) => {
            axios.get("api/create/place", {
                auth: user,
                params: {
                    sourceId: props.source.source.id,

                    note: item.note,
                    auditory: item.auditory,
                    building: item.building
                }
            });
        },
        onPartUpdate: (item) => {
            axios.get("api/create/place", {
                auth: user,
                params: item
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
        changeItem(item: Place | undefined): void {
            if (item == undefined) {
                setState(defaultState);
            } else {
                setState(item);
            }
        },


        UI: (
         <Grid container spacing={2}>
             <Grid item xs={4}>
                 <Typography variant="body1">Место: </Typography>
             </Grid>
             <Grid item xs={4}>
                 <TextField fullWidth label="Аудитория" defaultValue={state.auditory} onChange={handleChange("auditory")}/>
             </Grid>
             <Grid item xs={4}>
                 <TextField fullWidth label="Здание / Корпус" defaultValue={state.building} onChange={handleChange("building")}/>
             </Grid>
             <Grid item xs={12}>
                 <TextField fullWidth label="Заметка" defaultValue={state.note} onChange={handleChange("note")}/>
             </Grid>
         </Grid>
        )
    }

    return <ItemListEditor<Place>
        requestClose={props.requestClose}
        listTitle="Список мест проведения занятий"
        list={props.source.places}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText primary={item.auditory + " / " + item.building} secondary={item.note} />
        }
        remove={(item) => {
            axios.get("api/delete/place", {
                auth: user,
                params: {id: item.id}
            });
        }}
        editorTitle="Место проведения занятия"
        editor={editor}
         />;
}