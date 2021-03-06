import * as React from 'react';
import {useEffect, useState} from 'react';
import {Grid, ListItemText, TextField} from "@mui/material";
import {compareEntity, Rights, ScheduleElement} from "../../database";
import ItemListEditor from "../screens/edit-source/ItemListEditor";
import {addElement, containsElement, removeElement, replaceElement} from "../../utils/arrayUtils";
import {Editor} from "./ModalEditor";
import {timeToStr} from "../../utils/time";
import DialogTemplate from "./DialogTemplate";

interface ScheduleEditorProps {
    onAccept: (schedule: Array<ScheduleElement>) => void;
    onCancel: () => void;

    schedule: Array<ScheduleElement>;
    open: boolean;
    rights: Rights;
}

function clamp(v: number, a: number, b: number) {
    if (v < a)
        return a;
    if (v >= b)
        return b-1;
    return  v;
}

export default function ScheduleEditor({rights, onAccept, onCancel, schedule, open}: ScheduleEditorProps) {
    const [state, setState] = useState<Array<ScheduleElement>>(schedule);
    const [idCounter, setIdCounter] = useState<number>(0);
    const defaultScheduleElement: ScheduleElement = {
        id:-1,
        hour: 0,
        minute: 0,
        time: 0
    }

    const [edited, setEdited] = useState<ScheduleElement>(defaultScheduleElement);

    useEffect(() => {
        if (open) {
            setState(schedule);
            let id = idCounter;
            for (let i = 0; i < schedule.length; ++i) {
                if (schedule[i].id > id)
                    id = schedule[i].id;
            }
            setIdCounter(id);
        }
    }, [open])

    const handleChange = (prop: keyof ScheduleElement) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof (event.target.value) == 'string') {
            const newValue: ScheduleElement = { ...edited,
                [prop]: parseInt(event.target.value)
            };

            setEdited(newValue);
        } else {
            const newValue: ScheduleElement = { ...edited,
                [prop]: event.target.value
            };

            setEdited(newValue);
        }
    };

    const editor: Editor<ScheduleElement> = {

        changeItem: (item: ScheduleElement | undefined) => {
            setEdited(item ? item : defaultScheduleElement);
        },

        createPartFromUI: () => {
            const newElement: ScheduleElement = {
                id: edited.id,
                hour: edited.hour,
                minute: edited.minute,
                time: (edited.hour << 8) | edited.minute
            }

            if ((clamp(newElement.hour, 0, 24) != newElement.hour)
                ||(clamp(newElement.minute, 0, 60) != newElement.minute)
                || containsElement(state, (e) => e.time == newElement.time)) {
                return undefined;
            }

            return newElement;
        },

        isPartChanged: (prev: ScheduleElement, next: ScheduleElement) => {
            const set = ['id', 'hour', 'minute'];
            for (let i in set) {
                const key: string = set[i];

                // @ts-ignore
                if (prev[key] != next[key])
                    return true;
            }

            return false;
        },

        onPartCreate: async (item: ScheduleElement) =>  {
            item.id = idCounter + 1;
            setIdCounter(item.id);

            const newState = addElement<ScheduleElement>(state, item);
            newState.sort((e1, e2) => e1.time - e2.time);
            setState(newState);

            return item;
        },

        onPartUpdate: async (item: ScheduleElement) => {
            const newState = replaceElement<ScheduleElement>(state, item, compareEntity);
            newState.sort((e1, e2) => e1.time - e2.time);
            setState(newState);

            return item;
        },

        UI: (
            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <TextField fullWidth type="number" label="????????" defaultValue={edited.hour} onChange={handleChange("hour")}/>
                </Grid>

                <Grid item xs={6}>
                    <TextField fullWidth type="number" label="????????????" defaultValue={edited.minute} onChange={handleChange("minute")}/>
                </Grid>
            </Grid>
        )
    }

    return (
        <DialogTemplate open={open}
                        close={() => onCancel()}
                        cancel={async () => onCancel()}
                        reset={async () => setState(schedule)}
                        accept={async () => onAccept(state)}
                        acceptText="??????????????????">

            <ItemListEditor<ScheduleElement>
                rights={rights}
                listTitle="???????????????????? ??????????????"
                list={state}
                isSelect={false}
                constructor={(e, i) => {
                    return (
                        <ListItemText primary={e.hour + ":" + timeToStr(e.minute)} secondary={
                            i % 2 == 0 ? "???????????? ??????????????" : "?????????? ??????????????"
                        }/>
                    )
                }}
                remove={(e) => {setState(removeElement<ScheduleElement>(state, e, (e1, e2) => e1.time == e2.time))}}
                editorTitle={"????????????"}
                editor={editor}/>
        </DialogTemplate>
    );
}