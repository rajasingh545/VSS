export const REQUESTDET_START = "REQUESTDET_START";
export const REQUESTDET_ERROR = "REQUESTDET_ERROR";
export const REQUESTDET_SUCCESS = "REQUESTDET_SUCCESS";
export const REQUESTPOST_SUCCESS = "REQUESTPOST_SUCCESS";
export const LISTINGDETAILS_SUCCESS = "LISTINGDETAILS_SUCCESS";
export const VIEWDETAILS_START = "VIEWDETAILS_START";
export const VIEWDETAILS_SUCCESS = "VIEWDETAILS_SUCCESS";
export const CLEAR_LISTING = "CLEAR_LISTING";
export const CLEAR_VIEWDETAILS = "CLEAR_VIEWDETAILS";
export const LISTING_START = "LISTING_START";
export const REQUESTPOST_CLEAR = "REQUESTPOST_CLEAR";
export const REPORTDET_START = "REPORTDET_START";
export const REPORTDET_ERROR = "REPORTDET_ERROR";
export const REPORTDET_SUCCESS = "REPORTDET_SUCCESS";
export const REPORTPOST_SUCCESS = "REPORTPOST_SUCCESS";
export const REQUESTDONUMBER_SUCCESS = "REQUESTDONUMBER_SUCCESS";

import * as API from "../config/api-config";

require("es6-promise").polyfill();
require("isomorphic-fetch");

export function requestDetailsSuccess(loginData) {
  return {
    type: REQUESTDET_SUCCESS,
    data: loginData,
  };
}
export function requestPostSuccess(data) {
  return {
    type: REQUESTPOST_SUCCESS,
    data: data,
  };
}
export function requestPostClear(data) {
  return {
    type: REQUESTPOST_CLEAR,
    data: data,
  };
}
export function listingDetailsSuccess(data) {
  return {
    type: LISTINGDETAILS_SUCCESS,
    data: data,
  };
}
export function clearListing(data) {
  return {
    type: CLEAR_LISTING,
    data: data,
  };
}
export function clearViewDetail(data) {
  return {
    type: CLEAR_VIEWDETAILS,
    data: data,
  };
}
export function viewDetailsStart(data) {
  return {
    type: VIEWDETAILS_START,
  };
}
export function viewDetailsSuccess(data) {
  return {
    type: VIEWDETAILS_SUCCESS,
    data: data,
  };
}
export function requestDetailsStart() {
  return {
    type: REQUESTDET_START,
  };
}
export function listingStart() {
  return {
    type: LISTING_START,
  };
}

export function reportDetailsSuccess(loginData) {
  return {
    type: REPORTDET_SUCCESS,
    data: loginData,
  };
}
export function reportPostSuccess(data) {
  return {
    type: REPORTPOST_SUCCESS,
    data: data,
  };
}

export function reportDetailsStart() {
  return {
    type: REPORTDET_START,
  };
}

export function requestDONumberSuccess(data) {
  return {
    type: REQUESTDONUMBER_SUCCESS,
    data: data,
  };
}

export function requestDetails(obj) {
  return function (dispatch) {
    let url = API.COMMONAPI_URI;

    dispatch(requestDetailsStart());
    return fetch(url, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(requestDetailsSuccess(json)));
  };
}
export function requestDONumbers(obj) {
  return function (dispatch) {
    let url = API.COMMONAPI_URI;

    // dispatch(requestDetailsStart())
    return fetch(url, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(requestDONumberSuccess(json)));
  };
}
export function listigDetails(obj) {
  return function (dispatch) {
    dispatch(listingStart());
    return fetch(API.REQUEST_URI, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(listingDetailsSuccess(json)));
  };
}

export function viewDetails(obj) {
  return function (dispatch) {
    dispatch(viewDetailsStart());
    return fetch(API.REQUEST_URI, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(viewDetailsSuccess(json)));
  };
}

export function requestPost(obj) {
  return function (dispatch) {
    fetch(API.REQUEST_URI, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(requestPostSuccess(json)));
  };
}
export function reportPost(obj) {
  return function (dispatch) {
    // dispatch(reportDetailsStart());
    fetch(API.REPORT_URI, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((json) => dispatch(reportPostSuccess(json)));
  };
}
