import React from 'react';
import Header from './components/Header';
import Body from './components/Body';
import {Box, Container, createTheme, darkScrollbar, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import axios from "axios";
import Loading from "./components/Loading";

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


//Класс предназначен для создания
//Отвечает за выбор глобального состояния
export default class App extends React.Component<any, any>
{
    constructor(props: any) {
        super(props);
        this.state = {
            current_state: SiteState.LOADING,
            token: null,
            username: "login",
            password: "password"
        }
    }

    componentDidMount() {
        const params = {
            username: "test_user",
                password: "123"
        }
        axios.get("/user/register", {
            params: params
        }).then((response) => {
            this.setState({
                token: response.data,
                current_state: SiteState.PROCESS,
                username: params['username'],
                password: params['password']
            });
        }).catch((error) => {
            console.log(error);
            if ((error.response) && (error.response.data != "duplicate username"))
                this.setState({current_state: SiteState.CRUSH});
            else
                this.setState({current_state: SiteState.PROCESS,
                    username: params['username'],
                    password: params['password']});
        })
    }

    componentWillUnmount() {
    }

    render() {
        switch (this.state.current_state) {
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
                <Body username={this.state.username} password={this.state.password}/>
            </ThemeProvider>
        );
    }
}