import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import { routeCodes } from 'constants/routes';
import Menu from 'components/global/Menu';
import Home from 'views/Home';
import People from 'views/People';
import NotFound from 'views/NotFound';
import Login from "views/Login";
import MatRequest from "views/MatRequest";
import Header from "components/global/header";
import ViewDetails from "views/ViewDetails";
import ViewDetailsRO from "views/ViewDetailRO";
import GenerateDO from "views/GenerateDO";
import DriverView from "views/driverView"
import Acknowledge from "views/acknowledge";
import ApproveAcknowledge from "views/approvalSuccess";
import collectionView from "views/collection";
import collectionViewRO from "views/collectionRO";
import Report from "views/report";
import Search from "views/notificationSearch";
import Alerts from "views/alerts";
import DOEdit from "views/doEdit"

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
            <Route path={ routeCodes.PEOPLE } component={ Login } />
            <Route ref="child" path="/View/:id" component={ ViewDetails } />   
            <Route ref="child" path="/ViewRO/:id" component={ ViewDetailsRO } />         
            <Route path="/GenerateDO/:id" component={ GenerateDO } />
            <Route path="/DriverView/:id" component={ DriverView } />
            <Route path="/DriverView/:id/:doid" component={ DriverView } />
             <Route path="/DOView/:id/:doid" component={ DriverView } />
            <Route path="/collection/:id/:doid" component={collectionView} />
            <Route path="/collectionRO/:id/:doid" component={collectionViewRO} />
            <Route path="/Login" component={ Login } />
            <Route path="/MatRequest/:id" component={MatRequest} />
            <Route path="/Acknowledge" component={Acknowledge} />
             <Route path="/Report" component={Report} />
             <Route path="/Search" component={Search} />
             <Route path="/Alerts" component={Alerts} />
            
             <Route path="/DOEdit/:id/:doid" component={ DOEdit } />
             <Route path="/ApprovalAlerts" component={ApproveAcknowledge} />
            <Route path='*' component={ NotFound } />
            
          </Switch>
        </div>
      </div>
     
    );
  }
}

export default hot(module)(App);
