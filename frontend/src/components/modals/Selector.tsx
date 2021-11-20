import * as React from "react";
import {useAppSelector} from "../../store/hooks";
import {EditorProps} from "../screens/EditSource";
import {CircularProgress, Dialog, DialogContent, DialogTitle, Divider, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";


interface SelectorProps<T> {
    open: boolean;
    returnFunction: (item?: T) => void;
    children: (props: EditorProps<T>) => any;
    exclude?: (el: T) => boolean;
}


export default function Selector<T>({returnFunction, children, open, exclude}: SelectorProps<T>) {
    const priorities = useAppSelector(state => state.priorities.list);
    const sourceMap = useAppSelector(state => state.sourceMap.sources);

    if (priorities == undefined) {
        return <Dialog
            open={open}
            aria-labelledby="selector-dialog-title"
            aria-describedby="selector-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Выберите элемент
                <IconButton
                    aria-label="close"
                    onClick={() => {returnFunction()}}
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
                <CircularProgress />
            </DialogContent>
        </Dialog>
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="yousure-dialog-title"
            aria-describedby="yousure-dialog-description">
            <DialogTitle sx={{ m: 0, p: 2, width: "600px"}}>
                Выберите элемент
                <IconButton
                    aria-label="close"
                    onClick={() => {returnFunction()}}
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
                {priorities.map((pri, index) => {
                    const source = sourceMap[pri.sourceId];
                    if (source == undefined) return undefined;

                    return (
                        <>
                            {
                                children({
                                    isSelect: true,
                                    requestClose: returnFunction,
                                    overrideTitle: "Источник: " + source.name,
                                    source: source,
                                    exclude: exclude
                                })
                            }
                            <Divider/>
                        </>
                    );
                })}
            </DialogContent>
        </Dialog>
    )
}