import React from 'react';
import { connect } from 'react-redux';
import PreviewTemplate from '../components/PreviewTemplate';
import Dropdown from '../components/Dropdown';
import {DOMAIN_NAME} from "../config/api-config";
import baseHOC from "./baseHoc";
import { requestDetails, requestPost, requestPostClear, listigDetails,clearListing } from 'actions/workArrangement.actions';
import CustomButton from '../components/CustomButton';
    import { getDetailsWithMatchedKey2} from '../common/utility';

import DatePicker from 'react-datepicker';
import moment from "moment";
import {Modal} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

@connect(state => ({
loading: state.request.get('loadingListing'),
  listingDetails: state.request.get('listingDetails') ,
  requestDet:state.request.get("requestDet")
}))
@baseHOC
export default class AttendanceList extends React.Component {
 
  constructor(props) {
    super(props);
   
    this.state = {
        requestCode:2,
        requestStatus:2,
        projectId:"",
       
        startDate1: moment(),
        startDate: moment().format("YYYY/MM/DD"),
        show:false,
        modalCont : '',
        requestTypeTitle : "Select Status"
    };
    
    this.selectedIds = [];
    }
  componentWillMount(){
    const { dispatch } = this.props;

    dispatch(requestPostClear());
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;    
    //  if(!this.props.requestDet){
      dispatch(requestDetails(this.state));
    //  }
    
    
  }
  componentWillReceiveProps(nextProps){
    const { requestDet } = nextProps;
    this.setState({listingDetails : nextProps.listingDetails});
    if(requestDet){
      this.setState({requestDet : requestDet});
    }
    
  }
  componentWillUnmount(){
    const { dispatch } = this.props;
    dispatch(clearListing());
  }
  componentDidMount(){
    
    
      this.handleRequestType('');
    
  
  }
  redirectView = (requestId, pid) =>{        
      this.props.history.push('/Attendance/'+requestId+"/"+pid);
                  
  }
  
  

  Listings = (listings) =>{
    let {listingDetails, requestDet} = this.props;
    let response = "";
    let requestDetails = {};

    if(listingDetails && listingDetails.length > 0){
        response = listings.map((data, index) =>{
        // requestDetails = getDetailsWithLib2(data, this.state.requestDet);
        
        let projectName = "";
        if(this.state.requestDet){
          projectName =getDetailsWithMatchedKey2(data.projectId, this.state.requestDet.projects, "projectId", "projectName");
        }
        // let createdby = getDetailsWithMatchedKey2(data.createdBy, this.state.requestDet.projects, "projectId", "projectName");
        let createdon  = moment(data.createdOn);
        let createdondate = createdon.format("DD/MM/YYYY");
        return (
                <div  className="row Listing1 hrline hoverColor" style={{cursor:"pointer"}} key={data.workArrangementId} onClick={()=>this.redirectView(data.workArrangementId, data.projectId)}>
                          <strong>{projectName}</strong> created on {createdondate}
                </div>
            );
        });
    }
    else{
        response = (<div style={{"color":"red", "width":"80%", "textAlign":"center", "textWeight":"bold", "paddingTop":"100px"}}>No Listings Found</div>)
    }
    return response;
  }
  onCheckBoxClickCallBack = (id, checked)=>{
    
    if(checked === true){
     this.selectedIds.push(id);
    }
    else{
      let index = this.selectedIds.indexOf(id);
      this.selectedIds.splice(index, 1);
    }

    if(this.selectedIds.length > 0){
      this.setState({showSubButton:true});
    }else{
      this.setState({showSubButton:false});
    }
    
  }
  onStartDateChange = (e) =>{
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
      this.state.startDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date
      this.handleRequestType(e.format("YYYY/MM/DD"));
}
setPreview =() =>{
  let contArr = [];
  this.selectedIds.map((ind)=>{

    contArr.push(document.getElementById("elm_"+ind).innerHTML+"<br />");



  });
  this.setState({show:true, modalCont:contArr.join("")});
  
}

  handleRequestType = (date) => {
    const { dispatch, userType, userId} = this.props;
    
   
    this.state.requestCode = 8;
    this.state.userType = userType;
    this.state.userId = userId;
    this.state.startDate = date;
    dispatch(listigDetails(this.state));
  }
  
setProjectId = (e) =>{
    this.state.projectId = e.target.value;
    this.setState({cboProjects:"0",listingDetails:{}});
}
handleClose = () =>{
  this.setState({show:false});
  //this.setState({show:false, value_projects:"", value_supervisors:"", value_supervisors2:""});
}
handleSubmit = () =>{
  const { dispatch} = this.props;
  this.handleClose();
  let param = {};
  param.requestCode = 4;
  param.ids = this.selectedIds;
  dispatch(requestPost(param));
  toast.success("Updated Successfully", { autoClose: 2000 }); 
  setTimeout(()=>{
    this.props.history.push('/Home');
  }, 2000)
  
}
  render() {
    const {
      userType, requestDet
    } = this.props;
    const {listingDetails, requestType} = this.state;
const {loading} = this.props;
let loadingurl = DOMAIN_NAME+"/assets/img/loading.gif";
    return (
      <div>
        <ToastContainer autoClose={8000} /><br />
        
        <div className="row">
          <div className="col-xs-8">
            <DatePicker
                      selected={this.state.startDate1}
                    
                      className=" form-control"
                      isClearable={false}
                      onChange={this.onStartDateChange}
                      name="startDate"
                      dateFormat="DD-MM-YYYY"
                      locale="UTC"
              
                  />
                   </div>
                <div className="col-xs-2">
                   &nbsp;

                </div>
        </div>
        

            <div className="padding15" id="divRequestListing">
            {loading == true &&
                <div className="center-div"><img src={loadingurl} /></div>
            }
                {listingDetails && loading == false && 
                this.Listings(listingDetails)
                }
            </div>
            <div>
              {this.state.showSubButton && 
              
              <div className="col-sm-3"><br /> <CustomButton bsStyle="warning"  id="submit" type="submit" onClick={()=>this.setPreview()}>Preview</CustomButton></div>
            }

            </div>

            <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><strong>Preview</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            
            <div id="showContent" dangerouslySetInnerHTML={{ __html: this.state.modalCont }}></div>
            
          </Modal.Body>
          <Modal.Footer>
          <div className="col-sm-3"> <CustomButton bsStyle="primary" onClick={this.handleSubmit}>Submit</CustomButton></div>
          <div className="col-sm-3"> <CustomButton bsStyle="secondary" onClick={this.handleClose}>Close</CustomButton></div>
          </Modal.Footer>
        </Modal>
  
      </div>
      
    );
  }
}
