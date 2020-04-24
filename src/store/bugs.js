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

// Selector function
// instead of accessing the store and performing queries against it
// this was form index.js ==> const unresolvedBugs = store.getState().entities.bugs.filter((bug) => !bug.resolved);
// the reducer can provide some predefined selectors of data
export const getUnresolvedBugs = (state) => state.entities.bugs.filter((bug) => !bug.resolved);