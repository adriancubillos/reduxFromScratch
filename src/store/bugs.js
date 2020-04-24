import { createAction, createReducer } from '@reduxjs/toolkit';

// Action creators
// No return but using parenthesis to return an object
export const bugAdded = createAction('bugAdded');
// The code to define the payload is not longer needed.
// the payload will be passed as a parameter to this "bugAdded" action creator
/*
(description) => ({
  type: BUG_ADDED,
  payload: {
    description: description
  }
});
*/

//We do NOT need actionTypes lists anymore, the action type is now defined as teh first parameter here.
// we can access the action type by using bugRemoved.type or bugRemoved.toString()
export const bugRemoved = createAction('bugRemoved');
export const bugResolved = createAction('bugResolved');

const initialState = [];
let lastId = 0;

// Reducer with reduxjs toolkit
// It uses immer to do the immutable handling while you write regular mutable code inside the action handler.
// first parameter is the in initial state
// Second parameter is an object that map actions to functions that handle those actions.
export default createReducer(initialState, {
  // (key,value) pairs
  // key: actionName
  // value: function to handle the action
  [bugAdded.type]: (state, action) => {
    state.push({
      id: ++lastId,
      description: action.payload.description + '-' + lastId,
      resolved: false
    });
  },
  [bugRemoved.type]: (state, action) => {
    state.filter((bug) => bug.id !== action.payload.id);
  },
  [bugResolved.type]: (state, action) => {
    const index = state.findIndex((bug) => bug.id === action.payload.id);
    state[index].resolved = true;
  }
});

// // Reducer
// export default function reducer(state = initialState, action) {
//   switch (action.type) {
//     // As stated before we can access the action type by using actionCreator.type
//     case bugAdded.type:
//       return [
//         ...state,
//         {
//           id: ++lastId,
//           description: action.payload.description + '-' + lastId,
//           resolved: false
//         }
//       ];

//     case bugRemoved.type:
//       return state.filter((bug) => bug.id !== action.payload.id);

//     case bugResolved.type:
//       return state.map((bug) => (bug.id === action.payload.id ? { ...bug, resolved: true } : bug));
//     default:
//       return state;
//   }
// }
