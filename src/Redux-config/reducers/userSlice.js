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
    updateUserBrandRedux: (state, action) => {
      const { oldBrandName, newBrandName } = action.payload;

      state.userData = state.userData.map((user) => {
        if (user.brand?.includes(oldBrandName)) {
          return {
            ...user,
            brand: user.brand.map((brand) =>
              brand === oldBrandName ? newBrandName : brand
            ), 
          };
        }
        return user;
      });
    },
    updateUserBrandsAfterDelete: (state, action) => {
      const { brandName } = action.payload;

      state.userData = state.userData.map((user) => (
        {
        ...user,
        brand: user.brand?.filter((brand) => brand !== brandName) || [],
      }));
    },
  },
});

export const { addUserData ,updateUserBrandRedux,updateUserBrandsAfterDelete} = userSlice.actions;
export default userSlice.reducer
