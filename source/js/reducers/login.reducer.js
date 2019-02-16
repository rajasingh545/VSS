import { Map } from 'immutable';

import {
  LOGIN_START,
  LOGIN_ERROR,
  LOGIN_SUCCESS,
} from 'actions/login.actions';

const initialState = Map({
  loading: false,
  error: null,
  userId: null,
});

const actionsMap = {
  // Async action
  [LOGIN_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
      userId: null,
    }));
  },
  [LOGIN_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [LOGIN_SUCCESS]: (state, action) => {
   
    return state.merge(Map({
      loading: false,
      userId: action.data,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
