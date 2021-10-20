import React, {useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import Body from './components/Body';
import {Box, createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import Loading from "./components/Loading";
import {connect} from "react-redux";

const theme = createTheme({components:{
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: "#e8e8e8"
            }
        }
    }
}});

enum SiteState {
    LOADING,
    LOGIN,
    REGISTER,
    PROCESS,
    CRUSH
}

//Класс приложения
//Выбирает в каком режиме сейчас отображается приложение(загрузка, логин, регистрация, норм обработка, ошибка)
function App(props: any) {
    const containerReference = useRef<any>();
    const store = props.store;
    const [state, setState] = useState(SiteState.LOADING);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        axios.get("/user/register", {
            params: store.user
        }).then((response) => {
            setState(SiteState.PROCESS);
        }).catch((error) => {
            console.log(error);
            if ((error.response) && (error.response.data != "duplicate username"))
                setState(SiteState.CRUSH);
            else
                setState(SiteState.PROCESS);
        });

        setUpdate(false);
    }, [update]);

    switch (state) {
        case SiteState.LOADING:
            return (
                <ThemeProvider theme={theme}>
                    <div className="fillscreen">
                        <Loading />
                    </div>
                </ThemeProvider>
            )
        case SiteState.CRUSH:
            return (
                <ThemeProvider theme={theme}>
                    <div className="fillscreen">
                        <Loading />
                    </div>
                </ThemeProvider>
            )
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header theme={theme} serviceName="Учебное расписание"/>
            <Box ref={containerReference} sx={{position: 'absolute',
                width: '100%', height: '100vh',
                display: 'block',
                overflow: 'hidden scroll',
                padding: '0', margin: '0'}}>
                <Body container={containerReference}/>
            </Box>
        </ThemeProvider>
    );
}


function mapStateToProps(state: any) {
    return {
        store: state
    }
}
export default connect(mapStateToProps)(App);