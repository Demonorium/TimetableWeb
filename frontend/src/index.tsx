import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import {Provider} from "react-redux";
import store from './store/store'
import {LocalizationProvider} from "@mui/lab";
import DateAdapter from '@mui/lab/AdapterDayjs';


ReactDOM.render(
    <Provider store={store}>
        <LocalizationProvider dateAdapter={DateAdapter}>
            <App />
        </LocalizationProvider>
    </Provider>, document.querySelector('#root'));