import {combineReducers} from 'redux';
import user from './user';
import {reducer as notifications} from 'react-notification-system-redux';

export default combineReducers({
  notifications,
  user,
});
