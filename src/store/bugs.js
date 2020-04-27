import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';

const initialState = {
  list: [],
  loading: false,
  lastFetch: null
};
let lastId = 0;

const slice = createSlice({
  name: 'bugs',
  initialState,
  //REDUCERS
  reducers: {
    bugsRequested: (bugs, action) => {
      bugs.loading = true;
    },
    bugsRequestedFailed: (bugs, action) => {
      bugs.loading = false;
    },
    bugsReceived: (bugs, action) => {
      bugs.list = action.payload;
      bugs.loading = false;
    },
    bugAdded: (bugs, action) => {
      bugs.list.push({
        id: ++lastId,
        description: action.payload.description + '-' + lastId,
        resolved: false
      });
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list.splice(index, 1);
    },
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].resolved = true;
    },
    bugAssignedToUser: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs[index].userId = action.payload.userId;
    }
  }
});
// object destructuring to export the action creators
export const {
  bugAdded,
  bugResolved,
  bugRemoved,
  bugAssignedToUser,
  bugsReceived,
  bugsRequested,
  bugsRequestedFailed
} = slice.actions;
export default slice.reducer;

// ACTION CREATORS
// To encapsulate specific details of actions.
const url = '/bugs';

export const loadBugs = () =>
  apiCallBegan({
    url,
    onStart: bugsRequested.type,
    onSuccess: bugsReceived.type,
    onError: bugsRequestedFailed.type
  });

// SELECTORS
// Selector function
// instead of accessing the store and performing queries against it
// this was form index.js ==> const unresolvedBugs = store.getState().entities.bugs.list.filter((bug) => !bug.resolved);
// the reducer can provide some predefined selectors of data
// export const getUnresolvedBugs = (state) => state.entities.bugs.list.filter((bug) => !bug.resolved);

// Better with Memoization if data has not changed
// bugs => get unresolved bugs from cache
export const getUnresolvedBugs = createSelector(
  (state) => state.entities.bugs,
  (bugs) =>
    bugs.list.filter((bug) => {
      console.log('function executed');
      return !bug.resolved;
    })
);

export const getBugByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );
