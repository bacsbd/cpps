import * as types from 'actions/actionTypes';

function setOjnames(ojnames) {
  return {
    type: types.SET_OJNAME,
    ojnames,
  };
}

export function fetchOJnames() {
  return async (dispatch) => {
    try {
      let resp = await fetch('/api/v1/ojnames', {
        credentials: 'same-origin',
      });
      resp = await resp.json();
      if (resp.status !== 200) throw resp;
      dispatch(setOjnames(resp.data));
    } catch (err) {
      console.error(`Failed to fetch: ${err}`);
    }
  };
}
