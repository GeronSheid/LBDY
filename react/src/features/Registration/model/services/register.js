import {createAsyncThunk} from "@reduxjs/toolkit";
import UserApi from "shared/api/UserApi";
import {registrationActions} from "features/Registration";
import {ERROR} from "shared/consts/storagesKeys";

export const register = createAsyncThunk(
    'register/register',
    async (registerData, thunkAPI) => {
        try {
            const response = await UserApi.register({...registerData, phone: registerData.phone.replace(/[^\d.+]/g, '')})
            if (response.errors || !response) {
                if (response.data.detail === undefined) {
                    thunkAPI.dispatch(registrationActions.setError({
                        msg: response.data.message,
                        wrongPhone: registerData.phone
                    }))
                } else {
                    thunkAPI.dispatch(registrationActions.setError({
                        msg: response.data.message ? response.data.message : 'Неправильный формат телефона',
                        wrongPhone: registerData.phone
                    }))
                } 
                thunkAPI.dispatch(registrationActions.setPassword(""))
                
            } else {
                thunkAPI.dispatch(registrationActions.deleteRegisterData())
                sessionStorage.clear()
            }
            return response
        } catch (e) {
            return thunkAPI.rejectWithValue(e.message)
        }
    }
)
