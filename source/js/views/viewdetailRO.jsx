import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { viewDetails, requestDetails } from 'actions/request.actions';
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
export default class ViewDetails extends Component {
  static propTypes = {
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }
  constructor(props) {
    super(props);

    let listingid = getListingId(this.props.match.params.id);
    // console.log("listingid", listingid);
    this.state = {
            requestCode:3,
            requestStatus:2,
            listingId:listingid,
            requestDetails:{},
            approverComments:"",
            approveStatus:0,
            showProject:0,
            projectFrom:""
        };

    }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(requestDetails());
    dispatch(viewDetails(this.state));

  }
  componentWillReceiveProps(nextProps){

        let {viewDetails, requestDet} =  nextProps;
        let viewDetailsUpdated = {};
        if(viewDetails && requestDet){
            this.state.projectIdTo = viewDetails.request.projectIdFrom; //if transfer
            if(viewDetails.request){
                viewDetailsUpdated = getDetailsWithLib(viewDetails, requestDet);
            }
        }
        this.setState({requestDetails : viewDetailsUpdated});

  }

  
  renderMaterialRequest = (matRequests, doStatus) =>{

      return matRequests.map((data, index) =>{
            
        return (
             <div className="row Listing1 hrline" key={index}>
                            <ul className="Listing">
                                <li className="paddingbottom10">
                                    <div className=" col-lg-4 col-md-4 col-sm-4 col-xs-4"> <span id="lblCategory">{data.categoryId}</span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"> <span id="lblSubCategory">{data.subCategoryId}</span> </div>
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty">{data.quantityRequested}</span> </div>
                                    {(doStatus == 11 || doStatus == 13) &&
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty">{data.quantityAccepted}</span> </div>
                                    }
                                   
                                </li>
                                <li class="paddingbottom10"><div class=" col-lg-12 col-md-12 col-sm-12 col-xs-12"> <span id="lblDescription">{data.description}</span></div></li>
                            </ul>
                        </div>
             
            );
        });


  
}
setApproverComments=(e)=>{
    let comments = e.target.value;
    this.setState({approverComments:comments});

}
setApproverAction=(action)=>{
     const { dispatch } = this.props;
    //  console.log("====",this.state.showProject, this.state.projectFrom);
     if(this.state.showProject == 1 && this.state.projectFrom == ""){
        toast.error("Please select project ", { autoClose: 3000 });       
     }
     else{
        if(this.state.approverComments !== ""){
            this.setState({commentsError:""});
            this.state.requestCode = 4;
            this.state.approveStatus = action;
            dispatch(viewDetails(this.state));
            this.props.history.push('/ApprovalAlerts');    
        }
        else{
           
            toast.error("Comments can't be empty", { autoClose: 3000 });       
        }
    }
}
close = () =>{
    this.props.history.push('/Home'); 
}
setDDOptions = (options) =>{
    return options.map((value)=>{
          return (<option key={value["projectId"]} value={value["projectId"]}>{value["projectName"]}</option>);
    });
}
setProjectId = (e) =>{
    this.state.projectId = e.target.value;
    this.setState({projectFrom:e.target.value});
}
setTransfer = () =>{

    if(this.refs.check_me.checked){
        this.setState({showProject : 1})
    }
    else{
        this.setState({showProject : 0})
    }
}
  render() {
    const {
      requestDetails,
      showProject
    } = this.state;
    const {loading, requestDet} = this.props;
    
 
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
                        <label id="items" className="">Material Details</label>
                          <ul className="Listing">
                         
                            <li className="paddingbottom10"><strong>Notification Number:</strong>
                            {requestDetails.request.rawRequestType != 3 &&
                             <span id="lblNotoficationNo">{requestDetails.request.formattedReqID}</span>
                             }
                               {requestDetails.request.rawRequestType == 3 &&
                             <span id="lblNotoficationNo">T{requestDetails.request.notificationNumber}</span>
                             }
                            </li>
                            
                            <li className="paddingbottom10"><strong>Notification Type:</strong> <span id="lblNotoficationType">{requestDetails.request.requestType}</span></li>

                              {requestDetails.request.rawRequestType !=3 &&
                                <li className="paddingbottom10"><strong>Project Name:</strong> <span id="lblProjectName">{requestDetails.request.projectIdFrom}</span></li>
                            }

                           {requestDetails.request.rawRequestType ==3 &&
                           
                                <li className="paddingbottom10"><strong> Project Name:</strong> <span id="lblProjectName">{requestDetails.request.projectIdFrom} - {requestDetails.request.projectIdTo}</span></li> 
                                
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
                                    {(requestDetails.request.doStatus == 11 || requestDetails.request.doStatus == 13) &&
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty"><strong>Acc. Qty</strong></span> </div>
                                    }
                                   
                                </li>
                            </ul>
                        </div>
                        {requestDetails.matRequests && this.renderMaterialRequest(requestDetails.matRequests, requestDetails.request.doStatus) }
                        <div>{requestDetails.request.description}</div>  
                    </div>

                </div>
                {requestDetails.request.cRemarks != "" &&
                <div style={{paddingLeft:"15px"}}>
                <div className="row height20"></div>
                <ul className="WorkOrderForm" id="approvalCommCont">
                {requestDetails.request.driverId &&
                <li><strong>Driver Name : </strong>
                   <span id="lblNotoficationNo">{requestDetails.request.driverId}</span>
                        
                    </li>
                }
                {requestDetails.request.vehicleId &&
                    <li><strong>Vechicle No : </strong>
                   <span id="lblNotoficationNo">
                       {requestDetails.request.vehicleId}
                    </span>
                        </li>
                }
                    <li className="errorMessage" >{this.state.commentsError}</li>
                    <li><strong>Remarks</strong></li>
                    <li>{requestDetails.request.cRemarks}</li>
                </ul>
                </div>
                }
                
            </div>
      }
            </div>
    
    );
  }
}
