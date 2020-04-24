import store from './store';
import { bugAdded, bugRemoved, bugResolved } from './actions';

const unsubscribe = store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.dispatch(bugAdded('Bug'));
store.dispatch(bugAdded('Bug'));
store.dispatch(bugAdded('Bug'));

store.dispatch(bugResolved(3));

// unsubscribe();

store.dispatch(bugRemoved(1));
