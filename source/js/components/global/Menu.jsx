import React, { Component } from 'react';
import {DOMAIN_NAME} from "../../config/api-config";
import {Button, Glyphicon, Navbar, Nav, NavItem, MenuItem} from "react-bootstrap";

export default class Menu extends Component {
  render() {
    let iconurl = DOMAIN_NAME+"/assets/img/icon.png";
    let backButton = DOMAIN_NAME+"/assets/back_24.png";
    return (
     <div className="LoginBK">
       <Navbar bg="primary" variant="dark" width="100%">
       <img src={iconurl} className="imgFixed" />
                <Navbar.Brand href="#home">  Login </Navbar.Brand>
        </Navbar>
        </div>
     
    );
  }
}
