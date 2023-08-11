import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  messages: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setMessage: (state, action) => {
      state.message = action?.payload?._id
    },
    addMessage: (state, action) => {
      state.messages?.push(action?.payload)
    },

  },
})
export const { setMessages, setMessage, addMessage } = messageSlice.actions

export default messageSlice.reducer