import configureStore from './store/configureStore';
import { loadBugs, addBug } from './store/bugs';

const store = configureStore();

store.dispatch(addBug({ description: 'Bug' }));
