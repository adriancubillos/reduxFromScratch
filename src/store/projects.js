import { createSlice } from '@reduxjs/toolkit';

const initialState = [];
let lastId = 0;

const slice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    projectAdded: (projects, action) => {
      projects.push({
        id: ++lastId,
        name: action.payload.name + '-' + lastId
      });
    }
  }
});
// object destructuring to export the action creators
export const { projectAdded } = slice.actions;
export default slice.reducer;
