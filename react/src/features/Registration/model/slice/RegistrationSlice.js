import {createSlice} from "@reduxjs/toolkit";
import {ERROR, registerData, secondStepInfo} from "shared/consts/storagesKeys";
import {register} from "features/Registration"

let initialState = {
    registerData: sessionStorage.getItem(registerData) === null ? {
                first_name: "",
                last_name: "",
                middle_name: "",
                phone: "",
                password: "",
                group_id: 0,
                group_tmp_name: "",
                is_active: true
            }
        :
            JSON.parse(sessionStorage.getItem(registerData)),
    error: sessionStorage.getItem(ERROR) === null ? {
                msg: "",
                wrongPhone: ""
            }
        :
            JSON.parse(sessionStorage.getItem(ERROR)),
    secondStepInfo: sessionStorage.getItem(secondStepInfo) === null ? {
                faculty: "",
                specialization: "",
                grade: "",
                group: ""
            }
        :
            JSON.parse(sessionStorage.getItem(secondStepInfo)),
    isLoading: false,
}

export const registrationSlice = createSlice({
    name: 'register',
    initialState,
    reducers: {
        setFirstName: (state, action) => {
            state.registerData.first_name = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, first_name: action.payload}))
        },
        setLastName: (state, action) => {
            state.registerData.last_name = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, last_name: action.payload}))
        },
        setMiddleName: (state, action) => {
            state.registerData.middle_name = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, middle_name: action.payload}))
        },
        setPhone: (state, action) => {
            state.registerData.phone = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, phone: action.payload}))
        },
        setPassword: (state, action) => {
            state.registerData.password = action.payload
        },
        setGroupId: (state, action) => {
            state.registerData.group_id = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, group_id: action.payload}))
        },
        setGroupTmpName: (state, action) => {
            state.registerData.group_tmp_name = action.payload
            sessionStorage.setItem(registerData, JSON.stringify({...state.registerData, group_tmp_name: action.payload}))
        },
        setWrongPhone: (state, action) => {
            state.error.wrongPhone = action.payload
            sessionStorage.setItem(ERROR, JSON.stringify({...state.error, wrongPhone: action.payload}))
        },
        setErrorMsg: (state, action) => {
            state.error.msg = action.payload
            sessionStorage.setItem(ERROR, JSON.stringify({...state.error, msg: action.payload}))
        },
        setError: (state, action) => {
            state.error = action.payload
            sessionStorage.setItem(ERROR, JSON.stringify(action.payload))
        },
        setFaculty: (state, action) => {
            state.secondStepInfo.faculty = action.payload
            sessionStorage.setItem(secondStepInfo, JSON.stringify({...state.secondStepInfo, faculty: action.payload}))
        },
        setSpecialization: (state, action) => {
            state.secondStepInfo.specialization = action.payload
            sessionStorage.setItem(secondStepInfo, JSON.stringify({...state.secondStepInfo, specialization: action.payload}))
        },
        setGrade: (state, action) => {
            state.secondStepInfo.grade = action.payload
            sessionStorage.setItem(secondStepInfo, JSON.stringify({...state.secondStepInfo, grade: action.payload}))
        },
        setGroup: (state, action) => {
            state.secondStepInfo.group = action.payload
            sessionStorage.setItem(secondStepInfo, JSON.stringify({...state.secondStepInfo, group: action.payload.label}))
        },
        deleteRegisterData: (state) => {
            state.registerData = {}
            sessionStorage.removeItem(registerData)
        },
        updateInitialState: (state) => {
            if (sessionStorage.getItem(registerData) !== null) {
                state.registerData = JSON.parse(sessionStorage.getItem(registerData))
            }
            if (sessionStorage.getItem(ERROR) !== null) {
                state.error = JSON.parse(sessionStorage.getItem(ERROR))
            }
            if (sessionStorage.getItem(secondStepInfo) !== null) {
                state.secondStepInfo = JSON.parse(sessionStorage.getItem(secondStepInfo))
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                // state.error = undefined;
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                // state.error = action.payload;
            });
    },
})

export const { actions: registrationActions } = registrationSlice
export const { reducer: registrationReducer } = registrationSlice
