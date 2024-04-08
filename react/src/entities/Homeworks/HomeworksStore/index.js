import { configureStore } from "@reduxjs/toolkit";

const HomeWorksStore = configureStore({
  reducer: {
    homeworks: homeworkReducer
  },
});

export default HomeWorksStore;