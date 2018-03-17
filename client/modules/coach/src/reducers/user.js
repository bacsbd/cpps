import * as types from 'actions/actionTypes';


const defaultUser = {
  username: '',
  userId: '',
  status: '',
  login: false,
  email: '',
};

export default function user(state=defaultUser, action) {
  switch (action.type) {
    case types.SET_USER:
      return action.user;
    default:
      return state;
  }
}
