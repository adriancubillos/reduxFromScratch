import { combineReducers } from 'redux';
import entitiesReducer from './entities';
// import projectsReducer from './projects';

export default combineReducers({
  entities: entitiesReducer
});
