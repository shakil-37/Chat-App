import { createSlice } from "@reduxjs/toolkit";
//
export const activeslice = createSlice({
  name: "active",
  initialState: {
    active: localStorage.getItem("active")
      ? JSON.parse(localStorage.getItem("active"))
      : null,
  },
  reducers: {
    setactive: (state, action) => {
      state.active = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setactive } = activeslice.actions;

export default activeslice.reducer;
