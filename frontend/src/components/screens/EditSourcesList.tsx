import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {TripleGrid} from "../ScreenStruct/TripleGrid";
import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    IconButton,
    List,
    ListItem,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import SortableArray, {SortableItem} from "../../utils/sortableUtils";
import {ChangesInfo, Day, LessonTemplate, Note, Place, Rights, SourcePriority, Teacher, Week} from "../../database";
import {setPriorities} from "../../store/priorities";
import axios from "axios";
import {ReactSortable} from "react-sortablejs";
import * as React from "react";
import {useEffect, useState} from "react";
import {ScreenInterface} from "../ScreenDisplay";
import {arrayEq, removeElementComp} from "../../utils/arrayUtils";
import {setScreen} from "../../store/appStatus";
import ButtonWithFadeAction from "../utils/ButtonWithFadeAction";
import {addEditorTab} from "../../store/editorList";
import {EditSourceParams} from "./EditSource";
import dayjs from "dayjs";
import YouSureDialog from "../modals/YouSureDialog";
import {Delete, Link} from "@material-ui/icons";
import {removeSource, updateSource} from "../../store/sourceMap";
import ShareDialog from "../modals/ShareDialog";
import ImportDialog from "../modals/ImportDialog";

interface SourceRepresentProps {
    source: SourcePriority;
    openDeleteDialog: (id: number) => void;
    openShareDialog: (id: number) => void;
}

function SourceRepresent(props: SourceRepresentProps) {
    const editorList = useAppSelector(state => state.editorList.list);
    const maps = useAppSelector(state => state.sourceMap);
    const source = maps.sources[props.source.sourceId];

    const dispatch = useAppDispatch();

    if (source == null) {
        return <div/>;
    }

    return (
        <ButtonWithFadeAction toKey={props.source.sourceId}
                              onClick={() => {
                                  const screen = {
                                      name: "EDIT_SOURCE",
                                      params: {
                                          subscreen: "TITLE",
                                          sourceId: props.source.sourceId
                                      }
                                  }
                                  dispatch(setScreen(screen));

                                  let addToMenu = true;
                                  for (let i = 0; i < editorList.length; ++i) {
                                      const params = editorList[i].params as EditSourceParams | undefined;
                                      if (params == undefined) {
                                          continue;
                                      }

                                      if (params.sourceId == screen.params.sourceId) {
                                          addToMenu = false;
                                          break;
                                      }
                                  }
                                  if (addToMenu) {
                                      dispatch(addEditorTab(screen));
                                  }
                              }}
                              actions={
            <Stack direction="row" spacing={2}>
                {
                    (source.rights == "OWNER") && <>
                        <IconButton onClick={() => props.openShareDialog(props.source.sourceId)}>
                            <Link />
                        </IconButton>

                        <IconButton onClick={()=>{props.openDeleteDialog(props.source.sourceId)}}>
                            <Delete/>
                        </IconButton>
                    </>
                }

            </Stack>
        }>
            {source.name}
        </ButtonWithFadeAction>
    );
}

export function EditSourcesList(props: ScreenInterface) {
    const priorities = useAppSelector(state => state.priorities.list);
    const sources = useAppSelector(state => state.sourceMap.sources);

    const user = useAppSelector(state => state.user);
    const [update, setUpdate] = useState(true);
    const [loading, setLoading] = useState(true);
    const [toDelete, setDelete] = useState(-1);
    const [toShare, setShare] = useState(-1);
    const [importDialog, setImportDialog] = useState(false);

    const dispatch = useAppDispatch();

    if ((priorities == null) || (user == null) || (user.logout) || (sources == null)) {
        return (
            <TripleGrid leftMenu={props.menu} fill={true}>
                <Paper color="main"/>
            </TripleGrid>
        );
    }

    const deleteSource = async () => {
        await axios.get("api/delete/source", {
            auth: user,
            params: {
                id: toDelete
            }
        }).then(() => {
            dispatch(removeSource(toDelete));
            dispatch(setPriorities(removeElementComp(priorities, (el) => el.sourceId == toDelete)));
            setUpdate(true);
        });
        setDelete(-1);
    }

    useEffect(() => {
        if (update) {
            setLoading(true);
            const r1 = axios.get("/api/find/current_sources", {
                auth: user
            }).then((response) => {
                if (!arrayEq(response.data, priorities))
                    dispatch(setPriorities(response.data));
                setLoading(false);
            }).catch((response) => {
                if (!arrayEq(response.data, priorities))
                    dispatch(setPriorities(new Array<SourcePriority>()));
                setLoading(false);
            })

            setUpdate(false);
        }
    }, [update]);

    const renderItem = (item: SortableItem<SourcePriority>) => {
        return <SourceRepresent source={item.object}
                                openDeleteDialog={setDelete}
                                openShareDialog={setShare}/>
    };

    const activeArray = new SortableArray<SourcePriority>("active", "priority", priorities);
    activeArray.onArrayUpdate = array => {
        setLoading(true);
        axios.get("api/update/priorities", {
            auth: user,
            params: {
                sources: array.map((el) => el.sourceId)
            }
        }).then((response) => {
            dispatch(setPriorities(response.data));
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }

    activeArray.onFieldUpdate = (old, id) => activeArray.array.length - id;
    activeArray.onRender = renderItem;

    let counter = 0;
    const sourcesList = new Array<SourcePriority>();
    for (let key in sources) {
        const source = sources[key];

        let needInsert = true;
        for (let j = 0; j < activeArray.array.length; ++j) {
            if (activeArray.array[j].object.sourceId == source.id) {
                needInsert = false;
                break;
            }
        }
        if (needInsert) {
            sourcesList.push({
                priority: -1,
                sourceId: source.id,
                id: -1,
                name: source.name,
            });
        }
        ++counter;
    }

    const freeArray = new SortableArray<SourcePriority>("free", "priority", sourcesList);

    freeArray.onFieldUpdate = (old, id) => old;
    freeArray.onRender = renderItem;

    const createSource = () => {
        const date = dayjs();
        const cdate = dayjs(0).day(date.day()).year(date.year()).valueOf();

        axios.get("api/create/source", {
            auth: user,
            params: {
                name: counter + "\t| ?????????? ????????????????",
                startDate: cdate,
                startWeek: 0
            }
        }).then((resp) => {
            dispatch(updateSource({
                id: resp.data,
                owner: user.username,
                rights: Rights.OWNER,

                name: counter + "\t| ?????????? ????????????????",

                startDate: cdate,
                startWeek: 0,

                teachers: new Array<Teacher>(),
                places: new Array<Place>(),
                templates: new Array<LessonTemplate>(),
                weeks: new Array<Week>(),
                days: new Array<Day>(),
                notes: new Array<Note>(),
                changes: new Array<ChangesInfo>()
            }));
            setUpdate(true);
        });
    }

    const shareSource = sources[toShare];

    return (
        <TripleGrid leftMenu={props.menu} fill={true}>

            <Paper color="main" sx={{paddingLeft: "16px", paddingRight: "16px", paddingBottom: "0px", marginTop: "32px"}}>

                <Grid container spacing={2}>

                    <Grid item xs={6}>
                        <Typography variant="h6">
                            ?????????????? ??????????????????
                        </Typography>
                    </Grid>

                    <Grid item xs={6}>

                        <ListItem
                            secondaryAction={
                                <Stack direction="row" spacing={1}>

                                    <Button variant="outlined" onClick={()=>setImportDialog(true)}>
                                        ????????????
                                    </Button>

                                    <Button variant="outlined" onClick={createSource}>
                                        ??????????????
                                    </Button>
                                </Stack>

                            }>

                            <Typography variant="h6">
                                ?????????????????? ??????????????????
                            </Typography>
                        </ListItem>
                    </Grid>

                    <Grid item xs={6} sx={{paddingTop: "0!important"}}>

                        <Divider />

                        {
                            loading ? <CircularProgress /> :
                                <List sx={{height: "100%"}}>
                                    <ReactSortable style={{height: "100%"}}
                                                   group="sources-list"
                                                   list={activeArray.array}
                                                   setList={activeArray.getSetter()}>

                                        {activeArray.render()}
                                    </ReactSortable>
                                </List>
                        }
                    </Grid>

                    <Grid item xs={6} sx={{paddingTop: "0!important"}}>

                        <Divider />

                        {
                            loading ? <CircularProgress /> :
                                <List sx={{height: "100%"}}>
                                    <ReactSortable style={{height: "100%"}}
                                                   group="sources-list"
                                                   list={freeArray.array}
                                                   setList={freeArray.getSetter()}>

                                        {freeArray.render()}
                                    </ReactSortable>
                                </List>
                        }
                    </Grid>
                </Grid>
            </Paper>

            {shareSource && <ShareDialog open={toShare >= 0} close={() => setShare(-1)} source={shareSource}/>}

            <YouSureDialog open={toDelete >= 0} close={() => setDelete(-1)} accept={deleteSource}/>

            <ImportDialog open={importDialog} close={()=>setImportDialog(false)}/>
        </TripleGrid>
    );
}