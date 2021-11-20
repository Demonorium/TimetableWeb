import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {addPlace, changePlace, removePlace} from "../../../store/sourceMap";
import {Place} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {Grid, ListItemText, TextField, Typography} from "@mui/material";
import {EditorProps} from "../EditSource";


export default function PlaceListEditor(props: EditorProps<Place>) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const defaultState: Place = {
        id: -1,
        source: props.source.id,
        building: "",
        auditory: ""
    }
    const [state, setState] = useState<Place>(defaultState);
    const handleChange = (prop: keyof Place) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value;
        if (value.length > 8) {
            if (prop == "building" || prop == "auditory")
                value = value.substr(0, 8);
            else if (value.length > 50)
                value = value.substr(0, 50);
        }
        setState({ ...state,
            [prop]: value
        });
    };

    const editor: Editor<Place> = {
        onPartCreate: async (item) => {
            await axios.get("api/create/place", {
                auth: user,
                params: {
                    ...item,
                    sourceId: item.source
                }
            }).then((response) => {
                item.id = response.data;
                dispatch(addPlace({item: item, source: item.source}))
            });
            return item;
        },
        onPartUpdate: async (item) => {
            await axios.get("api/update/place", {
                auth: user,
                params: item
            }).then((response) => {
                dispatch(changePlace({item: item, source: item.source}))
            });
            return item;
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
                 <Typography variant="h5">Место</Typography>
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
        titleFormat={props.titleFormat}
        exclude={props.exclude}
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список мест проведения занятий"}
        list={props.source.places}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText primary={item.auditory + " / " + item.building} secondary={item.note} />
        }
        remove={(item) => {
            axios.get("api/delete/place", {
                auth: user,
                params: {id: item.id}
            }).then(() => {
                dispatch(removePlace({item: item, source: props.source.id}))
            });
        }}
        editorTitle="Место проведения занятия"
        editor={editor}
         />;
}