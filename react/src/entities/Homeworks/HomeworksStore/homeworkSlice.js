import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TaskManagementApi from "shared/api/TaskManagmentApi";

const createHomework = createAsyncThunk(
  'homeworks/createHomework',
  async (hometaskBody, thunkApi) => {
    const response = await TaskManagementApi.createHomework(hometaskBody.name, hometaskBody.lessonId, hometaskBody.description)
    if (!response.data || response.errors) return response.data
    const res = await TaskManagementApi.sendFiles(response.data._id, hometaskBody.files, hometaskBody.imgs)
    return res.data
  }
)

const getHomeworks = createAsyncThunk(
  'homeworks/getHomeworks',
  async (hometaskStatus, thunkApi) => {
    const response = await TaskManagementApi.getHomeTasks(hometaskStatus)
    return response.data
  }
)


const initialState = {
  homeworksList: [],
  loading: false,
  error: null
}

const homeworksSlice = createSlice({
  name: 'homeworks',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(createHomework.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHomework.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createHomework.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }) // Дальше получение домашек
      .addCase(getHomeworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeworks.fulfilled, (state, action) => {
        state.homeworksList = [...action.payload];
        state.loading = false;
      })
      .addCase(getHomeworks.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      }) //Дальше редактирование домашек

  }
})