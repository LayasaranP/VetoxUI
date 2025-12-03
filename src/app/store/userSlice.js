import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  user_id: '',
  name: '',
  email: '',
  isLoggedIn: false
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.user_id = action.payload.user_id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isLoggedIn = true;
    },

    signOut: (state) => {
      state.user_id = '';
      state.name = '';
      state.email = '';
      state.isLoggedIn = false;
    },
  },
});

export const { signIn, signOut } = userSlice.actions;

export default userSlice.reducer;
