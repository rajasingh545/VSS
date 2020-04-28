import { Map } from 'immutable';

import {
    REPORTDET_START,
    REPORTDET_ERROR,
    REPORTPOST_SUCCESS,
  
} from 'actions/report.actions';

const initialState = Map({
  loading: false,
  error: null,
  reportData: null,
});

const actionsMap = {
  // Async action
  [REPORTDET_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
      reportPost: null,
    }));
  },
  [REPORTDET_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
 
  [REPORTPOST_SUCCESS]: (state, action) => {
    console.log("action==", state, action);
    return state.merge(Map({
      loading: false,
      reportData: action.data,
    }));
  }
  
  
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
