import configureStore from './store/configureStore';
import { loadBugs, addBug, resolveBug, assignBugToUser } from './store/bugs';

const store = configureStore();

store.dispatch(
  addBug({
    description: 'Returned to normal implementation with middleware'
  })
);

store.dispatch(loadBugs());

setTimeout(() => {
  store.dispatch(assignBugToUser(4, 2));
}, 2000);

setTimeout(() => {
  store.dispatch(resolveBug(4));
}, 4000);
