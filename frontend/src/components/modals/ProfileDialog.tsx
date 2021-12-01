import * as React from "react";
import {useAppDispatch, useAppSelector} from "../../store/hooks";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider, FormControlLabel,
    Grid,
    IconButton, Switch,
    TextField, Typography
} from "@mui/material";
import {Close} from "@material-ui/icons";
import {useState} from "react";
import YouSureDialog from "./YouSureDialog";
import axios from "axios";
import {logoutUser, setUser} from "../../store/user";

interface ProfileDialogProps {
    open: boolean;
    onClose: () => void;
}


export default function ProfileDialog({open, onClose}: ProfileDialogProps) {
    const user = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [pass, setPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [action, setAction] = useState<() => Promise<void>>(async () =>{})
    const [ask, setAsk] = useState(false);
    const [swt, setSwt] = useState(false);

    const passError = (pass != user.password);


    const close = () => {
        setAction(async () => {});
        setAsk(false);
    }

    const chn = () => {
        setAction(async () => {
            await axios.get("/user/change_password", {
                auth: user,
                params: {
                    password: pass,
                    newPass: newPass
                }
            }).then(() => {
                dispatch(setUser({username: user.username, password: newPass}));
            })
        });
        setAsk(true);
    }
    const del = () => {
        setAction(async () => {
            await axios.get("/user/delete", {
                auth: user,
                params: {
                    password: pass
                }
            }).then(() => {
                dispatch(logoutUser());
            });
        });
        setAsk(true);
    }

    return (
        <>
        <YouSureDialog open={ask} close={close} accept={async () => {
            await action();
            close();
        }}/>
        <Dialog
            open={open}
            aria-labelledby="profile-dialog-title"
            aria-describedby="profile-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2, width: "600px"}}>
                Настройки профиля
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{width: "100%"}}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField fullWidth
                                   type="password"
                                   value={pass}
                                   label="Пароль"
                                   onChange={(e) => setPass(e.target.value)}
                                   error={passError}
                                   />
                    </Grid>
                    <Divider/>
                    <Grid item xs={12}>
                        <Typography variant="h5" color="error">
                            Смена пароля
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>

                        <TextField fullWidth
                                   type="password"
                                   value={newPass}
                                   disabled={passError}
                                   label="Новый пароль"
                                   onChange={(e) => setNewPass(e.target.value)}
                                   error={pass == user.password}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={chn}>
                            Сменить
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h5" color="error">
                            Удаление профиля
                        </Typography>
                    </Grid>
                    <Grid item xs={8}>
                        <FormControlLabel control={<Switch checked={swt} onChange={(e)=>setSwt(e.target.checked)} defaultChecked />} label="Я знаю, что удаление уничтожит все созданные расписания." />
                    </Grid>
                    <Grid item xs={4}>
                        <Button onClick={del} disabled={!swt || passError}>
                            Удалить
                        </Button>
                    </Grid>
                </Grid>

            </DialogContent>
        </Dialog>
        </>
    );
}