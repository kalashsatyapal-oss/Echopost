import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import blogReducer from "./blogSlice.js";
import commentReducer from "./commentSlice.js";

const store = configureStore({
  reducer: {
    auth: authReducer,
    blogs: blogReducer,
    comments: commentReducer,
  },
});

export default store;
