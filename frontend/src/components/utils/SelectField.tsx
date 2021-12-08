import * as React from 'react';
import {useEffect, useState} from 'react';
import {EditorProps} from "../screens/EditSource";
import {InputLabel, MenuItem, Select} from "@mui/material";
import ListIcon from '@mui/icons-material/List';
import Selector from "../modals/Selector";
import {Entity} from "../../database";


interface SelectFieldProps<T> {
    label: string;
    startValue?: T;

    valueToString: (value?: T) => string | undefined;
    setValue: (item?: T) => void;
    children: (props: EditorProps<T>) => any;
}


export default function SelectField<T extends Entity>(props: SelectFieldProps<T>) {
    const [value, setValue] = useState(props.startValue);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setValue(props.startValue);
    }, [props.startValue]);

    // @ts-ignore
    // <Tooltip title="Выбрать">
    //     <IconButton edge="end" onClick={() => setOpen(true)}>
    //         <
    //     </IconButton>
    // </Tooltip>
    return (
        <>
            <Selector<T> open={open} returnFunction={(item) => {
                setOpen(false);
                if (item != value) {
                    setValue(item);
                    props.setValue(item);
                }
            }} exclude={value ? (item) => item.id == value.id : undefined}>
                {props.children}
            </Selector>

            <InputLabel id={props.label}>{props.label}</InputLabel>
            <Select
                variant="outlined"
                labelId={props.label}
                defaultValue={1}
                fullWidth
                open={false}
                onClick={() => setOpen(true)}
                IconComponent={
                    (props) => <ListIcon {...props}/>
                }
            >
                <MenuItem value={1}>{props.valueToString(value)}</MenuItem>
            </Select>
        </>
    );
}