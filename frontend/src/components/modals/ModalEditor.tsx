import * as React from "react";
import {ReactNode, useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import {LoadingButton} from "@mui/lab";
import {Rights} from "../../database";

export interface Editor<T> {
    onPartCreate: (item: T) => Promise<T>;
    onPartUpdate: (item: T) => Promise<T>;

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

    /**
     * Права доступа
     */
    rights: Rights;
    /**
     * Нет кнопок
     */
    noBts?: boolean;
}


export default function ModalEditor<T>({noBts, rights, title, isSelect, item, editor, requestClose, open}: ModalEditorProps<T>) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            editor.changeItem(item);
        }
    }, [open])

    let saveText = null;
    if (isSelect) {
        if ((rights == Rights.OWNER) || (rights == Rights.READ_UPDATE) || (rights == Rights.UPDATE)) {
            saveText = "Сохранить и выбрать";
        } else {
            saveText = "Выбрать"
        }
    } else if ((rights == Rights.OWNER) || (rights == Rights.READ_UPDATE) || (rights == Rights.UPDATE)) {
        saveText = "Сохранить";
    }


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
            {!noBts ? <DialogActions>
                <Button onClick={() => requestClose()}>
                    Отмена
                </Button>
                {
                    saveText != null ?
                        <LoadingButton disabled={editor.createPartFromUI() == undefined} loading={loading} autoFocus onClick={() => {
                            if ((rights == Rights.OWNER) || (rights == Rights.READ_UPDATE) || (rights == Rights.UPDATE)) {
                                const part = editor.createPartFromUI();
                                if (part != undefined) {
                                    if (item == undefined) {
                                        setLoading(true);
                                        editor.onPartCreate(part).then((part) => {
                                            requestClose(part);
                                            setLoading(false);
                                        }).catch(() => {
                                            setLoading(false);
                                        });
                                    } else if (editor.isPartChanged(item, part)) {
                                        setLoading(true);
                                        editor.onPartUpdate(part).then((part) => {
                                            requestClose(part);
                                            setLoading(false);
                                        }).catch(() => {
                                            setLoading(false);
                                        });
                                    } else
                                        requestClose(part);
                                } else
                                    requestClose(part);
                            } else {
                                requestClose(item);
                            }
                        }}>
                            {saveText}
                        </LoadingButton>
                        : undefined
                }

            </DialogActions>
                :undefined
            }

        </Dialog>
    )
}