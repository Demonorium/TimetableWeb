import * as React from 'react';
import {AppBar, Container, Theme, Toolbar, Typography} from "@mui/material";

export interface HeaderProps {
    theme: Theme
    serviceName: String
}

export default function Header({theme, serviceName}: HeaderProps) {
    return (
        <AppBar position="absolute" color="default">
            <Container maxWidth="lg" disableGutters={true}>
                <Toolbar>
                    <Typography variant="h6" color="blue" noWrap>
                        {serviceName}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}