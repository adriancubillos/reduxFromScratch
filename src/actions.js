import * as actions from './actionTypes';

// No return but using parenthesis to return an object
export const bugAdded = (description) => ({
  type: actions.BUG_ADDED,
  payload: {
    description: description
  }
});

// wit return to compare with previous function
// Behave the same
export const bugRemoved = (id) => {
  return {
    type: actions.BUG_REMOVED,
    payload: {
      id: id
    }
  };
};

export const bugResolved = (id) => ({
  type: actions.BUG_RESOLVED,
  payload: {
    id // We can use just one the param as it is the same as the argument
  }
});
