import * as React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";

interface YouSureDialogProps {
    open: boolean;
    close: () => void;
    accept: () => void;
}
export default function YouSureDialog({open, close, accept}: YouSureDialogProps) {
    return (
        <Dialog
        open={open}
        aria-labelledby="yousure-dialog-title"
        aria-describedby="yousure-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Подтверждение
                <IconButton
                    aria-label="close"
                    onClick={close}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                Вы уверены? Отменить данное действие невозможно!
            </DialogContent>
            <DialogActions>
                <Button onClick={close} autoFocus>
                    Отменить
                </Button>
                <Button onClick={accept}>
                    Подтвердить
                </Button>
            </DialogActions>
        </Dialog>
    );



}