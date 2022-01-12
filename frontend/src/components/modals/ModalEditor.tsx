import * as React from "react";
import {ReactNode, useEffect} from "react";
import {hasUpdateRight, Rights} from "../../database";
import DialogTemplate from "./DialogTemplate";

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

interface BackRef<T> {
    ref: T | undefined;
}

export default function ModalEditor<T>({noBts, rights, title, isSelect, item, editor, requestClose, open}: ModalEditorProps<T>) {
    useEffect(() => {
        if (open) {
            editor.changeItem(item);
        }
    }, [open])

    let acceptText = undefined;
    let cancelText = undefined;

    let accept = undefined;
    let reset = undefined;

    const result: BackRef<T> = {
        ref: undefined
    }

    const close = () => {
        requestClose(result.ref)
    }

    if (noBts != true) {
        cancelText = "Отмена"
        reset = async () => {
            editor.changeItem(item);
        }

        if (isSelect) {
            if (hasUpdateRight(rights)) {
                acceptText = "Сохранить и выбрать";
            } else {
                acceptText = "Выбрать"
            }
        } else if (hasUpdateRight(rights)) {
            acceptText = "Сохранить";
        }

        if (acceptText != undefined) {
            accept = async () => {
                if (hasUpdateRight(rights)) {
                    const part = editor.createPartFromUI();
                    if (part != undefined) {
                        if (item == undefined) {
                            result.ref = await editor.onPartCreate(part);
                        } else if (editor.isPartChanged(item, part)) {
                            result.ref = await editor.onPartUpdate(part);
                        } else {
                            result.ref = part;
                        }
                    } else {
                        result.ref = part;
                    }
                } else {
                    result.ref = item;
                }
            }
        }
    }

    return (
        <DialogTemplate childrenAlign="left"
                        title={title}
                        open={open}
                        close={close}
                        acceptText={acceptText}
                        reset={reset}
                        cancelText={cancelText}
                        isAcceptPossible={editor.createPartFromUI() != undefined}
                        accept={accept}>

            {editor.UI}
        </DialogTemplate>
    );
}