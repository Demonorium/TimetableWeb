import * as React from 'react';
import {useState} from 'react';
import {compareEntity, Day, ID, Lesson, LessonTemplate, Place, Teacher} from "../../../database";
import ModalEditor, {Editor} from "../../modals/ModalEditor";
import {
    Button,
    DialogActions,
    Divider,
    Grid,
    IconButton,
    List,
    ListItemText,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import SortableArray from "../../../utils/sortableUtils";
import {ReactSortable} from "react-sortablejs";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {EditorProps} from "../EditSource";
import EditIcon from "@mui/icons-material/Edit";
import {Close, Delete} from "@material-ui/icons";
import SelectField from "../../utils/SelectField";
import LessonTemplateEditor from "./LessonTemplateEditor";
import {addElement, arrayEq, containsElement, removeElement, replaceElement} from "../../../utils/arrayUtils";
import PlaceListEditor from "./PlaceListEditor";
import Selector from "../../modals/Selector";
import TeacherListEditor from "./TeacherListEditor";
import {useAppSelector} from "../../../store/hooks";
import {LoadingButton} from "@mui/lab";


interface LessonEditorProps {
    open: boolean;
    item?: Lesson;
    requestClose: (item?: Lesson) => void;
}

function LessonEditor({open, item, requestClose}: LessonEditorProps) {
    const maps = useAppSelector(state => state.sourceMap);

    const defaultState: Lesson = {
        id: -1,

        template: -1,
        place: -1,
        teachers: new Array<ID>(),

        number: -1,
        day: -1,
    }
    const [state, setState] = useState(item ? item : defaultState);
    const [teacherSelector, openSelector] = useState(false);

    const template = maps.templates[state.template];
    const place = maps.places[state.place];


    const editor: Editor<Lesson> = {
        changeItem(item: Lesson | undefined): void {
            setState(item ? item : defaultState);
        },

        createPartFromUI(): Lesson | undefined {
            return (state.template && state.place) ? state : undefined;
        },

        isPartChanged(prev: Lesson, next: Lesson): boolean {
            const set = ['id', 'number', 'template', 'place', 'day'];
            for (let i in set) {
                const key: string = set[i];

                // @ts-ignore
                if (prev[key] != next[key])
                    return true;
            }
            return !arrayEq(prev.teachers, next.teachers);
        },

        async onPartCreate(item: Lesson) {
            return item;
        },
        async onPartUpdate(item: Lesson) {
            return item;
        },

        UI: (
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <SelectField<LessonTemplate>
                        label="Предмет"
                        valueToString={(template) => template ? template.name : undefined}
                        startValue={template}
                        setValue={(value) => {
                            if (value != undefined) {
                                setState({...state, template: value.id});
                            }
                        }}
                    >
                        {(item) => <LessonTemplateEditor {...item}/>}
                    </SelectField>
                </Grid>
                <Grid item xs={6}>
                    <SelectField<Place>
                        label="Место проведения"
                        valueToString={(place) => place ? (place.auditory + " / " + place.building) : undefined}
                        startValue={place}
                        setValue={(value) => {
                            if (value != undefined) {
                                setState({...state, place: value.id});
                            }
                        }}
                    >
                        {(item) => <PlaceListEditor {...item}/>}
                    </SelectField>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={8}>
                            <Typography variant="h5">Преподаватели</Typography>
                        </Grid>
                        <Grid item xs={4} sx={{textAlign:"right"}}>
                            <Button variant="outlined" onClick={() => {openSelector(true)}}>
                                Добавить
                            </Button>
                        </Grid>
                    </Grid>

                    <Divider/>

                    <Paper elevation={2}>
                        <List sx={{maxHeight: "300px", minHeight: "300px", overflow: "hidden scroll"}}>
                            {state.teachers.map((itemId: number, index) => {
                                const teacher = maps.teachers[itemId];

                                return (<ButtonWithFadeAction actions={
                                        <Tooltip title="Удалить" arrow>
                                            <IconButton
                                                onClick={() => setState(state => {
                                                    return {...state, teachers: removeElement(state.teachers, itemId, (o1, o2)=>o1==o2)}
                                                })}>
                                                <Close/>
                                            </IconButton>
                                        </Tooltip>
                                    }>
                                        <ListItemText primary={teacher.name + (teacher.position.length > 0 ? " (" + teacher.position + ")" : "")}
                                                      secondary={teacher.note}/>
                                    </ButtonWithFadeAction>
                                );
                            })}
                        </List>
                    </Paper>
                    <Divider/>
                </Grid>
                <Selector<Teacher> open={teacherSelector} returnFunction={(teacher) => {
                    setState({...state, teachers: addElement(state.teachers, teacher != undefined ? teacher.id : undefined)});
                    openSelector(false);
                }} exclude={(element) => containsElement(state.teachers, (i)=>i == element.id)}>
                    {(props: EditorProps<Teacher>) => <TeacherListEditor {...props}/>}
                </Selector>
            </Grid>
        )
    };

    return <ModalEditor editor={editor}
                        title={"Урок"}
                        isSelect={false}
                        item={state}
                        open={open}
                        requestClose={requestClose}
            />
}


interface DayScheduleEditorProps {
    day?: Day;
    onCancel?: () => void;
    onSave: (item: Day) => Promise<string>;
    onReset?: () => void;
}


export default function DayScheduleEditor({day, onCancel, onReset, onSave}: DayScheduleEditorProps) {
    const maps = useAppSelector(state => state.sourceMap);

    const defaultState: Day = day ? day : {
        id: -1,
        source: -1,
        lessons: new Array<Lesson>()
    };

    const [state, setState] = useState(day ? day: defaultState);

    const [editLesson, setEditLesson] = useState(false);
    const [lessonToEdit, setLessonToEdit] = useState<Lesson | undefined>(undefined);

    const [loading, setLoading] = useState(false);

    const sortableArray = new SortableArray("lesson", "number", state.lessons);
    sortableArray.onArrayUpdate = (array) => {
        setState(
            {
                ...state,
                lessons: array
            }
        )
    }

    sortableArray.onRender = (item) => {
        const template = maps.templates[item.object.template];
        const place = maps.places[item.object.place];

        return (
            <ButtonWithFadeAction actions={
                <Stack>
                    <IconButton onClick={() => {
                        setEditLesson(true);
                        setLessonToEdit(item.object);
                    }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={()=>{
                        setState({
                            ...state,
                            lessons: removeElement<Lesson>(state.lessons, item.object, compareEntity)
                        });
                    }}>
                        <Delete/>
                    </IconButton>
                </Stack>
            }>
                <ListItemText primary={template.name} secondary={place.auditory + " / " + place.building}/>
            </ButtonWithFadeAction>
        );
    }

    return (
        <>
            <LessonEditor open={editLesson} item={lessonToEdit} requestClose={(item) => {
                setEditLesson(false);
                setLessonToEdit(undefined);
                if (item) {
                    setState({
                        ...state,
                        lessons: replaceElement<Lesson>(state.lessons, item, compareEntity)
                    });
                }
            }}/>
            <Grid container>
                <Grid item xs={8}>
                    <Typography variant="h5">Уроки</Typography>
                </Grid>
                <Grid item xs={4} sx={{textAlign:"right"}}>
                    <Button variant="outlined" onClick={() => {setLessonToEdit(undefined); setEditLesson(true); }}>
                        Добавить
                    </Button>
                </Grid>
            </Grid>

            <Divider/>

            <Paper elevation={4}>
                <List>
                    <ReactSortable>
                        {sortableArray.render()}
                    </ReactSortable>
                </List>
            </Paper>

            <DialogActions>
                {
                    onCancel ?
                        <Button onClick={onCancel}>
                            Отмена
                        </Button> : undefined
                }
                {
                    onReset ?
                        <Button onClick={() => {
                            setState(defaultState);
                            onReset();
                        }}>
                            Сбросить изменения
                        </Button> : undefined
                }

                <LoadingButton loading={loading} onClick={() => {
                    setLoading(true);
                    onSave(state).then( (s) => {
                        setLoading(false);
                    }).catch( (s) => {
                        setLoading(false);
                    });
                }}>
                    Сохранить
                </LoadingButton>

            </DialogActions>
        </>
    );

}