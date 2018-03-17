import {combineReducers} from 'redux';
import user from './user';
import ojnames from './ojnames.js';
import {reducer as notifications} from 'react-notification-system-redux';

export default combineReducers({
  notifications,
  user,
  ojnames,
});
