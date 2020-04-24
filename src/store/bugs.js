import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
let lastId = 0;

const slice = createSlice({
  name: 'bugs',
  initialState,
  reducers: {
    bugAdded: (state, action) => {
      state.push({
        id: ++lastId,
        description: action.payload.description + '-' + lastId,
        resolved: false
      });
    },
    bugRemoved: (state, action) => {
      const index = state.findIndex((bug) => bug.id === action.payload.id);
      state.splice(index, 1);
    },
    bugResolved: (state, action) => {
      const index = state.findIndex((bug) => bug.id === action.payload.id);
      state[index].resolved = true;
    }
  }
});
// object destructuring to export the action creators
export const { bugAdded, bugResolved, bugRemoved } = slice.actions;
export default slice.reducer;
