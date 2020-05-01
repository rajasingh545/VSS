import { Map } from 'immutable';

import {
  REPORT_START,
  REPORT_ERROR,
  REPORT_SUCCESS,
  REQUESTDET_START,
  REQUESTDET_ERROR,
  REQUESTDET_SUCCESS,
} from 'actions/report.actions';

const initialState = Map({
  loading: false,
  error: null,
  reportdata: null,
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
  [REPORT_START]: (state) => {
    return state.merge(Map({
      loading: true,
      error: null,
      userId: null,
    }));
  },
  [REPORT_ERROR]: (state, action) => {
    return state.merge(Map({
      loading: false,
      error: action.error.message,
    }));
  },
  [REPORT_SUCCESS]: (state, action) => {
   
    return state.merge(Map({
      loading: false,
      reportdata: action.data,
    }));
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
