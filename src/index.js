import configureStore from './store/configureStore';
import * as actions from './store/api';

const store = configureStore();

store.dispatch(
  actions.apiCallBegan({
    url: '/bugs',
    onSuccess: 'bugs/bugsReceived'
    // We get ride of onError here unless want to do something specific if an error arise
    // if it is something general like displaying a toast we can do it in the middleware
  })
);
