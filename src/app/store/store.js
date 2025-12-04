import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import messageSlice from './messageSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    assistant: messageSlice
  }
});
