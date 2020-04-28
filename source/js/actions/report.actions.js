
// import get from "../api/";
export const REPORTDET_START = 'REPORTDET_START';
export const REPORTDET_ERROR = 'REPORTDET_ERROR';
export const REPORTDET_SUCCESS = 'REPORTDET_SUCCESS';
export const REPORTPOST_SUCCESS = 'REPORTPOST_SUCCESS';


import * as API from "../config/api-config";

require('es6-promise').polyfill();
require('isomorphic-fetch');

export function reportDetailsSuccess(loginData) {
  return {
    type: REPORTDET_SUCCESS,
    data:loginData
  };
}
export function reportPostSuccess(data) {
  console.log("in action", data);
  return {
    type: REPORTPOST_SUCCESS,
    data:data
  };
}


export function reportDetailsStart() {
  return {
    type: REPORTDET_START,
  };
}

export function reportDetails(){
  return function (dispatch) {
    let url = API.REPORT_URI;
    
      dispatch(reportDetailsStart())
      return fetch(url)
          .then(response => response.json())
          .then(json => dispatch(reportDetailsSuccess(json)));
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