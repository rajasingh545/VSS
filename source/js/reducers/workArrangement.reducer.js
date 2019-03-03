import { Map } from 'immutable';

import {
  REQUESTDET_START,
  REQUESTDET_ERROR,
  REQUESTDET_SUCCESS,
  REQUESTPOST_SUCCESS
  
} from 'actions/request.actions';



const initialState = Map({
  loading: false,
  error: null,
  requestDet: null,
});

const actionsMap = {
  // Async action
  [REQUESTDET_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
      requestDet: null,
    }));
  },
  
  [REQUESTDET_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [REQUESTDET_SUCCESS]: (state, action) => {
   
    return state.merge(Map({
      loading: false,
      requestDet: action.data,
    }));
  },
   
  [REPORTPOST_SUCCESS]: (state, action) => {
    // console.log("action==", state, action);
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
