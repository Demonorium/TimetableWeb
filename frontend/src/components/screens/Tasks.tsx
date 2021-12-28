import * as React from "react";
import {useState} from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {Divider, Grid, List, ListItemButton, ListItemText, Paper, TextField, Typography} from "@mui/material";
import {useAppSelector} from "../../store/hooks";
import {Note} from "../../database";
import dayjs from "dayjs";
import DialogTemplate from "../modals/DialogTemplate";

function getTaskDescription(note: Note) {
    return note.text.substring(0, Math.min(30, note.text.length)) + (note.text.length > 30 ? "..." : "");
}

export default function Tasks(props: ScreenInterface) {
    const tasks = useAppSelector(state => state.sourceMap.notes)

    const activeTasks = new Array<Note>();
    const prevTasks = new Array<Note>();

    const date = dayjs().valueOf();

    const [state, setState] = useState<Note | null>(null);

    for (let key in tasks) {
        const task = tasks[key];
        if (task.date < date) {
            prevTasks.push(task);
        } else {
            activeTasks.push(task);
        }
    }

    activeTasks.sort((e1, e2) => e1.date - e2.date);
    prevTasks.sort((e1, e2) => e2.date - e1.date)

    const renderNote = (note: Note) => (
        <ListItemButton key={note.id} onClick={() => setState(note)}>
            <ListItemText
                primary={getTaskDescription(note)}
                secondary={dayjs(note.date).format("YYYY.MM.DD")}
                />
        </ListItemButton>
    );

    return (
        <>
            <DialogTemplate open={state != null}
                            close={() => setState(null)}
                            title="Задание/Заметка">

                {state && <TextField fullWidth
                                     multiline
                                     minRows={10}
                                     label="Заметка"
                                     value={state.text}
                                     aria-readonly/>}
            </DialogTemplate>

            <TripleGrid leftMenu={props.menu}>

                <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "16px", marginTop: "32px"}}>

                    <Grid container spacing={2}>

                        <Grid item xs={6}>

                            <Typography variant="h6">
                                Актуальные задачи
                            </Typography>

                            <Divider />
                        </Grid>

                        <Grid item xs={6}>

                            <Typography variant="h6">
                                Предыдущие задачи
                            </Typography>

                            <Divider />
                        </Grid>

                        <Grid item xs={6}>

                            <List>

                                {activeTasks.map(renderNote)}
                            </List>
                        </Grid>

                        <Grid item xs={6}>

                            <List>

                                {prevTasks.map(renderNote)}
                            </List>
                        </Grid>
                    </Grid>
                </Paper>
            </TripleGrid>
    </>
    );
}