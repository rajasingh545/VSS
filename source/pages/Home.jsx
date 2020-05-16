import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { listigDetails, requestDetails, clearListing,requestPostClear } from 'actions/request.actions';
import {DOMAIN_NAME} from "../config/api-config";
import baseHOC from "./baseHoc";
import { ToastContainer, toast } from 'react-toastify';

@connect(state => ({   
  requestDet: state.request.get('requestDet')
}))
@baseHOC
export default class Home extends Component {
  static propTypes = {
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
        requestCode:2,
        requestStatus:2,
        projectId:""
    };
    }
  componentDidMount(){
    const { dispatch } = this.props;

    dispatch(requestPostClear());
    
  }
  componentWillReceiveProps(nextProps){
    const { requestDet } = nextProps;
    
    
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch(clearListing());
  }
  
  
  render() {
    const {
      userType, requestDet
    } = this.props;
    const {listingDetails} = this.state;
// console.log("usertype", userType);
const {loading} = this.props;
  
let loadingurl = DOMAIN_NAME+"/assets/img/loading.gif";
    return (
      <div>
        <ToastContainer autoClose={8000} />
        Welcome
      </div>
      
    );
  }
}
