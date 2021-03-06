import * as React from "react";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {Button, Divider, FormControlLabel, Grid, Switch, TextField, Typography} from "@mui/material";
import YouSureDialog from "./YouSureDialog";
import axios from "axios";
import {logoutUser, setUser} from "../../store/user";
import {GlobalState, setAppState} from "../../store/appStatus";
import {resetMaps} from "../../store/sourceMap";
import DialogTemplate from "./DialogTemplate";

interface ProfileDialogProps {
    open: boolean;
    onClose: () => void;
}

interface StoreAction {
    act: () => Promise<void>;
}

export default function ProfileDialog({open, onClose}: ProfileDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [pass, setPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [action, setAction] = useState<StoreAction>({act: async () =>{}})
    const [ask, setAsk] = useState(false);
    const [swt, setSwt] = useState(false);

    const passError = (pass != user.password);


    const close = () => {
        setAction({act: async () =>{}});
        setAsk(false);
    }

    const chn = () => {
        const vl: () => Promise<void> = async () => {
            await axios.post("/user/change_password", {
                password: pass,
                newPassword: newPass
            }, {
                auth: user
            }).then(() => {
                dispatch(setUser({username: user.username, password: newPass}));
                setAsk(false);
            })
        };
        setAction({act: vl});
        setAsk(true);
    }

    const del = () => {
        const vl: () => Promise<void> = async () => {
            await axios.post("/user/delete", {
                password: pass
            },{
                auth: user
            }).then(() => {
                dispatch(logoutUser());
                dispatch(setAppState(GlobalState.LOADING));
                dispatch(resetMaps());
                setAsk(false);
            });
        };
        setAction({act: vl});
        setAsk(true);
    }

    return (
        <>

            <YouSureDialog open={ask} close={close} accept={async () => {
                await action.act();
                close();
            }}/>

            <DialogTemplate title="?????????????????? ??????????????"
                            open={open}
                            close={onClose}>

                <Grid container spacing={2}>

                    <Grid item xs={12}>
                        <TextField fullWidth
                                   type="password"
                                   value={pass}
                                   label="????????????"
                                   onChange={(e) => setPass(e.target.value)}
                                   error={passError}
                        />
                    </Grid>

                    <Divider/>

                    <Grid item xs={12}>
                        <Typography variant="h5" color="error">
                            ?????????? ????????????
                        </Typography>
                    </Grid>

                    <Grid item xs={8}>
                        <TextField fullWidth
                                   type="password"
                                   value={newPass}
                                   disabled={passError}
                                   label="?????????? ????????????"
                                   onChange={(e) => setNewPass(e.target.value)}
                                   error={pass == user.password}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <Button onClick={chn}>
                            ??????????????
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" color="error">
                            ???????????????? ??????????????
                        </Typography>
                    </Grid>

                    <Grid item xs={8}>

                        <FormControlLabel
                            label="?? ????????, ?????? ???????????????? ?????????????????? ?????? ?????????????????? ????????????????????."
                            control={
                            <Switch checked={swt}
                                    onChange={(e)=>setSwt(e.target.checked)}
                                    defaultChecked />
                            }/>

                    </Grid>

                    <Grid item xs={4}>
                        <Button onClick={del} disabled={!swt || passError}>
                            ??????????????
                        </Button>
                    </Grid>

                </Grid>
            </DialogTemplate>
        </>
    );
}