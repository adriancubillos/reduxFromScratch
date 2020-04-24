import configureStore from './store/configureStore';
// import { bugAdded, bugRemoved, bugResolved } from './store/bugs';
//If module is not to big we can use * instead of individual imports;
import * as actions from './store/bugs';

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.dispatch(actions.bugAdded('Bug'));
store.dispatch(actions.bugAdded('Bug'));
store.dispatch(actions.bugAdded('Bug'));

store.dispatch(bugResolved(1));

// // unsubscribe();

// store.dispatch(bugRemoved(1));
