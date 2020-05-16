import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import {DOMAIN_NAME} from "../../config/api-config";
import Sidebar from 'react-sidebar';
import {Button, Glyphicon, Navbar, Nav, NavItem, MenuItem} from "react-bootstrap";
import Accordion from '../../common/Accordion';


const defaultStyles = {
  root: {
    position: 'absolute',
    top: 26600,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  sidebar: {
    zIndex: 2,
    position: 'absolute',
    top: 0,
    bottom: 0,
    transition: 'transform .3s ease-out',
    WebkitTransition: '-webkit-transform .3s ease-out',
    willChange: 'transform',
    overflowY: 'auto',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'scroll',
    WebkitOverflowScrolling: 'touch',
    transition: 'left .3s ease-out, right .3s ease-out',
  },
  overlay: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity .3s ease-out, visibility .3s ease-out',
    backgroundColor: 'rgba(0,0,0,.3)',
  },
  dragHandle: {
    zIndex: 1,
    position: 'fixed',
    top: 0,
    bottom: 0,
  },
};
@withRouter
export default class Header extends Component {
  constructor(props) {
    super(props);

     let title = this.setTilte();
  
    this.state = {      
            pagename:title,
            docked: false,
            open: false,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: false,
            touchHandleWidth: 20,
            dragToggleDistance: 30,
            panelStyle:defaultStyles
    };

    
    
  }

  componentWillReceiveProps(){
    let page = window.location.pathname;
    // console.log("listingid", listingid);
    let title = this.setTilte();
  
    
    this.setState({pagename:title});
  }
  updateModal(isVisible) {
    	this.state.isVisible = isVisible;
      this.forceUpdate();
    }
  setTilte =() =>{
     let page = window.location.pathname;
    // console.log("listingid", listingid);
    let title = "Details";
    // console.log("page",page);
    if(page.match(/home/gi)){
      title = "Home"
    }
    else if(page.match(/\/$/gi)){
      title = "Login"
    }
     else if(page.match(/login/gi)){
      title = "Login"
    }
    else if(page.match(/Attendance/gi)){
      title = "Attendance";
    }
    else if(page.match(/AttendanceList/gi)){
      title = "Attendance List";
    }
    else if(page.match(/WorkArrangmentList/gi)){
      title = "Work Arrangement List";
    }
    else if(page.match(/WorkArrangment/gi)){
      title = "Work Arrangement";
    }
    else if(page.match(/WorkRequestList/gi)){
      title = "Work Request List";
    }
    else if(page.match(/WorkRequest/gi)){
      title = "Work Request";
    }
    else if(page.match(/DailyWorkTrackList/gi)){
      title = "Daily Work Progress List";
    }
    else if(page.match(/DailyWorkTrack/gi)){
      title = "Daily Work Progress";
    }
    else if(page.match(/Report/gi)){
      title = "Report";
    }
   
     else if(page.match(/View/gi)){
      title = "Details";
    }
     else if(page.match(/generatedo/gi)){
      title = "Details";
    }
    else if(page.match(/driverview/gi)){
      title = "Details";
    }
    else if(page.match(/Acknowledge/gi)){
      title = "Acknowledegement";
    }
    
    return title;
  }
  
  goBack = () => {    
     this.props.history.push('/Home'); 
     this.onSetOpen(false);
  }
  goToUrl = (url) => {    
     this.props.history.push(url); 
     this.onSetOpen(false);
  }
 

  logout = () =>{
    sessionStorage.setItem("userId", "");
    sessionStorage.setItem("userType", "");       
    sessionStorage.setItem("userName", ""); 
    this.onSetOpen(false) ;     
    this.props.history.push('/Login');
  }
   onSetOpen =(open)=> {
    //  console.log("open", open)
    let styles = this.state.panelStyle;
    // console.log("styles=", styles, open);
    if(open === true){
      styles.root={
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      };
      // console.log("styles", styles);
      this.setState({panelStyle:styles});
    }
    else{
      styles.root={
        position: 'absolute',
        top: 26600,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      };
      this.setState({panelStyle:styles});
      // console.log("styles", styles);
    }

    this.setState({open: open});
  }
  menuButtonClick =(ev) => {
    ev.preventDefault();
    this.onSetOpen(!this.state.open);
  }
  sideBarContent = () =>{

    const styles2 = {
        sidebar: {
          width: 256,
          height: '100%',
        },
        sidebarLink: {
          display: 'block',
          padding: '6px 0px',
          textDecoration: 'none',
          color: '#757575',
        },
        divider: {
          margin: '8px 0',
          height: 1,
          
        },
        content: {
          padding: '16px',
          height: '100%',
          backgroundColor: 'white',
        },
      };
       let username = sessionStorage.getItem("userName");      
       let userType = sessionStorage.getItem("userType");      
    return(
    <div style={styles2.content}>
         
        <div style={{width:"100%",textAlign:"right",cursor:"pointer"}} onClick={this.menuButtonClick}><Glyphicon glyph="remove"/> </div>
        <div style={styles2.sidebarLink}>Welcome <strong>{username}</strong></div>
        <div style={styles2.divider} />
        <a href="javascript:void(0);" onClick={this.goBack} style={styles2.sidebarLink}><Glyphicon glyph="home"/> Home</a>
       
          <Accordion allowMultipleOpen>
          {userType == 1 && 
            <div label='Work Arrangements'>
            
              <a href="javascript:void(0);" onClick={()=>this.goToUrl('/WorkArrangment')} style={styles2.sidebarLink}>Create Work Arrangement</a>   
              <a href="javascript:void(0);" onClick={()=>this.goToUrl('/WorkArrangmentList')} style={styles2.sidebarLink}> Work Arrangement List</a> 
                 
            </div>
          }
          {userType == 5 && 
            <div label='Work Arrangements'>
              <a href="javascript:void(0);" onClick={()=>this.goToUrl('/WorkArrangmentList')} style={styles2.sidebarLink}> Work Arrangement List</a> 
                 
            </div>
          }
            <div label='Attendance'>
            {(userType == 1 || userType == 5 ) &&
              <a href="javascript:void(0);" onClick={()=>this.goToUrl('/Attendance')} style={styles2.sidebarLink}> Create Attendance</a> 
              }  
              {(userType == 1 ) &&
              <a href="javascript:void(0);" onClick={()=>this.goToUrl('/AttendanceList')} style={styles2.sidebarLink}> Attendance List</a> 
              } 
            </div>
            {(userType == 1 || userType == 5) && 
              <div label='Work Request'>
               
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/WorkRequest')} style={styles2.sidebarLink}> Create Work Request</a>   
               
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/WorkRequestList')} style={styles2.sidebarLink}> Work Request List</a>   
              
              </div>
            }
            {(userType == 1 || userType == 5) && 
              <div label='Daily Work Track'>
                
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/DailyWorkTrack')} style={styles2.sidebarLink}>Create DWTR</a>   
                
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/DailyWorkTrackList')} style={styles2.sidebarLink}>DWTR List</a>   
              
              </div>
            }
            {userType == 1 && 
              <div label='Productivity Report'>
                
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/DWTRReport')} style={styles2.sidebarLink}>DWTR Report</a>   
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/Report-Supervisor')} style={styles2.sidebarLink}>Productivity Report by <br />Supervisor</a>   
                
                <a href="javascript:void(0);" onClick={()=>this.goToUrl('/Report-Sites')} style={styles2.sidebarLink}>Productivity Report by <br /> Site & Supervisor</a>   
              
              </div>
            }
        </Accordion>
        
        <a href="javascript:void(0);" onClick={this.logout} style={styles2.sidebarLink}><Glyphicon glyph="log-out"/> Logout</a>
        <div style={styles2.divider} />
         
       
      </div>);
  }
  

  render() {
    let iconurl = DOMAIN_NAME+"/assets/img/icon.png";
    let backButton = DOMAIN_NAME+"/assets/back_24.png";
    var sidebar = <this.sideBarContent />;
 
    const sidebarProps = {
      sidebar: sidebar,
      docked: this.state.docked,
      sidebarClassName: 'custom-sidebar-class',
      open: this.state.open,
      touch: this.state.touch,
      shadow: this.state.shadow,
      pullRight: this.state.pullRight,
      touchHandleWidth: this.state.touchHandleWidth,
      dragToggleDistance: this.state.dragToggleDistance,
      transitions: this.state.transitions,
      onSetOpen: this.onSetOpen,
    };
 
    return (
     <div className="headerBK">
       <Sidebar {...sidebarProps} styles={this.state.panelStyle}>
     </Sidebar> 
     
    
   
      
   
      <div className="TitleLogin" >
        
        <Navbar varient="dark" >
                <img src={iconurl} className="imgFixed" />
                 <Button style={{float:"left", marginTop: "5px"}} onClick={this.menuButtonClick}>
                  <Glyphicon glyph="align-justify" />
                </Button>
                
                
                &nbsp;<Navbar.Brand href="#home"> &nbsp;{this.state.pagename}</Navbar.Brand>
              
                
        
               </Navbar>
            
      </div>
         
       
        </div>
     
    );
  }
}
