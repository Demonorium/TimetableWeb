import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    compareEntity,
    Day,
    ID,
    Lesson,
    LessonTemplate,
    Place, printScheduleElement,
    ScheduleElement,
    Source,
    Teacher
} from "../../../database";
import ModalEditor, {Editor} from "../../modals/ModalEditor";
import {
    Button, Container,
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
import {useAppDispatch, useAppSelector} from "../../../store/hooks";
import {LoadingButton} from "@mui/lab";
import {changeDay, updateSource} from "../../../store/sourceMap";
import ScheduleEditor from "../../modals/ScheduleEditor";
import axios from "axios";


interface LessonEditorProps {
    open: boolean;
    item?: Lesson;
    requestClose: (item?: Lesson) => void;
}

function LessonEditor({open, item, requestClose}: LessonEditorProps) {
    const maps = useAppSelector(state => state.sourceMap);

    const defaultState: Lesson = item ? item : {
        id: -1,

        template: -1,
        place: -1,
        teachers: new Array<ID>(),

        number: -1,
        day: -1,
    }

    const [state, setState] = useState(defaultState);
    const [teacherSelector, setTeacherSelector] = useState(false);

    const template = maps.templates[state.template];
    const place = maps.places[state.place];

    const editor: Editor<Lesson> = {
        changeItem(item: Lesson | undefined): void {
            setState(defaultState);
        },

        createPartFromUI(): Lesson | undefined {
            if ((state.template == -1)
                || (state.place == -1))
                return undefined;
            return state;
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
                            <Button variant="outlined" onClick={() => {setTeacherSelector(true)}}>
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
                    setTeacherSelector(false);
                }} exclude={(element) => containsElement(state.teachers, (i)=>i == element.id)}>
                    {(props: EditorProps<Teacher>) => <TeacherListEditor {...props}/>}
                </Selector>
            </Grid>
        )
    };

    useEffect(() => {
        if (open) {
            editor.changeItem(item)
        }
    }, [open]);

    return <ModalEditor editor={editor}
                        title={"Урок"}
                        isSelect={false}
                        item={state}
                        open={open}
                        requestClose={requestClose}
            />
}


interface TempDayRep {
    schedule: Array<ScheduleElement>;
    lessons: Array<Array<Lesson>>;
    scheduleExists: boolean;
}

function buildDayRep(source: Source, day?: Day): TempDayRep {
    const lessons = new Array<Array<Lesson>>();

    if (day) {
        const schedule = (day.schedule && (day.schedule.length > 0))
            ? day.schedule
            : (source.defaultSchedule ? source.defaultSchedule : new Array<ScheduleElement>());
        if (schedule.length > 0) {
            for (let i = 0; i < schedule.length; i += 2) {
                lessons.push(new Array<Lesson>());
            }

            if (schedule.length % 2 == 0)
                lessons.push(new Array<Lesson>());
        } else {
            lessons.push(new Array<Lesson>());
        }

        for (let i = 0; i < day.lessons.length; ++i) {
            const number = day.lessons[i].number;
            if (number < schedule.length) {
                lessons[number].push(day.lessons[i]);
            } else {
                lessons[lessons.length - 1].push(day.lessons[i]);
            }
        }

        return {
            lessons: lessons,
            schedule: schedule,
            scheduleExists: (day.schedule != undefined) && (schedule.length > 0)
        }
    }

    const schedule =    source.defaultSchedule ? source.defaultSchedule : new Array<ScheduleElement>();

    if (schedule.length > 0) {
        for (let i = 0; i < schedule.length; i += 2) {
            lessons.push(new Array<Lesson>());
        }

        if (schedule.length % 2 == 0)
            lessons.push(new Array<Lesson>());
    } else {
        lessons.push(new Array<Lesson>());
    }

    return {
        lessons: lessons,
        schedule: schedule,
        scheduleExists: false
    }
}



function buildDay(source: Source, dayId: number, rep: TempDayRep): Day {
    const lessons = new Array<Lesson>();

    let number = 0;
    for (let i = 0; i < rep.lessons.length; ++i) {
        if (rep.lessons[i].length > 0) {
            for (let j = 0; j < rep.lessons[i].length; ++j, ++number) {
                lessons.push({
                    ...rep.lessons[i][j],
                    number: number,
                    day: dayId
                });
            }
        } else {
            ++number;
        }
    }

    return {
        id: dayId,
        source: source.id,
        schedule: (rep.scheduleExists && (rep.schedule.length > 0)) ? rep.schedule : undefined,
        lessons: lessons
    };
}

interface DayScheduleEditorProps {
    day?: Day;
    source: Source;
    createDay: () => Promise<number>;


    index: number;
    onCancel?: () => void;
    onReset?: () => void;
}


export default function DayScheduleEditor({day, source, createDay, index, onCancel, onReset}: DayScheduleEditorProps) {
    const maps = useAppSelector(state => state.sourceMap);
    const map = useAppSelector(state => state.sourceMap);
    const user = useAppSelector(state => state.user);

    const dispatch = useAppDispatch();

    const defaultState: TempDayRep = buildDayRep(source, day);
    const [state, setState] = useState(defaultState);

    useEffect(() => {
        setState(defaultState);
    }, [index]);

    const [editLesson, setEditLesson] = useState(false);
    const [lessonToEdit, setLessonToEdit] = useState<Lesson | undefined>(undefined);

    const [scheduleEditor, setScheduleEditor] = useState(false);

    const [loading, setLoading] = useState(false);


    const saveDay = async (editDay: Day) => {
        const result = await axios.get("api/part-delete/day/lessons", {
            auth: user,
            params: {
                day: editDay.id
            }
        });

        const list = (editDay.lessons.map(async lesson => {
            return await axios.get("api/create/lesson", {
                auth: user,
                params: {
                    ...lesson,
                    day: editDay.id
                }
            }).then((response) => {
                lesson.id = response.data;
            });
        }));
        list.push(
            axios.get("api/part-update/day/timetable", {
                auth: user,
                params: {
                    id: editDay.id,
                    schedule: ((editDay.schedule) && (editDay.schedule.length > 0)) ? editDay.schedule.map((item)=>item.time): undefined
                }
            })
        )

        await Promise.all(list);

        const lessons = new Array<number>();
        console.log(lessons);
        if (editDay.lessons.length > 0) {
            for (let i = 0, c = 0; i < editDay.lessons.length; ++i, ++c) {
                if (editDay.lessons[i].number > c) {
                    lessons.push(-1);
                    --i;
                } else {
                    lessons.push(editDay.lessons[i].id);
                }
            }
        }

        await axios.get("api/part-update/day/lessonsOrder", {
            auth: user,
            params: {
                day: editDay.id,
                lessons: lessons
            }
        })

        dispatch(changeDay({source: source.id, item: {
                ...editDay,
                id: editDay.id
            }}));

        return "ok";
    };

    const getList = (list: number) => {
        if (list < state.lessons.length)
            return state.lessons[list];
        else
            return state.lessons[state.lessons.length - 1];
    }

    const setList = (list: number) => (array: Array<Lesson>) => {
        const oldArray = getList(list);
        setState({
            ...state,
            lessons: replaceElement(state.lessons, array, (e1, e2)=>e1 == oldArray)
        });
    }

    const renderLesson = (lesson: Lesson) => {
        const template = maps.templates[lesson.template];
        const place = maps.places[lesson.place];

        return (
            <ButtonWithFadeAction actions={
                <Stack direction="row">
                    <IconButton onClick={() => {
                        setEditLesson(true);
                        setLessonToEdit(lesson);
                    }}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={
                        ()=> setList(lesson.number)(
                            removeElement<Lesson>(getList(lesson.number), lesson,
                                        (l1, l2) => l1.number == l2.number)
                        )
                    }
                    >
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
            <LessonEditor open={editLesson} item={lessonToEdit} requestClose={(lesson) => {
                setEditLesson(false);
                if (lesson) {
                    if (lessonToEdit) {
                        setList(lesson.number)(
                            replaceElement<Lesson>(getList(lesson.number), lesson,
                                (l1, l2) => l1.number == l2.number)
                        );
                    } else {
                        setList(state.lessons.length - 1)(
                            addElement<Lesson>(getList(state.lessons.length - 1), lesson)
                        );
                    }
                }
                setLessonToEdit(undefined);
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
                {
                    state.lessons.map((list, index) => {
                        return (
                            <>
                                <Stack direction="row"
                                       divider={<Divider orientation="vertical" flexItem />}
                                       sx={{width:"100%"}}>
                                    <Typography sx={{minWidth:"6em", textAlign:"center"}}>{
                                        index*2 < state.schedule.length ?
                                            printScheduleElement(state.schedule[index*2])
                                            : "После"
                                    }</Typography>
                                    <Divider orientation="vertical"/>
                                    <List
                                        sx={{minHeight: "60px", height: "100%", width:"100%"}}>
                                        <ReactSortable
                                            swap
                                            id={"lesson-cell-"+index}
                                            group="lessons"
                                            list={getList(index)}
                                            setList={setList(index)}
                                            onAdd={(evt) => {
                                                if (index != (state.lessons.length - 1)) {
                                                    const list = getList(index);


                                                    if (list.length > 1) {
                                                        const setter = setList(index);
                                                        if (evt.newIndex && evt.oldIndex && evt.from) {
                                                            const element = list[evt.newIndex];
                                                            const fromListId = evt.from.id;
                                                            const fromListIndex: number = parseInt(fromListId.substr("lesson-cell-".length));
                                                            setter(removeElement<Lesson>(list,
                                                                element,
                                                                (e1, e2) => e1.number == e2.number));
                                                            setter(
                                                              addElement(getList(fromListIndex), element, evt.oldIndex)
                                                            );
                                                        }
                                                    }
                                                }
                                            }}>
                                            {list.map(renderLesson)}
                                        </ReactSortable>
                                    </List>
                                    <Divider orientation="vertical"/>
                                    <Typography sx={{minWidth:"6em", textAlign:"center"}}>{
                                        (index*2+1) < state.schedule.length ?
                                            printScheduleElement(state.schedule[index*2+1])
                                            : "    "
                                    }</Typography>
                                </Stack>
                                <Divider />
                            </>

                        );
                    })
                }

            </Paper>
            <Container sx={{textAlign: "center", paddingTop: "10px", paddingBottom: "10px"}}>
                <Button variant="outlined" onClick={() => setScheduleEditor(true)}>
                    Редактировать расписание звонков
                </Button>
            </Container>
            <ScheduleEditor onAccept={(schedule) => {
                const day = buildDay(source, -1, {
                    ...state,
                    schedule: schedule,
                    scheduleExists: schedule.length > 0
                });

                setState(buildDayRep(source, day));
                setScheduleEditor(false);
            }}
                            onCancel={() => setScheduleEditor(false)}
                            schedule={state.schedule}
                            open={scheduleEditor}/>
            <Divider/>
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
                    if (!day) {
                        createDay().then( (id) => {
                            saveDay(buildDay(source, id, state)).then( (s) => {
                                setLoading(false);
                            }).catch( (s) => {
                                setLoading(false);
                            });

                            setLoading(false);
                        }).catch( () => {
                            setLoading(false);
                        });
                    } else {
                        saveDay(buildDay(source, day.id, state)).then( (s) => {
                            setLoading(false);
                        }).catch( () => {
                            setLoading(false);
                        });
                    }
                }}>
                    Сохранить
                </LoadingButton>

            </DialogActions>
        </>
    );
}