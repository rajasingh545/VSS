
// import get from "../api/";
export const REQUESTDET_START = 'REQUESTDET_START';
export const REQUESTDET_ERROR = 'REQUESTDET_ERROR';
export const REQUESTDET_SUCCESS = 'REQUESTDET_SUCCESS';
export const REQUESTPOST_SUCCESS = 'REQUESTPOST_SUCCESS';
export const WORKREQUESTPOST_SUCCESS = "WORKREQUESTPOST_SUCCESS";
export const REQUESTPOST_CLEAR = 'REQUESTPOST_CLEAR';
export const LISTING_START = "LISTING_START";
export const LISTINGDETAILS_SUCCESS = "LISTINGDETAILS_SUCCESS";
export const CLEAR_LISTING = "CLEAR_LISTING";

import * as API from "../config/api-config";

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function requestDetailsSuccess(loginData) {
  return {
    type: REQUESTDET_SUCCESS,
    data:loginData
  };
}
export function requestPostSuccess(data) {
  return {
    type: REQUESTPOST_SUCCESS,
    data:data
  };
}
export function workRequestPostSuccess(data) {
  return {
    type: WORKREQUESTPOST_SUCCESS,
    data:data
  };
}
export function requestPostClear(data) {
  return {
    type: REQUESTPOST_CLEAR,
    data:data
  };
}
export function clearListing(data){
  return {
  type:CLEAR_LISTING,
  data:data
  }
}
export function listingDetailsSuccess(data) {
  return {
    type: LISTINGDETAILS_SUCCESS,
    data:data
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
export function listigDetails(obj){
 
  return function (dispatch) {
    dispatch(listingStart());
    return fetch(API.REQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response =>response.json())
          .then(json => dispatch(listingDetailsSuccess(json)));
  }

}
export function fileuploads(obj){

  

  
    return fetch(API.WORKREQUEST_URI, {
      method: 'post',
      mode:'cors',
      body: obj,
    }).then(response =>response.json())
        .then(json => dispatch(workRequestPostSuccess(json)));
  
}

export function requestDetails(obj){
  return function (dispatch) {
    let url = API.COMMONAPI_URI;
    
      dispatch(requestDetailsStart())
      return fetch(url, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response => response.json())
          .then(json => dispatch(requestDetailsSuccess(json)));
  }

}


export function requestPost(obj){
  return function (dispatch) {
    dispatch(listingStart());
    fetch(API.REQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response => response.json())
          .then(json => dispatch(requestPostSuccess(json)));
  }
}
export function workRequestPost(obj){
    
  return function (dispatch) {
    // dispatch(reportDetailsStart());
    fetch(API.WORKREQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response => response.json())
          .then(json => dispatch(workRequestPostSuccess(json)));
  }
}
let cache = [];
function stringfyjson(key, value) {
  if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
              // If this value does not reference a parent it can be deduped
              return JSON.parse(JSON.stringify(value));
          } catch (error) {
              // discard key if value cannot be deduped
              return;
          }
      }
      // Store value in our collection
      cache.push(value);
  }
  return value;
}