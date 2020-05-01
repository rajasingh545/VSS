
import get from "../api/";

export const REPORT_START = 'REPORT_START';
export const REPORT_ERROR = 'REPORT_ERROR';
export const REPORT_SUCCESS = 'REPORT_SUCCESS';
export const REQUESTDET_START = 'REQUESTDET_START';
export const REQUESTDET_ERROR = 'REQUESTDET_ERROR';
export const REQUESTDET_SUCCESS = 'REQUESTDET_SUCCESS';
require('es6-promise').polyfill();
require('isomorphic-fetch');
import * as API from "../config/api-config";
export function reportSuccess(loginData) {
  return {
    type: REPORT_SUCCESS,
    data:loginData
  };
}

export function reportStart() {
  return {
    type: REPORT_START,
  };
}
export function requestDetailsSuccess(loginData) {
    return {
      type: REQUESTDET_SUCCESS,
      data:loginData
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

export function fetchReport(obj){
    return function (dispatch) {
        let url = API.REPORT_URI;
        
          dispatch(reportStart())
          return fetch(url, {
            method: 'post',
            mode:'cors',
            headers: {'Content-Type':'text/plain'},
            body: JSON.stringify(obj)
          }).then(response => response.json())
              .then(json => dispatch(reportSuccess(json)));
      }

}