import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Screen} from "./appStatus";
import {removeElement} from "../utils/arrayUtils";


export interface EditorListState {
    list: Array<Screen>;
}

const initialState:EditorListState = {
    list: new Array<Screen>()
}

export const editorListSlice = createSlice({
    name: 'editorList',
    initialState,
    reducers: {
        addEditorTab: (state, action: PayloadAction<Screen>) => {
            state.list.push(action.payload);
        },
        removeEditorTab: (state, action: PayloadAction<Screen>) => {
            state.list = removeElement(state.list, action.payload, (s1, s2) => {
                if (s1.params == s2.params)
                    return true;
                if ((s1.params == undefined) || (s2.params == undefined)) {
                    return false;
                }
                for (let key in s1.params) {
                    if (s1.params[key] != s2.params[key])
                        return false;
                }
                return true;
            })
        }
    },
});

export const { addEditorTab, removeEditorTab} = editorListSlice.actions;

export default editorListSlice.reducer;