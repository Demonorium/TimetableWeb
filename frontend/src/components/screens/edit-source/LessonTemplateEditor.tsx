import * as React from 'react';
import {useState} from 'react';
import ItemListEditor from "./ItemListEditor";
import {addTemplate, changeTemplate, removeTemplate} from "../../../store/sourceMap";
import {compareEntity, LessonTemplateDto, Teacher} from "../../../database";
import axios from "axios";
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {Editor} from "../../modals/ModalEditor";
import {
    Button,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    List,
    ListItemText,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {EditorProps} from "../EditSource";
import {addElement, arrayEq, containsElement, findElement, removeElement} from "../../../utils/arrayUtils";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {Close} from "@material-ui/icons";
import sources from "../../../store/sources";
import Selector from "../../modals/Selector";
import TeacherListEditor from "./TeacherListEditor";


export default function LessonTemplateEditor(props: EditorProps<LessonTemplateDto>) {
    const user = useAppSelector(state => state.user);
    const maps = useAppSelector(state => state.sourceMap);
    const dispatch = useAppDispatch();

    const defaultState = {
        id: -1,
        name: "",
        hours: 0,
        defaultTeachers: new Array<number>()
    }
    const [state, setState] = useState<LessonTemplateDto>(defaultState);
    const [open, setOpen] = useState<boolean>(false);

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
            axios.get("api/update/lessonTemplate", {
                auth: user,
                params: item
            }).then((response) => {
                dispatch(changeTemplate({item: item, source: props.source.source.id}))
            });
        },

        createPartFromUI: () => state,
        isPartChanged: (prev, next) => {
            const set = ['id', 'note', 'name', 'hours'];
            for (let i in set) {
                const key: string = set[i];

                // @ts-ignore
                if (prev[key] != next[key])
                    return true;
            }
            return !arrayEq(prev.defaultTeachers, next.defaultTeachers);
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
                <Grid item xs={6}>
                    <Typography variant="h5">Количество часов</Typography>
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth defaultValue={state.hours} onChange = {handleChange("hours")}
                               type="number"/>
                </Grid>

                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography variant="h5">Преподаватели</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign:"right"}}>
                            <Button variant="outlined" onClick={() => {setOpen(true)}}>
                                Добавить
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider/>

                    <List sx={{maxHeight: "300px", minHeight: "300px", overflow: "hidden scroll"}}>
                        {state.defaultTeachers.map((itemId: number, index) => {
                            const teacher = maps.teachers[itemId];

                            return (<ButtonWithFadeAction actions={
                                    <Tooltip title="Удалить" arrow>
                                        <IconButton
                                            onClick={() => setState(state => {
                                                return {...state, defaultTeachers: removeElement(state.defaultTeachers, itemId, (o1, o2)=>o1==o2)}
                                            })}>
                                            <Close/>
                                        </IconButton>
                                    </Tooltip>
                                }>
                                    <ListItemText primary={teacher.name + " (" + teacher.position + ")"}
                                                  secondary={teacher.note}/>
                                </ButtonWithFadeAction>
                            );
                        })}
                    </List>
                    <Divider/>
                </Grid>
                <Selector<Teacher> open={open} returnFunction={(teacher) => {
                    setState({...state, defaultTeachers: addElement(state.defaultTeachers, teacher ? teacher.id : undefined)});
                    setOpen(false);
                }} exclude={(element) => containsElement(state.defaultTeachers, (i)=>i == element.id)}>
                    {(props: EditorProps<Teacher>) => <TeacherListEditor {...props}/>}
                </Selector>
            </Grid>
        )
    }

    return <ItemListEditor<LessonTemplateDto>
        exclude={props.exclude}
        requestClose={props.requestClose}
        listTitle={props.overrideTitle? props.overrideTitle : "Список предметов"}
        list={props.source.templates}
        isSelect={props.isSelect}
        constructor={(item, index) =>
            <ListItemText primary={item.name} secondary={item.note} />
        }
        remove={(item) => {
            axios.get("api/delete/lessonTemplate", {
                auth: user,
                params: {id: item.id}
            }).then(() => {
                dispatch(removeTemplate({item: item, source: props.source.source.id}))
            });
        }}
        editorTitle="Предмет"
        editor={editor}
    />;
}