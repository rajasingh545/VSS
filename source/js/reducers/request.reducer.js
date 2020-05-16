import { Map } from 'immutable';

import {
  REQUESTDET_START,
  REQUESTDET_ERROR,
  REQUESTDET_SUCCESS,
  REQUESTPOST_SUCCESS,
  LISTINGDETAILS_SUCCESS,
  VIEWDETAILS_START,
  VIEWDETAILS_SUCCESS,
  REPORTDET_START,
  REPORTDET_ERROR,
  REPORTDET_SUCCESS,
  REPORTPOST_SUCCESS,
  CLEAR_LISTING,
  CLEAR_VIEWDETAILS,
  LISTING_START,
  REQUESTPOST_CLEAR,
  REQUESTDONUMBER_SUCCESS
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
  [LISTING_START]: (state) => {
    return state.merge(Map({
      loadingListing: true,
      error: null,
      listingDetails: null,
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
  [CLEAR_LISTING]: (state, action) => {
   
    return state.merge(Map({
      loading: false,
      listingDetails: [],
    }));
  },
  [REQUESTPOST_SUCCESS]: (state, action2) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loading: false,
      requestPost: action2.data,
    }));
  },
  
  [REQUESTDONUMBER_SUCCESS]: (state, action2) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loading: false,
      requestDONumber: action2.data,
    }));
  },
  [REQUESTPOST_CLEAR]: (state, action) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loading: false,
      requestPost: [],
    }));
  },

  [LISTINGDETAILS_SUCCESS]: (state, action) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loadingListing: false,
      listingDetails: action.data,
    }));
  },
  [VIEWDETAILS_START]: (state) => {
    return state.merge(Map({
      loadingViewDetail: true,
      viewDetails: null,
    }));
  },
  [VIEWDETAILS_SUCCESS]: (state, action) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loadingViewDetail: false,
      viewDetails: action.data,
    }));
  },
  [CLEAR_VIEWDETAILS]: (state, action) => {
    // console.log("action", state, action);
    return state.merge(Map({
      loading: false,
      viewDetails: [],
    }));
  },
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
