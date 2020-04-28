import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import reducer from './reducer';
import logger from './middleware/logger';
import toast from './middleware/toastify';
import api from './middleware/api';

//can be renamed or use an anonymous function
export default function () {
  // instead of passing multiple arguments we pass a configuration object
  // configureStore form reduxjs/toolkit will automatically set up the store
  // to talk to redux devtools and allow us to dispatch asynchronous actions
  return configureStore({
    // reducer: reducer
    // We can use shorthand syntax as name is same as value
    reducer,
    middleware: [
      ...getDefaultMiddleware(),
      // logger({ destination: 'console' }),
      toast,
      api
    ]
  });
  // We can return directly no need for const
  // return store;
}
