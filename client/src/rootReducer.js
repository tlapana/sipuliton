import { combineReducers } from 'redux';
import * as app from './modules/app';
import * as login from './modules/login';


export default combineReducers({
  [app.constants.NAME]: app.reducer,
  [login.constants.NAME]: login.reducer,
});
