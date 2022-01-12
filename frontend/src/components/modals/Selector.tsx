import * as React from "react";
import {useAppSelector} from "../../store/hooks";
import {EditorProps} from "../screens/EditSource";
import {Divider} from "@mui/material";
import {Source} from "../../database";
import DialogTemplate from "./DialogTemplate";

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
        <DialogTemplate open={open}
                        close={() => returnFunction()}
                        title="Выберите элемент">
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
        </DialogTemplate>
    );
}