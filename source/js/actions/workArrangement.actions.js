
// import get from "../api/";
export const REQUESTDET_START = 'REQUESTDET_START';
export const REQUESTDET_ERROR = 'REQUESTDET_ERROR';
export const REQUESTDET_SUCCESS = 'REQUESTDET_SUCCESS';
export const REQUESTPOST_SUCCESS = 'REQUESTPOST_SUCCESS';

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

export function requestDetailsStart() {
  return {
    type: REQUESTDET_START,
  };
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
  
    fetch(API.REQUEST_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response => response.json())
          .then(json => dispatch(requestPostSuccess(json)));
  }
}
export function reportPost(obj){
    
  return function (dispatch) {
    // dispatch(reportDetailsStart());
    fetch(API.REPORT_URI, {
        method: 'post',
        mode:'cors',
        headers: {'Content-Type':'text/plain'},
        body: JSON.stringify(obj)
      }).then(response => response.json())
          .then(json => dispatch(reportPostSuccess(json)));
  }
}