import {createSlice} from "@reduxjs/toolkit";
import {TOKEN} from "shared/consts/storagesKeys";

const initialState = {
    authData: {},
    isAuth: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuth: (state, action) => {
            state.isAuth = action.payload
        },
        initAuthData: (state) => {
            if (localStorage.getItem(TOKEN) !== null) {
                state.isAuth = true
            }
        }
    },
})

export const { actions: userActions } = userSlice
export const { reducer: userReducer } = userSlice
