import { Map } from "immutable";

import {
  REQUESTDET_START,
  REQUESTDET_ERROR,
  REQUESTDET_SUCCESS,
  REQUESTPOST_SUCCESS,
  REQUESTPOST_CLEAR,
  LISTINGDETAILS_SUCCESS,
  LISTING_START,
  CLEAR_LISTING,
  WORKREQUESTPOST_SUCCESS,
} from "actions/workArrangement.actions";

const initialState = Map({
  loading: false,
  error: null,
  requestDet: null,
});

const actionsMap = {
  // Async action
  [REQUESTDET_START]: (state) => {
    return state.merge(
      Map({
        loading: true,
        error: null,
        requestDet: null,
      })
    );
  },

  [REQUESTDET_ERROR]: (state, action) => {
    return state.merge(
      Map({
        loading: false,
        error: action.error.message,
      })
    );
  },
  [REQUESTDET_SUCCESS]: (state, action) => {
    return state.merge(
      Map({
        loading: false,
        requestDet: action.data,
      })
    );
  },
  [LISTING_START]: (state) => {
    return state.merge(
      Map({
        loadingListing: true,
        error: null,
        listingDetails: null,
      })
    );
  },
  [LISTINGDETAILS_SUCCESS]: (state, action) => {
    return state.merge(
      Map({
        loadingListing: false,
        listingDetails: action.data,
      })
    );
  },
  [CLEAR_LISTING]: (state, action) => {
    return state.merge(
      Map({
        loading: false,
        requestPost: [],
      })
    );
  },

  [REQUESTPOST_SUCCESS]: (state, action) => {
    return state.merge(
      Map({
        loading: false,
        requestPost: action.data,
      })
    );
  },

  [REQUESTPOST_CLEAR]: (state, action) => {
    return state.merge(
      Map({
        loading: false,
        requestPost: [],
      })
    );
  },
  [WORKREQUESTPOST_SUCCESS]: (state, action) => {
    return state.merge(
      Map({
        loadingListing: false,
        workRequestData: action.data,
      })
    );
  },
};

export default function reducer(state = initialState, action = {}) {
  const fn = actionsMap[action.type];
  return fn ? fn(state, action) : state;
}
