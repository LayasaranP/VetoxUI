import { createSlice } from '@reduxjs/toolkit';

const initialState = { 
  assistant_message: ''
};

const messageSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    add_message: (state, action) => {
      state.assistant_message = action.payload.message.content;
    }
  },
});

export const { add_message } = messageSlice.actions;

export default messageSlice.reducer;
