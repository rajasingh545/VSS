import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { viewDetails, requestDetails, requestPost } from 'actions/request.actions';
import {getDetailsWithLib, getListingId} from "config/utility";
import MatRequest from "./MatRequest";
import {DOMAIN_NAME} from "../config/api-config";
import baseHOC from "./baseHoc";
import { ToastContainer, toast } from 'react-toastify';
@connect(state => ({
    loading: state.request.get('loadingViewDetail'),
  viewDetails: state.request.get('viewDetails'),
   requestDet: state.request.get('requestDet'),
}))
@baseHOC
export default class DriverView extends Component {
  static propTypes = {
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }
  constructor(props) {
    super(props);

    let listingid = getListingId(this.props.match.params.id);
    
    this.state = {
            requestCode:3,
            requestStatus:2,
            listingId:listingid,
            requestDetails:{},
            approverComments:"",
            approveStatus:0,
            multiCategory:[],
            DOId : this.props.match.params.doid,
            userId : this.props.userId,
            remarks : ""
        };
    this.modifiedRow = [];

    }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(requestDetails());
    // console.log("state", this.state, this.props.match.params);
    dispatch(viewDetails(this.state));

  }
  componentWillReceiveProps(nextProps){
    // console.log("listingid", this.props.match.params);
        let {viewDetails, requestDet} =  nextProps;
        
        let viewDetailsUpdated = {};
        if(viewDetails && requestDet){
            if(viewDetails.request){
             viewDetailsUpdated = getDetailsWithLib(viewDetails, requestDet);
            }
        }
        if(viewDetails){
            // console.log("log",viewDetailsUpdated);
            this.setState({requestDetails : viewDetailsUpdated});
            if(viewDetailsUpdated.request){
             this.setState({driverName : viewDetailsUpdated.request.driverRawId});
             this.setState({vehicleName :  viewDetailsUpdated.request.vehicleRawId});
            }
        }
        
  }

  
  renderMaterialRequest = (matRequests) =>{

      return matRequests.map((data, index) =>{
          this.state[data.categoryUniqueId] = data.quantityRequested;
            
        return (
                          <div className="row Listing1 hrline" key={index}>
                            <ul className="Listing">
                                <li className="paddingbottom10">
                                    <div className=" col-lg-4 col-md-4 col-sm-4 col-xs-4"> <span id="lblCategory">{data.categoryId}</span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"> <span id="lblSubCategory">{data.subCategoryId}</span> </div>
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty">{data.quantityRequested}</span> </div>
                                     {data.rawRequestType == 2 &&
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3">{data.approx}</div>
                                    }
                                    {data.rawRequestType != 2 &&
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3">{data.quantityDelivered}</div>
                                    }
                                </li>
                                <li class="paddingbottom10"><div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12"> <span id="lblDescription">{data.description}</span></div></li>
                            </ul>
                        </div>
            );
        });


  
}

setApproverAction=()=>{
     const { dispatch, userType } = this.props;
   const {
      requestDetails
    } = this.state;
            // if(this.state.remarks.trim() == ""){
            //     toast.error("Remarks can't be empty", { autoClose: 3000 });
            //     return false;
            // }
            if(userType == 1){
                this.state.requestCode = 13;
                // this.state.requestStatus = 5;
                this.state.requestType = requestDetails.request.rawRequestType;
                dispatch(requestPost(this.state));
                this.props.history.push('/Home');   
            }
            else{
                this.state.requestCode = 7;
                this.state.requestStatus = 5;
                this.state.requestType = requestDetails.request.rawRequestType;
                dispatch(requestPost(this.state));
                this.props.history.push('/Home');   
            } 
       
}
close = () =>{
    this.props.history.push('/Home'); 
}

 
   onFormChange = (e) =>{
      
      if(e){
        //   console.log("e", e, e.target.name, e.target.value);
        this.setState({[e.target.name]: e.target.value});
      }
  }
  setDDOptions = (options, keyName, valueName) =>{
    return options.map((value)=>{
          return (<option key={value[keyName]} value={value[keyName]}>{value[valueName]}</option>);
    });
}
   
  render() {
    const {
      requestDetails
    } = this.state;
     const {requestDet, userType} = this.props;
     const {loading} = this.props;
  
     let loadingurl = DOMAIN_NAME+"/assets/img/loading.gif";
    return (
      <div>
      {loading == true &&
            <div className="center-div"><img src={loadingurl} /></div>
        }
      {requestDetails.request && 
            
           
            <div id="detailsApproval">
<ToastContainer autoClose={8000} />
                <div className="padding15">
                    <div className="row Listing1">
                        {requestDetails.request.rawRequestType == 1 &&
                        <label id="items" className="">Delivery Order</label>
                        }
                         {requestDetails.request.rawRequestType == 2 &&
                        <label id="items" className="">Return Order</label>
                        }
                        {requestDetails.request.rawRequestType == 3 &&
                        <label id="items" className="">Transfer Order</label>
                        }
                        <ul className="Listing">
                            {requestDetails.request.rawRequestType == 1 &&
                            <span>
                             <li className="paddingbottom10"><strong>Notification Number:</strong> <span id="lblProjectName">{requestDetails.request.formattedReqID}</span></li>
                            <li className="paddingbottom10"><strong>DO Number:</strong> <span id="lblNotoficationNo">{requestDetails.request.activeDoNumber}</span></li>
                            </span>
                            } 
                             {requestDetails.request.rawRequestType != 1 && requestDetails.request.rawRequestType != 3 &&
                             <li className="paddingbottom10"><strong>Notification Number:</strong> <span id="lblNotoficationNo">{requestDetails.request.formattedReqID}</span></li>
                             }

                            <li className="paddingbottom10"><strong>Notification Type:</strong> <span id="lblNotoficationType">{requestDetails.request.requestType}</span></li>
                            <li className="paddingbottom10"><strong>Project Name:</strong> <span id="lblProjectName">{requestDetails.request.projectIdFrom}</span></li>
                            {requestDetails.request.rawRequestType == 3 &&
                            <div>
                            <li className="paddingbottom10"><strong>Project To:</strong> <span id="lblProjectName">{requestDetails.request.projectIdTo}</span></li>
                             <li className="paddingbottom10"><strong>Notification Number:</strong> <span id="lblProjectName">T{requestDetails.request.notificationNumber}</span></li>
                             </div>
                            }
                            <li className="paddingbottom10"><strong>Supervisor:</strong> <span id="lblSupervisor">{requestDetails.request.createdBy}</span></li>
                            <li className="paddingbottom10"><strong>Created On:</strong> <span id="lblSupervisor">{requestDetails.request.createdOn}</span></li>
                        </ul>
                        <div className="row Listing1 hrline">
                            <ul className="Listing">
                                <li className="paddingbottom10">
                                    <div className=" col-lg-4 col-md-4 col-sm-4 col-xs-4"> <span id="lblCategory"><strong>Category</strong></span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"> <span id="lblSubCategory"><strong>Sub Category</strong></span> </div>
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty"><strong>Req. Qty</strong></span> </div>
                                    {requestDetails.request.rawRequestType != 2 &&
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"><strong>Del. Qty</strong></div>
                                    }
                                    {requestDetails.request.rawRequestType == 2 &&
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"><strong>Approx</strong></div>
                                    }
                                </li>
                            </ul>
                        </div>
                        {requestDetails.matRequests && this.renderMaterialRequest(requestDetails.matRequests) }
                        <div style={{paddingLeft:"20px"}}>{requestDetails.request.description}</div>  
                    </div>

                </div>
                <div className="row height20"></div>
                <ul className="WorkOrderForm" id="DriverInfo" style={{paddingLeft:"20px"}}>
                    <li><strong>Driver Name : </strong>
                    {userType != 1 && 
                   <span id="lblNotoficationNo">{requestDetails.request.driverId}</span>
                    }
                    {userType == 1 && 
                    <select name="driverName" value={this.state.driverName} className="ComboBox" onChange={this.onFormChange}>
                        
                        <option value="">Select</option>
                        {this.setDDOptions(requestDet["drivers"], "driverId", "driverName")}
                    </select>
                    }
                    </li>
                    <li><strong>Vechicle No : </strong>
                    {userType != 1 && 
                  
                   <span id="lblNotoficationNo">
                       {requestDetails.request.vehicleId}
                       </span>
                    }
                       {userType == 1 && 
                        <select name="vehicleName" value={this.state.vehicleName} className="ComboBox" onChange={this.onFormChange}>
                        <option value="">Select</option>
                            {this.setDDOptions(requestDet["vehicles"], "vehicleId", "vehicleNumber")}
                        </select>
                        }
                    
                        </li>
                    {requestDetails.request.DORemarks != "" &&
                    <li><strong>Remarks: </strong>
                   <span id="lblNotoficationNo">
                       {requestDetails.request.DORemarks}
                    </span>
                        </li>
                    }

                </ul>
                {(this.props.userType == "4" || this.props.userType == "1") &&
                <ul className="WorkOrderForm" id="approvalCommCont" style={{paddingLeft:"20px"}}>
                    <li><strong>Remarks</strong></li>
                    <li><textarea id="txtComments" name="remarks" onChange={this.onFormChange} className="TextBox" placeholder="Remarks"></textarea></li>
                </ul>
                }
                <div class='row'>
                     {(this.props.userType == "4" || this.props.userType == "1") &&
                    <div className="col-xs-4">
                        
                        <input type="button" value="Submit" onClick={this.setApproverAction} id="btSubmit" className="Button btn-block" />
                    </div>
                     }

                    <div className="col-xs-4">
                    </div>

                    <div className="col-xs-4">
                        <input type="button" id="btBack" value="Back" onClick={this.close} className="Button btn-block" />
                    </div>
                </div>
            </div>
      }



            </div>
    
    );
  }
}
