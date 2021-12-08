import * as React from "react";
import {useAppSelector} from "../../store/hooks";
import {EditorProps} from "../screens/EditSource";
import {Dialog, DialogContent, DialogTitle, Divider, IconButton} from "@mui/material";
import {Close} from "@material-ui/icons";
import {Source} from "../../database";


interface SelectorProps<T> {
    open: boolean;
    returnFunction: (item?: T) => void;
    children: (props: EditorProps<T>) => any;
    exclude?: (el: T) => boolean;
}


export default function Selector<T>({returnFunction, children, open, exclude}: SelectorProps<T>) {
    const sourceMap = useAppSelector(state => state.sourceMap.sources);

    const enumMap = (act: (pri: Source) => any) => {
        const result = new Array<any>();
        for (let key in sourceMap) {
            result.push(act(sourceMap[key]));
        }
        return result;
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
            <DialogContent dividers sx={{width: "100%", paddingLeft: "0", paddingRight: "0"}}>
                {enumMap((source) => {
                    return (
                        <>
                            {
                                children({
                                    isSelect: true,
                                    requestClose: returnFunction,
                                    overrideTitle: "Источник: " + source.name,
                                    titleFormat: "h6",
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