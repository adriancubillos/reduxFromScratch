import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { userAdded } from './users';

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
    },
    bugAssignedToUser: (bugs, action) => {
      const index = bugs.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].userId = action.payload.userId;
    }
  }
});
// object destructuring to export the action creators
export const { bugAdded, bugResolved, bugRemoved, bugAssignedToUser } = slice.actions;
export default slice.reducer;

// Selector function
// instead of accessing the store and performing queries against it
// this was form index.js ==> const unresolvedBugs = store.getState().entities.bugs.filter((bug) => !bug.resolved);
// the reducer can provide some predefined selectors of data
// export const getUnresolvedBugs = (state) => state.entities.bugs.filter((bug) => !bug.resolved);

// Better with Memoization if data has not changed
// bugs => get unresolved bugs from cache
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) =>
    bugs.filter((bug) => {
      console.log('function executed');
      return !bug.resolved;
    })
);

export const getBugByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.filter((bug) => bug.userId === userId)
  );
