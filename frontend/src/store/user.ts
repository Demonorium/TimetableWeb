import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {User} from "../database";


interface UserState extends User {
   logout: boolean;
}

const initialState: UserState = {
    username: "test_user",
    password: "123",
    logout: true
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.password = action.payload.password;
            state.username = action.payload.username;
            state.logout = false;

            if (localStorage.getItem("remember") == "true") {
                localStorage.setItem("username", state.username);
                localStorage.setItem("password", state.password);
            }
        },
        logoutUser: (state, action: PayloadAction) => {
            state.logout = true
            state.password="";

            localStorage.removeItem("username");
            localStorage.removeItem("password");
            localStorage.removeItem("remember");
        },
    },
});

export const { setUser,logoutUser } = userSlice.actions;

export default userSlice.reducer;