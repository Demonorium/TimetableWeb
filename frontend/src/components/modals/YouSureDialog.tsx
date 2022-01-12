import * as React from 'react';
import DialogTemplate from "./DialogTemplate";

interface YouSureDialogProps {
    open: boolean;
    close: () => void;
    accept: () => Promise<void>;
}
export default function YouSureDialog({open, close, accept}: YouSureDialogProps) {
    return (
        <DialogTemplate title="Подтверждение"
                        close={close}
                        open={open}
                        cancelText="Отменить"
                        accept={accept}
                        acceptText="Подтвердить">
            Вы уверены? Отменить данное действие невозможно!
        </DialogTemplate>
    );
}