import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();


/* POST Method */
export function requestPost(apiUrl, postData, callBack){
    
    let headerObj = {'Content-Type': 'application/json', Accept: 'application/json'};
    let paramsObj = { 
            method: 'POST',   
            body: JSON.stringify(postData), 
            headers: new Headers(headerObj)   
        };
    return fetch(apiUrl, paramsObj)
     .then(response => response.json())
     .then(json => callBack(json, postData))
     .catch(function(error) {
        //console.error('Problem with your POST operation: ' + error.message);
      });
}

/* GET Method */
export function requestGet(apiUrl, params, callBack){
    
    let apiUrlWithParams = '';
    if(params)
        apiUrlWithParams = apiUrl+"?"+params;
    else
        apiUrlWithParams = apiUrl;

    let paramsObj = { 
            method: 'GET',
            cache: 'default'
        };
     return fetch(apiUrlWithParams, paramsObj)
      .then(response => response.json())
      .then(json => callBack(json))
      .catch(function(error) {
       // console.error('Problem with your GET operation: ' + error.message);
       });
}