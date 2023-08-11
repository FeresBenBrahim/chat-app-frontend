import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  users: [],
  userToDM: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setUserToDM: (state, action) => {
      state.userToDM = action?.payload;
    }
  },
})
export const { setUser, logout, setUsers, setUserToDM } = userSlice.actions

export default userSlice.reducer