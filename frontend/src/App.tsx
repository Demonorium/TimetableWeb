import React, {useRef} from 'react';
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


//Класс предназначен для создания
//Отвечает за выбор глобального состояния
class App extends React.Component<any, any> {
    containerReference: any;

    constructor(props: any) {
        super(props);
        this.state = {
            store: props.store,
            current_state: SiteState.LOADING,
            token: null
        }
        this.containerReference = React.createRef();
    }

    componentDidMount() {
        const user = this.state.store.user

        axios.get("/user/register", {
            params: {
                username: user.username,
                password: user.password
            }
        }).then((response) => {
            this.setState({
                token: response.data,
                current_state: SiteState.PROCESS,
            });

        }).catch((error) => {
            console.log(error);
            if ((error.response) && (error.response.data != "duplicate username"))
                this.setState({current_state: SiteState.CRUSH});
            else
                this.setState({current_state: SiteState.PROCESS});
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
                <Box ref={this.containerReference} sx={{position: 'absolute',
                    width: '100%', height: '100vh',
                    display: 'block',
                    overflow: 'hidden scroll',
                    padding: '0', margin: '0'}}>
                    <Body container={this.containerReference}/>
                </Box>
            </ThemeProvider>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        store: state
    }
}
export default connect(mapStateToProps)(App);