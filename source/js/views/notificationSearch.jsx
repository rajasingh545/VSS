import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reportPost, requestDetails } from 'actions/request.actions';
import {getDetailsWithMatchedKey} from "../config/utility";
import { Route } from 'react-router-dom';
// import {getDetailsWithLib, validateLoggedUser} from "config/utility";
import baseHOC from "./baseHoc";

import ReactTable from "react-table";
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import moment from 'moment';


const wrapLink = (id,txt) =>{
  return(
  <Route render={({ history}) => (
    <a
    target="_blank"
     
      onClick={() => { history.push('/ViewRO/REQ'+txt) }}
    >
     {id}
    </a>
  )} />);
}
const wrapDoIds = (doIds,rid) =>{
   if(doIds && doIds != ""){
    let arr = doIds.split(",");
    let links = [];
    arr.forEach(function(id) {
      let idss = id.split("/");
      let item = wrapDOLink(id,rid,idss[2]);
      links.push(item);
    });
    return links;
  }
  else{
    return null;
  }
 }
const wrapDOLink = (id,rid,txt) =>{
  return(
  <Route render={({ history}) => (
    <a
    target="_blank"
     
      onClick={() => { history.push('/collectionRO/REQ'+rid+"/"+txt) }}
    >
     {id}
    ,</a>
  )} />);
}
moment.locale('en-US');

let columns = [ 
    {
      Header: 'Notification Number',
      accessor: 'requestId',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Created On',
      accessor: 'createdOn',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Created By',
      accessor: 'createdBy',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Request Type',
      accessor: 'requestTypeName',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Do Number',
      accessor: 'DONumber',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Driver',
      accessor: 'driverName',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Vehicle',
      accessor: 'vehicleName',
      headerClassName:"gridcolHeader"
     
    },
    {
      Header: 'Request Status',
      accessor: 'requestCurrentStatus',
      headerClassName:"gridcolHeader"
     
    }
    
    ];

@connect(state => ({
  requestDet: state.request.get('requestDet'),
  reportData: state.request.get('reportData')  
}))
@baseHOC
export default class Search extends Component {
  static propTypes = {
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
      notificationno:"",
      startDate:null,
      endDate:null,
      data:[]

        
    };
    }
  componentDidMount(){
    const { dispatch, requestDet } = this.props;

    if(!requestDet){
      dispatch(requestDetails());
     }
    
   
  }
  componentWillReceiveProps(nextProps){
    const {requestDet, dispatch} = this.props;
    // console.log("nextProps",nextProps);
    let requestType = [];
    requestType[1] = "Request";
    requestType[2] = "Return";
    requestType[3] = "Transfer";

    let requestStatus = [];
    requestStatus[1] = "Submitted for Approval";
    requestStatus[2] = "Draft";
    requestStatus[3] = "Approved";
    requestStatus[4] = "Delivery";
    requestStatus[5] = "Collection";
    requestStatus[6] = "Rejected";
    requestStatus[7] = "Collection Completed";
    requestStatus[8] = "Return";
    requestStatus[9] = "Closed";
    requestStatus[10] = "Collection(Transfer)";
    requestStatus[11] = "Return Accepted";
    requestStatus[12] = "Transfer";
    requestStatus[13] = "Transfer Accepted";
    requestStatus[14] = "Transfer";
    requestStatus[99] = "Removed";

    if(nextProps.reportData){
      let data = [];
      
        

        for (var key in nextProps.reportData) {
          let driverName = getDetailsWithMatchedKey(nextProps.reportData[key].driverId, requestDet["drivers"], "driverId", "driverName");
          let vehicleName = getDetailsWithMatchedKey(nextProps.reportData[key].vehicleId, requestDet["vehicles"], "vehicleId", "vehicleNumber");
          
          let createdBy = getDetailsWithMatchedKey(nextProps.reportData[key].createdBy, requestDet["users"], "userId", "Name");
          let requestTypeName = requestType[nextProps.reportData[key].notificationType];
          let requestCurrentStatus = requestStatus[nextProps.reportData[key].requestStatus];
          // console.log(returnedQuantity, balance, amount, typeof balance,  typeof amount);
          data.push({
            ...nextProps.reportData[key],
            driverName,
            vehicleName,
            createdBy,
            requestTypeName,
            requestCurrentStatus,
            requestId:wrapLink(nextProps.reportData[key].requestId, nextProps.reportData[key].requestIdRaw),
            DONumber:wrapDoIds(nextProps.reportData[key].DONumber, nextProps.reportData[key].requestIdRaw)

          });

        
        }

        this.setState({data});
    }

    
  }
 
  onClickSubmit = () =>{


    if(this.state.notificationno == "" && this.state.startDate == null && this.state.endDate == null){
      toast.error("Please enter notification number or date", { autoClose: 3000 });
      return false;
     }
     if(this.state.endDate == "" && this.state.startDate != ""){
      toast.error("Please choose end date", { autoClose: 3000 });
      return false;
     }
     if(this.state.endDate != "" && this.state.startDate == ""){
      toast.error("Please choose start date", { autoClose: 3000 });
      return false;
     }
      this.state.userType = this.props.userType;
        this.state.userId = this.props.userId;
    this.state.requestCode = 4;
    
    const { dispatch } = this.props;
    dispatch(reportPost(this.state));
  }
 
  onFormChange = (e) =>{
        
    if(e){
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
  }
  onStartDateChange = (e) =>{
    // console.log("===",e);
    if(e != null){
        this.setState({
          startDate: e.format("YYYY/MM/DD"),
          startDate1: e
        });
      }else{
        this.setState({
          startDate: "",
          startDate1: ""
        });
      }
}
onEndDateChange = (e) =>{
  if(e != null){
    this.setState({
      endDate: e.format("YYYY/MM/DD"),
      endDate1: e
    });
  }else{
    this.setState({
      endDate: "",
      endDate1: "",
     
    });
  }
}
clearForm = () =>{
  this.setState({
    endDate: "",
    endDate1: "",
    startDate: "",
    startDate1: "",
    notificationno:""
  });
}
  render() {
    const {
        reportData, userType, requestDet
    } = this.props;
    let {subCategory, data} = this.state;
    

// console.log("data", data, columns, data.length);

  
    return (
      <div>
        
        <div className="row">
                <div className="col-xs-8">
                <ToastContainer autoClose={8000} />
                    <ul className="WorkOrderForm">
                    <li><strong>Notification Number</strong></li>
                        <li>
                             <input value={this.state.notificationno}  onChange={this.onFormChange} name="notificationno" className=" form-control"/>
                            
                            
                        </li>
                       
                        <div>
                <li><strong>Created On - From</strong></li>
               
                    <li>
                        
                    <DatePicker
                    selected={this.state.startDate1}
                  
                    className=" form-control"
                    isClearable={true}
                    onChange={this.onStartDateChange}
                    name="startDate"
                    dateFormat="DD-MM-YYYY"
                    locale="UTC"
                    
                />
                        
                        
                    </li>

                    <li><strong> Created On - To </strong></li>
                    <li id="materialCategoryListContainer">
                    <DatePicker
                  selected={this.state.endDate1}                  
                  className=" form-control"                  
                  onChange={this.onEndDateChange}
                  name="endDate"
                  isClearable={true}
                  dateFormat="DD-MM-YYYY"
                  locale="UTC"
              />
                    </li> 
                    </div>
               

                
                  
                    </ul>
                    <br />
                <div className="col-xs-4">
                       
                  <input type="button" value="Submit" onClick={this.onClickSubmit} id="btBack" className="Button btn-block" />
                 
                </div>
                <div className="col-xs-4">
                <input type="button" value="Reset" onClick={this.clearForm} id="btBack" className="Button btn-block" />
                </div>
                </div>
                
            </div>
                    <br />
            <div className="container" id="divRequestListing">
          {data.length > 0 && 
                
            <ReactTable
                data={data}
                columns={columns}
                showPagination={true}
                defaultPageSize={10}
            />
          }
          {data.length == 0 && columns.length != 0 &&
            <div style={{"color":"red", "width":"80%", "textAlign":"center", "textWeight":"bold", "paddingTop":"100px"}}>No Records Found</div>
          }
            </div>
      </div>
      
    );
  }
}
