import React, {useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import ScreenDisplay from './components/ScreenDisplay';
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Loading from "./components/utils/Loading";
import {useAppDispatch, useAppSelector} from "./store/hooks";
import LoginOrRegister from "./components/modals/LoginOrRegister";
import dayjs from "dayjs";
import {ERROR, GlobalState, setAppState} from "./store/appStatus";
import axios from "axios";
import {setPriorities} from "./store/priorities";
import {Source, SourcePriority} from "./database";
import ErrorDialog from "./components/modals/ErrorDialog";
import {setSources} from "./store/sourceMap";
import {Orientation, setOrientation} from "./store/orientation";

const theme = createTheme({components:{
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: "#e8e8e8",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: "100%"
            },
            html: {
                height: "100%",
                minHeight: "100%"
            },
            "& #root": {
                margin: '0',
                height: '100%',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column'
            }

        }
    }
}});

/**
 * Отображается во время загрузки
 */
function LoadingScreen() {
    return  (
        <ThemeProvider theme={theme}>
            <div className="fillscreen">
                <Loading />
            </div>
        </ThemeProvider>
    );
}

/**
 * Отображается в случае критической ошибки
 */
function CrushScreen() {
    const dispatch = useAppDispatch();

    return (
        <ThemeProvider theme={theme}>
            <ErrorDialog reload={() => {
                dispatch(setAppState(GlobalState.LOADING));
            }}/>
        </ThemeProvider>
    );
}

/**
 * Нормальное отображение приложения, содержит загловок, ссылку на него, указывает тему
 */
function NormalScreen(props: any) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header headerRef={props.headerRef} serviceName="Учебное расписание"/>
            {props.children}
        </ThemeProvider>
    );
}




//Класс приложения
//Выбирает в каком режиме сейчас отображается приложение(загрузка, логин, регистрация, норм обработка, ошибка)
export default function App() {
    const user = useAppSelector((state) => state.user);
    const state = useAppSelector((state) => state.app);
    const orientation = useAppSelector((state) => state.orientation.state);

    const dispatch = useAppDispatch();

    //Ссылка на header, используется для определения положение компонент с абсолютным позиционированием
    const headerRef = useRef<any>();
    const [updateCounter, setUpdateCounter] = useState(0);

    const load = async () => {
        const promise_1 = axios.get("/api/find/current_sources", {
            auth: user
        }).then((response) => {
            dispatch(setPriorities(response.data));
        }).catch((response) => {
            dispatch(setPriorities(new Array<SourcePriority>()));
        });

        await promise_1;

        return axios.get("/api/find/all_sources", {
            auth: user
        }).then((response) => {
            dispatch(setSources(response.data));
        }).catch((response) => {
            dispatch(setSources(new Array<Source>()));
        });
    }

    useEffect(() => {
        //Если сейчас краш - ничего не делаем, мы же крашнулись
        if (state.app != GlobalState.CRUSH) {
            //Настройки
            dayjs.locale('ru');

            if (!user.logout) {
                if (state.app != GlobalState.LOADING) {
                    dispatch(setAppState(GlobalState.LOADING));
                }

                //Запускаем загрузку
                load().then(() => {
                    //После завершения настроек и загрузки начинаем работу
                    dispatch(setAppState(GlobalState.PROCESS));
                }).catch(() => {
                    //Если загрузка упала - уходим в ошибку
                    dispatch(ERROR());
                });
            } else {
                //Юзер вышел из аккаунта - просим войти
                dispatch(setAppState(GlobalState.LOGOUT));
            }
        }
    }, [updateCounter, user.logout, state.app == GlobalState.CRUSH]);

    const orientationChecker = (event: UIEvent) => {
        const width = window.innerWidth
        const height = window.innerHeight;
        const ratio = width / height;
        if (ratio > 1.2) {
            if (orientation != Orientation.LAPTOP) {
                dispatch(setOrientation(Orientation.LAPTOP));
            }

        } else {
            if (orientation != Orientation.PHONE) {
                dispatch(setOrientation(Orientation.PHONE));
            }
        }
    }

    useState(() => {
        window.addEventListener("resize", orientationChecker);

        return () => {
            window.removeEventListener("resize", orientationChecker)
        }
    })

    switch (state.app) {
        case GlobalState.LOADING:
            return <LoadingScreen/>
        case GlobalState.CRUSH:
            return <CrushScreen/>
        case GlobalState.LOGOUT:
            return <LoginOrRegister open={true} isRegister={false} />
    }

    return (
        <NormalScreen headerRef={headerRef}>
            <ScreenDisplay headerRef={headerRef}/>
        </NormalScreen>
    );
}