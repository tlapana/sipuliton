import { combineReducers } from 'redux';
import * as app from './modules/app';


export default combineReducers({
  [app.constants.NAME]: app.reducer
});
