export const LOGIN_START = "LOGIN_START";
export const LOGIN_ERROR = "LOGIN_ERROR";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
require("es6-promise").polyfill();
require("isomorphic-fetch");
import { LOGIN_URI } from "../config/api-config";
export function loginSuccess(loginData) {
  return {
    type: LOGIN_SUCCESS,
    data: loginData
  };
}

export function loginStart() {
  return {
    type: LOGIN_START
  };
}

export function validateLogin(userName, password) {
  return function(dispatch) {
    let url = LOGIN_URI + "?username=" + userName + "&password=" + password;

    dispatch(loginStart());
    return fetch(url, {
      method: "get",
      mode: "cors",
      headers: { "Content-Type": "text/plain" }
    })
      .then(response => response.json())
      .then(json => dispatch(loginSuccess(json)));
  };
}
