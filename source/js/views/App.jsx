import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { routeCodes } from 'constants/routes';
import Menu from 'common/global/Menu';
import Header from "common/global/header";
import Home from 'views/Home';
import Login from "views/Login";
import NotFound from 'views/NotFound';
import Attendance from 'views/Attendance';
import AttendanceEdit from 'views/AttendanceEdit';
import AttendanceList from 'views/attendanceList';
import WorkArrangment from 'views/WorkArrangement';
import WorkArrangmentEdit from 'views/WorkArrangementEdit';
import WorkArrangmentList from 'views/WorkArrangementList';
import WorkRequestList from 'views/WorkRequestList';
import WorkRequest from 'views/WorkRequest';
import WorkRequestEdit from 'views/WorkRequestEdit';
import DailyWorkTrack from 'views/DailyWorkTrack';
import DailyWorkTrackList from 'views/DailyWorkTrackList';
import DailyWorkTrackEdit from 'views/DailyWorkTrackEdit';
import DWTRPreview from 'views/DWTRPreview';
import ReportSupervisor from "views/ReportSupervisor";
import DWTRReport from "views/DWTRReport";
import ReportSites from "views/ReportSites";
class App extends Component {
  constructor(props) {
    super(props);
    // this.child = React.createRef();
  }
  componentWillReceiveProps(nextProps){
    
  }
 
  render() {
    let currentUser = sessionStorage.getItem("userId");
    
    // console.log("location", this.props, window.location.pathname, currentLocation, this.props.userId);
    return (
    
     <div className="mobileContainer">
        {(currentUser)? <Header /> :  <Menu />}
        

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
