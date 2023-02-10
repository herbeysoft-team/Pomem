import { createSlice } from "@reduxjs/toolkit";

export const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
  },
  reducers: {
    darkTheme: (state) => {
      state.mode = "dark";
    },
    lightTheme: (state) => {
      state.mode = "light";
    },
  },
});
export const { darkTheme, lightTheme } = themeSlice.actions;
export default themeSlice.reducer;
