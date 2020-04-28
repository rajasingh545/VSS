import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { viewDetails, requestDetails, requestPost, clearViewDetail } from 'actions/request.actions';
import {getDetailsWithLib, getListingId} from "config/utility";
import MatRequest from "./MatRequest";
import {DOMAIN_NAME} from "../config/api-config";
import baseHOC from "./baseHoc";
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
@connect(state => ({
    loading: state.request.get('loadingViewDetail'),
  viewDetails: state.request.get('viewDetails'),
   requestDet: state.request.get('requestDet'),
   requestPost: state.request.get('requestPost'),
}))
@baseHOC
export default class GenerateDO extends Component {
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
            multiCategory:[],
            doSuccess : false,
            userType : "",
            remarks : ""
        };
    this.modifiedRow = [];

    }
  componentDidMount(){
    const { dispatch } = this.props;
    dispatch(requestDetails());
    dispatch(viewDetails(this.state));

  }
  componentWillReceiveProps(nextProps){

        let {viewDetails, requestDet} =  nextProps;

        this.state.userType = nextProps.userType;

        let viewDetailsUpdated = {};
        if(viewDetails && requestDet){

            this.state.requestType = viewDetails.request.notificationType;
            this.state.projectIdTo = viewDetails.request.projectIdTo;

            if(viewDetails.request){
             viewDetailsUpdated = getDetailsWithLib(viewDetails, requestDet);
            }
        }
        if(viewDetails && viewDetailsUpdated && viewDetailsUpdated.request){
            // console.log("log",viewDetails);
            this.setState({requestDetails : viewDetailsUpdated, multiCategory : viewDetails.matRequests, requestStatus:viewDetailsUpdated.request.requestStatus,projectId:viewDetails.request.projectIdFrom});
                
            viewDetailsUpdated.matRequests.map((data, index) =>{
                // console.log("data", data);
                 this.state[data.categoryUniqueId] = data.quantityRemaining;
            });
        }
        
  }

  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch(clearViewDetail());
  }
  renderMaterialRequest = (matRequests) =>{

      return matRequests.map((data, index) =>{
          
            let deliveryCount = data.quantityRemaining;
             this.state[data.categoryUniqueId+"remain"] = data.quantityRemaining;
        return (
                          <div className="row Listing1 hrline" key={index}>
                            <ul className="Listing">
                                <li className="paddingbottom10">
                                    <div className=" col-lg-4 col-md-4 col-sm-4 col-xs-4"> <span id="lblCategory">{data.categoryId}</span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"> <span id="lblSubCategory">{data.subCategoryId}</span> </div>
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty">{data.quantityRequested}</span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3">
                                        {deliveryCount == "0" && 
                                        <span>{deliveryCount}</span>
                                        }
                                         {deliveryCount != "0" &&
                                        <input type="number" className="width100" name={data.categoryUniqueId} defaultValue={deliveryCount} onChange={(e)=>{this.onFormChange(e)}} max={data.quantityRequested} id="delQty" />
                                         }
                                        
                                        </div>
                                </li>
                                <li className="paddingbottom10"><div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12"> <span id="lblDescription">{data.description}</span></div></li>
                            </ul>
                        </div>
            );
        });


  
}
setApproverComments=(e)=>{
    let comments = e.target.value;
    this.setState({approverComments:comments});

}
setApproverAction=()=>{
     const { dispatch } = this.props;
    //   console.log("state", this.state)
    let errCount=0;
    let {requestDetails} = this.state;
      if(!this.state.driverName || this.state.driverName == ""){
          
           toast.error("Driver name can't be empty", { autoClose: 3000 });
           return false;
      }
      else if(!this.state.vehicleName || this.state.vehicleName == ""){
            toast.error("Vehicle number can't be empty", { autoClose: 3000 });
           return false;
      }
      else{
          
          requestDetails.matRequests.map((data, index) =>{
                // console.log("data", data, this.state[data.categoryUniqueId], data.quantityRemaining, parseInt(this.state[data.categoryUniqueId]) > parseInt(data.quantityRemaining));
                let z = this.state[data.categoryUniqueId];
            
                if(this.state[data.categoryUniqueId] == "" || !z.match(/^\d+/) || this.state[data.categoryUniqueId] < 0){
                    let errMsg = "Please enter a valid Acc.Qty ";
                    toast.error(errMsg, { autoClose: 3000 });
                    errCount++;
                }
                 if(parseInt(this.state[data.categoryUniqueId]) > parseInt(data.quantityRemaining)){
                     let errMsg = "Del.Qty should not be more than "+data.quantityRemaining;
                     toast.error(errMsg, { autoClose: 3000 });
                     errCount++;
                 }
            });

      }
      if(errCount === 0){
            this.setState({doSuccess:true});
            this.state.requestCode = 6;
            // this.state.requestStatus = 4;
            dispatch(requestPost(this.state));
      }
            
       
}
closeListing = () =>{
    let {dispatch} =  this.props;
    if(this.state.remarks !== ""){
        this.state.approverComments = this.state.remarks;
        this.state.requestCode = 4;
        this.state.approveStatus = 9;
        dispatch(requestPost(this.state));
        this.props.history.push('/ApprovalAlerts');
    }
    else{
    
        toast.error("Remarks can't be empty", { autoClose: 3000 });       
    }
}
close = () =>{
    this.props.history.push('/Home'); 
}
setDDOptions = (options, keyName, valueName) =>{
        return options.map((value)=>{
              return (<option key={value[keyName]} value={value[keyName]}>{value[valueName]}</option>);
        });
  }
  modifyRequest = (categoryId, max, e) =>{

    let value = e.target.value;
    if(value.trim() != ""){
     this.modifiedRow[categoryId] = {[categoryId]:value};
    }
    //  console.log(categoryId, this.modifiedRow);
    if(parseInt(value) <= parseInt(max)){
        // this.state.multiCategory = this.modifiedRow;
        // this.setState({[e.target.name]: value});
        this.state[e.target.name] = value;
    }
    else{
        // alert("Value should not be more than "+max);
        // toast.error("Value should not be more than "+max, { autoClose: 3000 });
        // this.state[e.target.name] = max;
        this.setState({[e.target.name]: max});
    }
    // this.onFormChange(e);
  }
   onFormChange = (e) =>{
      
      if(e){
        //   console.log("e", e, e.target.name, e.target.value);
        this.setState({[e.target.name]: e.target.value});
      }
  }
   
  render() {
    const {
      requestDetails, doSuccess
    } = this.state;
     const {requestDet, requestPost, userType} = this.props;
     const {loading} = this.props;

  
     let loadingurl = DOMAIN_NAME+"/assets/img/loading.gif";
    return (
      <div>
       {loading == true &&
            <div className="center-div"><img src={loadingurl} /></div>
        }
      {requestDetails.request && doSuccess === false && 
            
           
            <div id="detailsApproval">
<ToastContainer autoClose={8000} />
                <div className="padding15">
                    <div className="row Listing1">
                        <label id="items" className="">Generate DO</label>
                        <ul className="Listing">
                            <li className="paddingbottom10"><strong>Notification Number:</strong> <span id="lblNotoficationNo">{requestDetails.request.formattedReqID}</span></li>
                            <li className="paddingbottom10"><strong>Notification Type:</strong> <span id="lblNotoficationType">{requestDetails.request.requestType}</span></li>
                            <li className="paddingbottom10"><strong>Project Name:</strong> <span id="lblProjectName">{requestDetails.request.projectIdFrom}</span></li>
                            <li className="paddingbottom10"><strong>Supervisor:</strong> <span id="lblSupervisor">{requestDetails.request.createdBy}</span></li>
                        </ul>
                        <div className="row Listing1 hrline">
                            <ul className="Listing">
                                <li className="paddingbottom10">
                                    <div className=" col-lg-4 col-md-4 col-sm-4 col-xs-4"> <span id="lblCategory"><strong>Category</strong></span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"> <span id="lblSubCategory"><strong>Sub Category</strong></span> </div>
                                    <div className=" col-lg-2 col-md-2 col-sm-2 col-xs-2"> <span id="lblQty"><strong>Req. Qty</strong></span> </div>
                                    <div className=" col-lg-3 col-md-3 col-sm-3 col-xs-3"><strong>Del. Qty</strong></div>
                                </li>
                            </ul>
                        </div>
                        {requestDetails.matRequests && this.renderMaterialRequest(requestDetails.matRequests) }
                        <div style={{paddingLeft:"20px"}}>{requestDetails.request.description}</div>  
                    </div>

                </div>
                <div className="row height20"></div>
                <ul className="WorkOrderForm" id="DriverInfo" style={{paddingLeft:"20px"}}>
                    <li><strong>Driver Name</strong></li>
                    <li>
                        {requestDet &&
                        <select name="driverName" value={this.state.driverName} className="ComboBox" onChange={this.onFormChange}>
                            <option value="">Select</option>
                            {this.setDDOptions(requestDet["drivers"], "driverId", "driverName")}
                        </select>
                        }
                    </li>
                    <li><strong>Vechicle No</strong></li>
                    <li>
                       {requestDet &&
                        <select name="vehicleName" value={this.state.vehicleName} className="ComboBox" onChange={this.onFormChange}>
                          <option value="">Select</option>
                            {this.setDDOptions(requestDet["vehicles"], "vehicleId", "vehicleNumber")}
                        </select>
                        }
                    </li>


                </ul>

                <ul className="WorkOrderForm" id="approvalCommCont" style={{paddingLeft:"20px"}}>
                    <li><strong>Remarks</strong></li>
                    <li><textarea id="txtComments" name="remarks" onChange={this.onFormChange} className="TextBox" placeholder="Remarks"></textarea></li>
                </ul>
                <div className='row'>
                    <div className="col-xs-4">
                        
                        <input type="button" value="Submit" onClick={this.setApproverAction} id="btSubmit" className="Button btn-block" />
                    </div>
                    {(userType == 3 || userType == 1) && 
                     <div className="col-xs-4">
                        <input type="button" id="btClose" value="Close" onClick={()=>this.closeListing()} className="Button btn-block" />
                    </div>
                    }

                    <div className="col-xs-4">
                        <input type="button" id="btBack" value="Back" onClick={this.close} className="Button btn-block" />
                    </div>
                </div>
            </div>
      }

{doSuccess === true && 

<div id="DOGenerationAck">
                <div className=""><br /><br /></div>
                <div className="padding15">
                    <div className=" Listing1 padding15">
                        <label id="items" className="">DO Acknowledegement</label>
<p>Delivery Order is generated. DO number is {requestPost && <strong>{requestPost.doNumber}</strong>}</p>

                        <p>
                            <br /><br />Regards,
                            <br />Management
                        </p>

                    </div>

                </div>
                <div className='row'>
                    <div className="col-xs-3">
                    </div>
                    <div className="col-xs-5">                        
                        <input type="button" value="Back" onClick={this.close} id="btBack" className="Button btn-block" />
                    </div>
                    <div className="col-xs-4">
                    </div>

                </div>
            </div>
}


            </div>
    
    );
  }
}
