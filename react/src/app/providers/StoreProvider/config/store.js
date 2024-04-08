import {configureStore} from "@reduxjs/toolkit";
import {userReducer} from "entities/User";
import {createReducerManager} from "app/providers/StoreProvider/config/reducerManager";

export function createReduxStore() {
    const rootReducers = {
        user: userReducer,
    }

    const reducerManager = createReducerManager(rootReducers)

    const store = configureStore({
        reducer: reducerManager.reduce,
        devTools: process.env.NODE_ENV !== "production",
    })

    store.reducerManager = reducerManager

    return store
}
