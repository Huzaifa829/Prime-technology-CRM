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
    updateBrandRedux: (state, action) => {
      const { id, name } = action.payload;
      const index = state.brands.findIndex((brand) => brand.id === id);
      if (index !== -1) {
        state.brands[index].name = name;
      }
    },
    deleteBrandFromRedux: (state, action) => {
      state.brands = state.brands.filter((brand) => brand.id !== action.payload);
    },
    
  },
});

export const { addBrands ,updateBrandRedux,deleteBrandFromRedux } = brandSlice.actions;
export default brandSlice.reducer;
