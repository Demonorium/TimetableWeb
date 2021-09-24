import * as React from 'react';
import {AppBar, Theme, Toolbar, Typography} from "@mui/material";

export interface HeaderProps {
    theme: Theme
    serviceName: String
}

export default function Header({theme, serviceName}: HeaderProps) {
    return (
        <AppBar position="absolute" color="default" sx={{ borderBottom: (theme) => '1px solid ${theme.palette.divider}' }}>
            <Toolbar>

                <Typography variant="h6" color="blue" noWrap>
                    {serviceName}
                </Typography>
            </Toolbar>
        </AppBar>
    );
}