import React, {useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import Body from './components/Body';
import {createTheme, ThemeProvider} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import Loading from "./components/Loading";
import {useAppSelector} from "./store/hooks";
import LoginOrRegister from "./components/LoginOrRegister";
import dayjs from "dayjs";

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

enum SiteState {
    LOADING,
    PROCESS,
    CRUSH
}

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
    return <LoadingScreen/>;
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

    //Ссылка на header, используется для определения положение компонент с абсолютным позиционированием
    const headerRef = useRef<any>();

    const [state, setState] = useState(SiteState.LOADING);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        //Настройки
        dayjs.locale('ru');

        //После завершения настроек начинаем обработку
        setState(SiteState.PROCESS);
    }, [update]);

    switch (state) {
        case SiteState.LOADING:
            return <LoadingScreen/>
        case SiteState.CRUSH:
            return <CrushScreen/>
    }


    return (
        <NormalScreen headerRef={headerRef}>
            { //Если нет пользователя выводим модалку для логина
                (user.logout) ?
                    <LoginOrRegister open={true} isRegister={false} /> :
                    <Body headerRef={headerRef}/>
            }
        </NormalScreen>
    );
}