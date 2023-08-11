import { createSlice, current } from '@reduxjs/toolkit'

const initialState = {
  conversations: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  activeConversation: null,
  isOpen: false
}

export const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    setConv: (state, action) => {
      state.conversations = action.payload?.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt));
    },
    setActiveConversation: (state, action) => {
      state.activeConversation = action?.payload
    },
    setIsOpen: (state, action) => {
      state.isOpen = action?.payload;
    },
    changeLastMessage: (state, action) => {
      state.conversations = state?.conversations?.map((conversation) => conversation?._id === action?.payload?.conversation ? { ...conversation, lastMessage: { ...conversation?.lastMessage, content: action?.payload?.content } } : conversation).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    },
    addConversation: (state, action) => {
      state.conversations.push(action?.payload);
    }

  },
})
export const { setConv, setIsOpen, setActiveConversation, changeLastMessage, addConversation } = conversationSlice.actions

export default conversationSlice.reducer