import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {Provider} from "react-redux";
import store from './store/store'
import {LocalizationProvider} from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterDayjs';

import dayjs from "dayjs";

import dayOfYear from 'dayjs/plugin/dayOfYear';
import duration from 'dayjs/plugin/duration';
import ruLocale from 'dayjs/locale/ru';

dayjs.extend(dayOfYear)
dayjs.extend(duration)
dayjs.locale('ru')

ReactDOM.render(
    <Provider store={store}>
        <LocalizationProvider dateAdapter={DateAdapter} locale={ruLocale}>
            <App />
        </LocalizationProvider>
    </Provider>, document.querySelector('#root'));