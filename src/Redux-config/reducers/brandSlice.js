import { createSlice } from "@reduxjs/toolkit";

const brandSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
  },
  reducers: {
    addBrands: (state, action) => {
      state.brands.push(action.payload);
    },
  
  },
});

export const { addBrands } = brandSlice.actions;
export default brandSlice.reducer;
