import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import { apiCallBegan } from './api';
import moment from 'moment';
import axios from 'axios';

const initialState = {
  list: [],
  loading: false,
  lastFetch: null
};

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
      bugs.lastFetch = Date.now();
    },
    // command - event
    // addBug - bugAdded
    bugAdded: (bugs, action) => {
      bugs.list.push(action.payload);
    },
    bugRemoved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list.splice(index, 1);
    },
    // resolveBug (command) - bugResolved (event)
    bugResolved: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].resolved = action.payload.resolved;
    },
    bugAssignedToUser: (bugs, action) => {
      const index = bugs.list.findIndex((bug) => bug.id === action.payload.id);
      bugs.list[index].userId = action.payload.userId;
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

// This function Returns a plain javascript object
// () => {}
// and we don't have access to the current state
// if we want access to the current state we need to return a function
// export const loadBugs = () =>
//   apiCallBegan({
//     url,
//     onStart: bugsRequested.type,
//     onSuccess: bugsReceived.type,
//     onError: bugsRequestedFailed.type
//   });

// In order to get the state on this creator
// we can leverage the use of thunk
// that allow us to dispatch functions that can optionally receive 2 arguments
// () => fn(dispatch, getState)
export const loadBugs = () => (dispatch, getState) => {
  const { lastFetch } = getState().entities.bugs;

  const diffInMinutes = moment().diff(moment(lastFetch), 'minutes');

  if (diffInMinutes < 10) return;

  dispatch(
    apiCallBegan({
      url,
      onStart: bugsRequested.type,
      onSuccess: bugsReceived.type,
      onError: bugsRequestedFailed.type
    })
  );
};

// I was getting an error like:
// Uncaught (in promise) Error:
// Actions must be plain objects. Use custom middleware for async actions
// Had to add the dispatch Currying !!!!!
export const addBug = (bug) => async (dispatch) => {
  const response = await axios.request({
    baseURL: 'http://localhost:9001/api',
    url: '/bugs',
    method: 'post',
    data: bug
  });
  dispatch(bugAdded(response.data));
};

// export const addBug = (bug) =>
//   apiCallBegan({
//     url,
//     method: 'post',
//     data: bug,
//     onSuccess: bugAdded.type
//   });

export const resolveBug = (bugId) =>
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { resolved: true },
    onSuccess: bugResolved.type
  });

export const assignBugToUser = (bugId, userId) =>
  apiCallBegan({
    url: `${url}/${bugId}`,
    method: 'patch',
    data: { userId },
    onSuccess: bugAssignedToUser.type
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
      return !bug.resolved;
    })
);

export const getBugByUser = (userId) =>
  createSelector(
    (state) => state.entities.bugs,
    (bugs) => bugs.list.filter((bug) => bug.userId === userId)
  );
