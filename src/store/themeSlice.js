import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDarkMode: false,
  isSafeMode: JSON.parse(localStorage.getItem("safeMode") || "false"),
  autoTheme: true, // Tự động chuyển theme theo thời gian
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      state.autoTheme = false; // Tắt auto theme khi user manual toggle
    },
    setTheme: (state, action) => {
      state.isDarkMode = action.payload;
    },
    toggleSafeMode: (state) => {
      state.isSafeMode = !state.isSafeMode;
      localStorage.setItem("safeMode", JSON.stringify(state.isSafeMode));
    },
    setSafeMode: (state, action) => {
      state.isSafeMode = action.payload;
      localStorage.setItem("safeMode", JSON.stringify(state.isSafeMode));
    },
    setAutoTheme: (state, action) => {
      state.autoTheme = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSafeMode,
  setSafeMode,
  setAutoTheme,
} = themeSlice.actions;

export default themeSlice.reducer;
