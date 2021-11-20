import * as React from 'react';
import {useState} from 'react';
import {EditorProps} from "../screens/EditSource";
import {IconButton, InputAdornment, TextField, Tooltip} from "@mui/material";
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

            <TextField
                variant="filled"
                label={props.label}
                defaultValue={props.valueToString(value)}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip title="Выбрать">
                                <IconButton edge="end" onClick={() => setOpen(true)}>
                                    <ListIcon/>
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                }}
            />
        </>
    );
}