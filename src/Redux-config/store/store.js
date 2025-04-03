import { configureStore } from "@reduxjs/toolkit";
import  userReducer  from "../reducers/userSlice";
import authReducer from "../reducers/authSlice";
import brandReducer from "../reducers/brandSlice";

export const store = configureStore({
    reducer:{
        user:userReducer,
        auth: authReducer,
        brands: brandReducer,
    }
})