import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {
    CircularProgress,
    Divider,
    Grid, IconButton,
    List,
    ListItem, ListItemButton,
    ListItemIcon,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import SortableArray from "../../utils/sortableUtils";
import {Source, SourcePriority} from "../../database";
import {setPriorities} from "../../store/priorities";
import axios from "axios";
import {ReactSortable} from "react-sortablejs";
import * as React from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {useEffect, useState} from "react";
import arraysEquals from "../../utils/arraysEquals";
import {setSources} from "../../store/sources";
import EditIcon from '@mui/icons-material/Edit';
import {setScreen} from "../../store/appStatus";

async function combine(promise1: Promise<any>, promise2: Promise<any>) {
    await promise1;
    await promise2;
}

interface SourceRepresentProps {
    source: SourcePriority;
}

function SourceRepresent(props: SourceRepresentProps) {
    const dispatch = useAppDispatch();

    return (
        <ListItem key={props.source.sourceId}
                  secondaryAction={
                      <IconButton onClick={() => dispatch(setScreen(
                          {
                              name: "EDIT_SOURCE",
                              params: {
                                  subscreen: "TITLE",
                                  sourceId: props.source.sourceId
                              }
                          }))}>
                          <EditIcon />
                      </IconButton>
                  }>
            <ListItemText primary={props.source.name}/>
        </ListItem>
    );
}

export function EditSourcesList(props: ScreenInterface) {
    const priorities = useAppSelector(state => state.priorities.list);
    const sources = useAppSelector(state => state.sources.list);

    const user = useAppSelector(state => state.user);
    const [update, setUpdate] = useState(true);
    const [loading, setLoading] = useState(true);

    const dispatch = useAppDispatch();

    if ((priorities == null) || (user == null) || (user.logout) || (sources == null)) {
        return (
            <TripleGrid leftMenu={props.menu} fill={true}>
                <Paper color="main"/>
            </TripleGrid>
        );
    }


    useEffect(() => {
        if (update) {
            setLoading(true);
            const r1 = axios.get("/api/find/current_sources", {
                auth: user
            }).then((response) => {
                if (!arraysEquals(response.data, priorities))
                    dispatch(setPriorities(response.data));
            }).catch((response) => {
                if (!arraysEquals(response.data, priorities))
                    dispatch(setPriorities(new Array<SourcePriority>()));
            })

            const r2 = axios.get("/api/find/all_sources", {
                auth: user
            }).then((response) => {
                if (!arraysEquals(response.data, sources))
                    dispatch(setSources(response.data));
            }).catch((response) => {
                if (!arraysEquals(response.data, sources))
                    dispatch(setSources(new Array<Source>()));
            })

            combine(r1, r2).then(() => {
                setLoading(false);
            })
            setUpdate(false);
        }
    }, [update]);


    const activeArray = new SortableArray<SourcePriority>("active", "priority", priorities);
    activeArray.onArrayUpdate = array => {
        dispatch(setPriorities(array));
    }
    activeArray.onItemUpdate = (priority) => {
        if (priority.id == -1) {
            setLoading(true);
            axios.get("/api/create/priority", {
                auth: user,
                params: {
                    sourceId: priority.sourceId,
                    priority: priority.priority
                }
            }).then((response) => {
                setLoading(false);
            }).catch(() =>{
                setUpdate(true);
            });
        } else {
            axios.get("/api/update/priority", {
                auth: user,
                params: {
                    sourceId: priority.sourceId,
                    priority: priority.priority
                }
            }).catch(() =>{
                setUpdate(true);
            });
        }
    }

    activeArray.onFieldUpdate = (old, id) => activeArray.array.length - id;
    activeArray.onRender = (item) => {
        return <SourceRepresent source={item.object} />
    }

    const sourcesList = new Array<SourcePriority>();
    for (let i = 0; i < sources.length; ++i) {
        let needInsert = true;
        for (let j = 0; j < activeArray.array.length; ++j) {
            if (activeArray.array[j].object.sourceId == sources[i].id) {
                needInsert = false;
                break;
            }
        }
        if (needInsert)
            sourcesList.push({
                priority: -1,
                sourceId: sources[i].id,
                id: -1,
                name: sources[i].name,
            });
    }

    const freeArray = new SortableArray<SourcePriority>("free", "priority", sourcesList);
    freeArray.onItemUpdate = priority => {
            if (priority.id != -1) {
                setLoading(true)
                axios.get("/api/delete/priority", {
                    auth: user,
                    params: {
                        sourceId: priority.sourceId
                    }
                }).then((response) => {
                    setLoading(false);
                }).catch(() =>{
                    setUpdate(true);
                });
            }
            priority.id = -1;
        };

    freeArray.onFieldUpdate = (old, id) => old;
    freeArray.onRender = (item) => {
        return <SourceRepresent source={item.object} />
    }


    return (
        <TripleGrid leftMenu={props.menu} fill={true}>
            <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "0px", marginTop: "32px"}}>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="h6">
                            Текущие источники
                        </Typography>
                        <Divider />
                        {
                            loading ? <CircularProgress /> :
                                <List sx={{height: "100%"}}>
                                    <ReactSortable style={{height: "100%"}} group="sources-list" list={activeArray.array} setList={activeArray.getSetter()}>
                                        {activeArray.render()}
                                    </ReactSortable>
                                </List>
                        }

                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="h6">
                            Неиспользуемые источники
                        </Typography>
                        <Divider />
                        {
                            loading ? <CircularProgress /> :
                                <List sx={{height: "100%"}}>
                                    <ReactSortable style={{height: "100%"}} group="sources-list" list={freeArray.array} setList={freeArray.getSetter()}>
                                        {freeArray.render()}
                                    </ReactSortable>
                                </List>
                        }
                    </Grid>
                </Grid>
            </Paper>
        </TripleGrid>
    );

}