import * as React from 'react';
import {useState} from 'react';
import {Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip} from "@mui/material";
import {Close} from "@material-ui/icons";
import {LoadingButton} from "@mui/lab";
import {Property} from "csstype";

interface CloseButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

function CloseButton({onClick, disabled}: CloseButtonProps) {
    return (
        <IconButton
            onClick={onClick}
            disabled={disabled}

            sx={{
                position: 'absolute',
                right: 8,
                top: 8
            }}>

            <Tooltip title="Закрыть окно">
                <Close/>
            </Tooltip>

        </IconButton>
    );
}

interface DialogTemplateProps {
    title?: string;

    open: boolean;
    close: () => void;
    closeButtonAction?: () => void;
    outsideClose?: boolean;
    noCloseButton?: boolean;

    children?: any;
    childrenAlign?: Property.TextAlign;

    acceptText?: string;
    cancelText?: string;
    resetText?:  string;

    accept?: () => Promise<void>;
    cancel?: () => Promise<void>;
    reset?: () => Promise<void>;

    isAcceptPossible?: boolean;
    isCancelPossible?: boolean;
    isResetPossible?: boolean;
}

function count(b?: boolean) {
    return b ? 1 : 0;
}

export default function DialogTemplate(props: DialogTemplateProps) {
    const [loading, setLoading] = useState(false);

    const hasCloseButton = props.noCloseButton != true;
    const hasAccept = (props.accept != undefined);
    const hasReset = (props.reset != undefined);
    const hasCancel = (props.cancel != undefined) || (props.cancelText != undefined);

    const btCount = count(hasAccept) + count(hasReset) + count(hasCancel);

    const acceptAction = () => {
        if (props.accept) {
            setLoading(true);
            props.accept().then(() => {
                setLoading(false);
                props.close();
            }).catch((e: any) => {
                console.log(e);
                setLoading(false);
            })
        } else {
            props.close();
        }
    }

    const resetAction = () => {
        if (props.reset) {
            setLoading(true);
            props.reset().then(() => {
                setLoading(false);
            }).catch((e: any) => {
                console.log(e);
                setLoading(false);
            })
        }
    }

    const cancelAction = () => {
        if (props.cancel) {
            setLoading(true);
            props.cancel().then(() => {
                setLoading(false);
                props.close();
            }).catch((e: any) => {
                console.log(e);
                setLoading(false);
            })
        } else {
            props.close();
        }
    }

    return (
        <Dialog open={props.open}
                onClose={props.outsideClose
                    ? cancelAction
                    : undefined}>

            <DialogTitle sx={{m: 0, p: 2, width: "600px",
                textAlign: hasCloseButton
                    ? "left"
                    : "center"}}>

                {props.title}

                {hasCloseButton && <CloseButton
                    onClick={props.closeButtonAction ? props.closeButtonAction : cancelAction}
                    disabled={loading}/>
                }
            </DialogTitle>

            <DialogContent dividers={props.title!=undefined} sx={{
                textAlign: props.childrenAlign
                    ? props.childrenAlign
                    : "center"}}>

                {props.children}
            </DialogContent>

            <DialogActions sx={{textAlign: (btCount == 1)? "center" : "right"}}>
                {hasCancel &&
                <LoadingButton loading={loading}
                               onClick={cancelAction}
                               disabled={props.isAcceptPossible == false}>

                    {props.cancelText ? props.cancelText : "Отмена"}
                </LoadingButton>
                }

                {hasReset &&
                <LoadingButton loading={loading}
                               onClick={resetAction}
                               disabled={props.isResetPossible == false}>

                    {props.resetText ? props.resetText : "Сбросить"}
                </LoadingButton>
                }

                {hasAccept &&
                <LoadingButton loading={loading}
                               onClick={acceptAction}
                               disabled={props.isCancelPossible == false}>

                    {props.acceptText}
                </LoadingButton>
                }
            </DialogActions>
        </Dialog>
    );
}