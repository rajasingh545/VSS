import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import LoginHeader from 'common/LoginHeader';
import Header from "common/header";
import Home from 'pages/Home';
import Login from "pages/Login";
import NotFound from 'pages/NotFound';
import Attendance from 'pages/Attendance';
import AttendanceEdit from 'pages/AttendanceEdit';
import AttendanceList from 'pages/AttendanceList';
import WorkArrangment from 'pages/WorkArrangement';
import WorkArrangmentEdit from 'pages/WorkArrangementEdit';
import WorkArrangmentList from 'pages/WorkArrangementList';
import WorkRequestList from 'pages/WorkRequestList';
import WorkRequest from 'pages/WorkRequest';
import WorkRequestEdit from 'pages/WorkRequestEdit';
import DailyWorkTrack from 'pages/DailyWorkTrack';
import DailyWorkTrackList from 'pages/DailyWorkTrackList';
import DailyWorkTrackEdit from 'pages/DailyWorkTrackEdit';
import DWTRPreview from 'pages/DWTRPreview';
import ReportSupervisor from "pages/ReportSupervisor";
import DWTRReport from "pages/DWTRReport";
import ReportSites from "pages/ReportSites";
class App extends Component {
  constructor(props) {
    super(props);
  }
  
 
  render() {
    let currentUser = sessionStorage.getItem("userId");
    
    return (
    
     <div className="mobileContainer">
        {(currentUser)? <Header /> :  <LoginHeader />}
      
        <div className='Page'>
         <Switch>
            <Route exact path="/" component={ Login } />
            <Route exact path="/Home" component={ Home } />
            <Route exact path="/Login" component={ Login } />
            <Route exact path="/Attendance" component={ Attendance } /> 
            <Route exact path="/Attendance/:id/:pid" component={ AttendanceEdit } />            
            <Route exact path="/AttendanceList" component={ AttendanceList } />
            <Route exact path="/WorkRequest" component={ WorkRequest } />
            <Route exact path="/WorkRequest/:id" component={ WorkRequestEdit } />
            <Route exact path="/WorkRequestList" component={ WorkRequestList } />
            <Route exact path="/WorkArrangment" component={ WorkArrangment } />            
            <Route exact path="/WorkArrangment/:id" component={ WorkArrangmentEdit } />
            <Route exact path="/WorkArrangmentList" component={ WorkArrangmentList } />
            <Route exact path="/DailyWorkTrack" component={ DailyWorkTrack } />
            <Route exact path="/DailyWorkTrackList" component={ DailyWorkTrackList } />
            <Route exact path="/DailyWorkTrack/:id" component={ DailyWorkTrackEdit } />
            <Route exact path="/DWTRPreview/:id" component={ DWTRPreview  } />
            <Route exact path="/DWTRReport" component={ DWTRReport } />
            <Route exact path="/Report-Supervisor" component={ ReportSupervisor  } />
            <Route exact path="/Report-Sites" component={ ReportSites  } />
            <Route path='*' component={ NotFound } />
            
          </Switch>
        </div>
      </div>
     
    );
  }
}

export default hot(module)(App);
