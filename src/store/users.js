import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
let lastId = 0;

const slice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    userAdded: (users, action) => {
      users.push({
        id: ++lastId,
        name: action.payload.name + '-' + lastId
      });
    }
  }
});
// object destructuring to export the action creators
export const { userAdded } = slice.actions;
export default slice.reducer;
