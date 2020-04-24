import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
let lastId = 0;

const slice = createSlice({
  name: 'bugs',
  initialState,
  reducers: {
    bugAdded: (bugs, action) => {
      bugs.push({
        id: ++lastId,
        description: action.payload.description + '-' + lastId,
        resolved: false
      });
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs.splice(index, 1);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].resolved = true;
    }
  }
});
// object destructuring to export the action creators
export const { bugAdded, bugResolved, bugRemoved } = slice.actions;
export default slice.reducer;
