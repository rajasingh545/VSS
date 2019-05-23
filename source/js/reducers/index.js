import { combineReducers } from 'redux';
import app from 'reducers/app';
import login from 'reducers/login.reducer';
import request from 'reducers/workArrangement.reducer';


export default combineReducers({
  app,
  login,
  request
});
