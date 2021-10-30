import * as React from 'react';
import {AppBar, Container, Toolbar, Typography} from "@mui/material";

export interface HeaderProps {
    headerRef: any;
    serviceName: String
}

export default function Header({headerRef, serviceName}: HeaderProps) {
    return (
        <AppBar position="relative" color="default" sx={{flex: "none"}} ref={headerRef}>
            <Container maxWidth="xl" disableGutters={true}>
                <Toolbar>
                    <Typography variant="h6" color="blue" noWrap>
                        {serviceName}
                    </Typography>
                </Toolbar>
            </Container>
        </AppBar>
    );
}