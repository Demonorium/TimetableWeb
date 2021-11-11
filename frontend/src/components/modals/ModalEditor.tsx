import * as React from "react";
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import {MutableRefObject, ReactNode, useEffect} from "react";

export interface Editor<T> {
    onPartCreate: (item: T) => void;
    onPartUpdate: (item: T) => void;

    createPartFromUI: () => T | undefined;
    isPartChanged: (prev: T, next: T) => boolean;

    changeItem: (item?: T) => void;
    UI: ReactNode;
}

export interface ModalEditorProps<T> {
    /**
     * Заголовок окна
     */
    title: string;
    /**
     * Данное окно является ещё и окном выбора, если isSelect == true
     */
    isSelect: boolean;

    /**
     * Элемент для редактирования
     */
    item?: T;

    /**
     * Редактор
     */
    editor: Editor<T>;


    /**
     * Сделана попытка закрыть диалог
     */
    requestClose: (item?: T) => void;

    /**
     * Диалог открыт
     */
    open: boolean;
}


export default function ModalEditor<T>({title, isSelect, item, editor, requestClose, open}: ModalEditorProps<T>) {
    useEffect(() => {
        if (open) {
            editor.changeItem(item);
        }
    }, [open])

    return (
        <Dialog
            open={open}
            aria-labelledby="editselect-dialog-title"
            aria-describedby="editselect-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={() => requestClose()}
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
                    {editor.UI}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => requestClose()}>
                        Отмена
                    </Button>
                    <Button autoFocus onClick={() => {
                        const part = editor.createPartFromUI();
                        if (part != undefined) {
                            if (item == undefined) {
                                editor.onPartCreate(part);
                            } else if (editor.isPartChanged(item, part)) {
                                editor.onPartUpdate(part);
                            }
                        }
                        requestClose(part);
                    }}>
                        {isSelect ? "Сохранить и выбрать" : "Сохранить"}
                    </Button>
                </DialogActions>
        </Dialog>
    )
}