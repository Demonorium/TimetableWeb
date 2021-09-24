import React from 'react';
import Header from './components/Header';
import Body from './components/Body';
import {Box, Container, createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

const theme = createTheme();

enum SiteState {
    LOADING,
    LOGIN,
    REGISTER,
    PROCESS
}

export default class App extends React.Component<any, any>
{
    constructor(props: any) {
        super(props);
        this.state = {
            current_state: SiteState.LOADING
        }
    }

    render() {
        switch (this.state.current_state) {
            case SiteState.LOADING:
                return (
                    <ThemeProvider theme={theme}>

                    </ThemeProvider>
                )
                break;
        }
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Header theme={theme} serviceName="Учебное расписание"/>
                <Body/>
            </ThemeProvider>
        );
    }
}