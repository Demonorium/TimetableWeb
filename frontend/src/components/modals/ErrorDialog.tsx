import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

interface ErrorDialogProps {
    reload: () => void;
}

export default function ErrorDialog({reload}: ErrorDialogProps) {
    return (
        <Dialog
            open={true}
            aria-labelledby="editselect-dialog-title"
            aria-describedby="editselect-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2, color: "#AA0000"}}>
                Произошла неизвестная ошибка!
            </DialogTitle>

            <DialogContent dividers>
                Сервер не отвечает на запросы, попробуйте переподключиться позже.
            </DialogContent>

            <DialogActions sx={{textAlign:"center", "display": "block"}}>
                <Button variant="contained" onClick={reload}>
                    Переподключиться
                </Button>
            </DialogActions>
        </Dialog>
    );

}