import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {ScheduleElement} from "../database";

export interface ScheduleState {
    schedule?: Array<ScheduleElement>;
    priority: number;
}

const initialState: ScheduleState = {
    schedule: undefined,
    priority: -1
}

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setSchedule: (state, action: PayloadAction<ScheduleState>) => {
            state = action.payload
        }
    },
});

export const { setSchedule} = scheduleSlice.actions;

export default scheduleSlice.reducer;