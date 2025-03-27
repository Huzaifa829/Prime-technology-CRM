import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "User",
  initialState: {
    userData: [],
  },
  reducers: {
    addUserData: (state, action) => {

      
      state.userData.push(action.payload);
    },
  },
});

export const { addUserData } = userSlice.actions;
export default userSlice.reducer
