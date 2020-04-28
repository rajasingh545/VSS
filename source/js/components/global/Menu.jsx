import React, { Component } from 'react';
import {DOMAIN_NAME} from "../../config/api-config";

export default class Menu extends Component {
  render() {
    let iconurl = DOMAIN_NAME+"/assets/img/icon.png";
    return (
     <div className="LoginBK">
      <div className="TitleLogin">
                <img src="client/assets/img/icon.png" className="imgFixed" /><h3> Login</h3>
              
        </div>
        </div>
     
    );
  }
}
