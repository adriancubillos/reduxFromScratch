import configureStore from './store/configureStore';
// import { bugAdded, bugRemoved, bugResolved } from './store/bugs';
//If module is not to big we can use * instead of individual imports;
import { bugAdded, bugResolved, getUnresolvedBugs, bugAssignedToUser, getBugByUser } from './store/bugs';
import { projectAdded } from './store/projects';
import { userAdded } from './store/users';

const store = configureStore();

const unsubscribe = store.subscribe(() => {
  console.log('store changed', store.getState());
});

store.dispatch(userAdded({ name: 'User' }));
store.dispatch(userAdded({ name: 'User' }));
store.dispatch(projectAdded({ name: 'Project' }));

// We pass the data now as an object that will be the payload attribute to our actionCreator functions
store.dispatch(bugAdded({ description: 'Bug' }));
store.dispatch(bugAdded({ description: 'Bug' }));
store.dispatch(bugAdded({ description: 'Bug' }));

store.dispatch(bugResolved({ id: 1 }));

// // unsubscribe();

// store.dispatch(actions.bugRemoved({ id: 2 }));

// const unresolvedBugs = store.getState().entities.bugs.filter((bug) => !bug.resolved);
// Better to use a selector
const unresolvedBugs = getUnresolvedBugs(store.getState());
console.log(unresolvedBugs);

const unresolvedBugs2 = getUnresolvedBugs(store.getState());
console.log(unresolvedBugs2);

console.log('equality', unresolvedBugs === unresolvedBugs2);

store.dispatch(bugAssignedToUser({ id: 1, userId: 1 }));

const bugsByUser = getBugByUser(1)(store.getState());
console.log('###: ---------------------------');
console.log('###: bugsByUser', bugsByUser);
console.log('###: ---------------------------');
