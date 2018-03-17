import * as types from 'actions/actionTypes';


const defaultOjNames = [];

export default function ojnames(state=defaultOjNames, action) {
  switch (action.type) {
    case types.SET_OJNAME:
      return action.ojnames;
    default:
      return state;
  }
}
