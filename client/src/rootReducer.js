import { combineReducers } from 'redux';
import app from './modules/app';


export default combineReducers({
  [app.constants.NAME]: app.reducer
});
