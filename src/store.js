import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import activeslice from "./slices/activeslice";
// 
export default configureStore({
  reducer: {
    setuser: userSlice,
    active: activeslice,
  },
});
