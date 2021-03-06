import * as React from "react";
import {useState} from "react";
import {Button, Divider, IconButton, List, ListItem, Tooltip, Typography} from "@mui/material";
import {Close} from "@material-ui/icons";
import ModalEditor, {Editor} from "../../modals/ModalEditor";
import ButtonWithFadeAction from "../../utils/ButtonWithFadeAction";
import {OverridableStringUnion} from "@mui/types";
import {Variant} from "@mui/material/styles/createTypography";
import {TypographyPropsVariantOverrides} from "@mui/material/Typography/Typography";
import {hasUpdateRight, Rights} from "../../../database";

interface EditListEditorProps<T> {
    /**
     * Закрыть это окно
     */
    requestClose?: (item?: T) => void;

    //Редактирование списка
    /**
     * Заголовок списка
     */
    listTitle: string;

    /**
     * Список
     */
    list: Array<T>;

    /**
     * Является ли текущее меню - меню выбора
     */
    isSelect: boolean;

    /**
     * Конструирует внутреннее устройство элементов списка
     */
    constructor: (item: T, index: number) => any;

    remove: (item: T) => void;

    exclude?: (item: T) => boolean;

    //Редактирование отдельного элемента списка
    /**
     * Заголовок окна редактирования
     */
    editorTitle: string;

    /**
     * размер титульника
     */
    titleFormat?: OverridableStringUnion<Variant | 'inherit', TypographyPropsVariantOverrides>;

    /**
     * Редактор
     */
    editor: Editor<T>;

    /**
     * Права доступа
     */
    rights: Rights;

    /**
     * Убрать кнопки
     */
    noBts?: boolean;
}

export default function ItemListEditor<T>(props: EditListEditorProps<T>) {
    const [selected, select] = useState(-1);
    const [open, setOpen] = useState(false);

    const requestClose = (item?: T) => {
        setOpen(false);
        if (props.requestClose && props.isSelect && (item != undefined)) {
            props.requestClose(item);
        }

        select(-1);
    }

    return (
        <>
            <ListItem sx={{paddingTop: "16px", paddingBottom:"16px"}} secondaryAction={
                hasUpdateRight(props.rights) &&
                    <Button variant="outlined" onClick={() => {setOpen(true)}}>
                        Создать
                    </Button>
            }>

                <Typography variant={props.titleFormat? props.titleFormat : "h5"}>{props.listTitle}</Typography>
            </ListItem>

            <ModalEditor
                rights={props.rights}
                title={props.editorTitle}
                editor={props.editor}
                isSelect={props.isSelect}
                requestClose={requestClose}
                open={open}
                item={selected >= 0 ? props.list[selected] : undefined}
                noBts={props.noBts}
            />

            <Divider/>

            <List>
                {
                    props.list.length == 0 ? <ListItem sx={{textAlign:"center", display: "block"}}>Нет объектов</ListItem> :
                    props.list.map((item, index) => {
                        if (props.exclude && props.exclude(item))
                            return undefined;

                        return (
                            <>
                                <ButtonWithFadeAction
                                    actions={
                                        (props.rights == Rights.OWNER)
                                            ?
                                        <Tooltip title="Удалить" arrow>
                                            <IconButton onClick={() => props.remove(item)}>
                                                <Close />
                                            </IconButton>
                                        </Tooltip>
                                            :
                                        <Typography>
                                        </Typography>
                                    }
                                    onClick={() => {select(index); setOpen(true)}}>

                                    {props.constructor(item, index)}
                                </ButtonWithFadeAction>

                                {(index != (props.list.length - 1)) && <Divider/>}
                            </>
                        );
                    })
                }
            </List>
        </>
    );
}