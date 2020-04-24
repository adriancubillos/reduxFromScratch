// Action types
const BUG_ADDED = 'BUG_ADDED';
const BUG_REMOVED = 'BUG_REMOVED';
const BUG_RESOLVED = 'BUG_RESOLVED';

// Action creators
// No return but using parenthesis to return an object
export const bugAdded = (description) => ({
  type: BUG_ADDED,
  payload: {
    description: description
  }
});

// wit return to compare with previous function
// Behave the same
export const bugRemoved = (id) => {
  return {
    type: BUG_REMOVED,
    payload: {
      id: id
    }
  };
};

export const bugResolved = (id) => ({
  type: BUG_RESOLVED,
  payload: {
    id // We can use just one the param as it is the same as the argument
  }
});

//Reducer
const initialState = [];
let lastId = 0;
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case BUG_ADDED:
      return [
        ...state,
        {
          id: ++lastId,
          description: action.payload.description + '-' + lastId,
          resolved: false
        }
      ];

    case BUG_REMOVED:
      return state.filter((bug) => bug.id !== action.payload.id);

    case BUG_RESOLVED:
      return state.map((bug) => (bug.id === action.payload.id ? { ...bug, resolved: true } : bug));
    default:
      return state;
  }
}
