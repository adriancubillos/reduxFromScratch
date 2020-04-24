import configureStore from './store/configureStore';
// import { bugAdded, bugRemoved, bugResolved } from './store/bugs';
//If module is not to big we can use * instead of individual imports;
import * as actions from './store/bugs';
import { projectAdded } from './store/projects';

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.dispatch(projectAdded({ name: 'Project' }));

// We pass the data now as an object that will be the payload attribute to our actionCreator functions
store.dispatch(actions.bugAdded({ description: 'Bug' }));
store.dispatch(actions.bugAdded({ description: 'Bug' }));
store.dispatch(actions.bugAdded({ description: 'Bug' }));

store.dispatch(actions.bugResolved({ id: 1 }));

// // unsubscribe();

store.dispatch(actions.bugRemoved({ id: 2 }));
