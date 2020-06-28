import React from 'react';
import { connect } from 'react-redux';
import PreviewTemplate from '../components/PreviewTemplate';
import Dropdown from '../components/Dropdown';
import {DOMAIN_NAME} from "../config/api-config";
import baseHOC from "./baseHoc";
// import Collapsible from "react-collapsible";
import CollapsiblePanel from "../components/CollapsiblePanel";
import "./style.css";
import {
  requestDetails,
  requestPost,
  requestPostClear,
  listigDetails,
  clearListing
} from "actions/workArrangement.actions";
import CustomButton from "../components/CustomButton";
import { getDetailsWithMatchedKey2, addDays } from "../common/utility";

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
    this.setState({ listingDetails: nextProps.listingDetails });
    if (requestDet) {
      this.setState({ requestDet: requestDet }, () => this.prdata(this.state));
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

  Listings = listings => {
    let { listingDetails, requestDet } = this.props,
      response = "",
      requestDetails = {};

    if(listingDetails && listingDetails.length > 0){
        response = listings.map((data, index) =>{
        // requestDetails = getDetailsWithLib2(data, this.state.requestDet);
        let projectName = "",
          projectStartTime = "",
          projectEndTime = "";
        if (this.state.requestDet) {
          projectName = getDetailsWithMatchedKey2(
            data.projectId,
            this.state.requestDet.projects,
            "projectId",
            "projectName"
          );
        }
        this.state.requestDet.projects.map(project => {
          if (data.projectId == project.projectId) {
            projectStartTime = project.startTime;
            projectEndTime = project.endTime;
          }
        });
        // let { supervisorlist, workerlist } = data.attendancelist,
        //   { supervisorsList, availableWorkers, team } = requestDet;
        // console.log(
        //   supervisorlist,
        //   workerlist,
        //   supervisorsList,
        //   availableWorkers,
        //   team
        // );
        //   if (supervisorlist.length > 0) {

        //   }
        // let createdby = getDetailsWithMatchedKey2(data.createdBy, this.state.requestDet.projects, "projectId", "projectName");
        let createdon  = moment(data.createdOn);
        let createdondate = createdon.format("DD/MM/YYYY");
        return (
          <div
            className="row Listing1 hrline hoverColor"
            style={{ cursor: "pointer" }}
            key={data.workArrangementId}
            onClick={() =>
              this.redirectView(data.workArrangementId, data.projectId)
            }
          >
            <strong>{projectName}</strong> created on {createdondate}{" "}
            <label>
              {" "}
              Start Time: {projectStartTime} / End Time: {projectEndTime}{" "}
              Supervisor:
              (Amirthalingam-06:41:00-00:00:00,T.Arulmurugan-06:41:00-00:00:00)
              Worker: CW (Vellaisamy-06:41:00-00:00:00,Babu-06:41:00-00:00:00)
            </label>
          </div>
        );
      });
    } else {
      response = (
        <div
          style={{
            color: "red",
            width: "80%",
            textAlign: "center",
            textWeight: "bold",
            paddingTop: "100px"
          }}
        >
          No Listings Found
        </div>
      );
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
    this.state.startDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date
    this.handleRequestType(e.format("YYYY/MM/DD"));
  };
  prdata = state => {
    let { projects, availableWorkers, supervisorsList } = state.requestDet,
      { listingDetails } = state;
    // console.log("predata 1", availableWorkers, supervisorsList);
    if (Array.isArray(listingDetails) && listingDetails.length > 0) {
      listingDetails.map((wl, i) => {
        wl.index = i;
        wl.createdOn = moment(wl.createdOn).format("YYYY/MM/DD");
        for (let i = 0; i < projects.length; i++) {
          if (wl.projectId == projects[i].projectId) {
            wl.projectName = projects[i].projectName;
            wl.startTime = projects[i].startTime;
            wl.endTime = projects[i].endTime;
            wl.Title =
              projects[i].projectName +
              " -  Created on: " +
              wl.createdOn +
              " - Start Time: (" +
              wl.startTime +
              ") - End Time: (" +
              wl.endTime +
              ")";
          }
        }
        wl.supervisorlist = wl.attendancelist.supervisorlist;
        wl.workerlist = wl.attendancelist.workerlist;
        wl.finalRenderList = [];
        wl.paragraph = "";
        for (let j = 0; j < wl.supervisorlist.length; j++) {
          for (let k = 0; k < supervisorsList.length; k++) {
            if (wl.supervisorlist[j].workerId == supervisorsList[k].userId) {
              let jsonValue = {
                name: supervisorsList[k].Name,
                inTime: wl.supervisorlist[j].inTime,
                outTime: wl.supervisorlist[j].outTime
              };
              if (wl.supervisorlist[j].reason == 1) {
                jsonValue.reason = "MC";
              } else if (wl.supervisorlist[j].reason == 2) {
                jsonValue.reason = "Leave";
              } else if (wl.supervisorlist[j].reason == 3) {
                jsonValue.reason = "Absent";
              } else if (wl.supervisorlist[j].reason == 4) {
                jsonValue.reason = "Home Leave";
              } else if (wl.supervisorlist[j].reason == 5) {
                jsonValue.reason = "Late";
              } else {
                jsonValue.reason = "Others";
              }
              wl.paragraph +=
                "<p>  Name: " +
                supervisorsList[k].Name +
                " -  In Time: " +
                wl.supervisorlist[j].inTime +
                " -  Out Time: " +
                wl.supervisorlist[j].outTime +
                " -  Reason: " +
                jsonValue.reason +
                "</p> </br> ";
              wl.finalRenderList.push(jsonValue);
            }
          }
        }
        for (let j = 0; j < wl.workerlist.length; j++) {
          for (let k = 0; k < availableWorkers.length; k++) {
            if (
              wl.workerlist[j].workerId == availableWorkers[k].workerIdActual
            ) {
              let jsonValue = {
                name: availableWorkers[k].workerName,
                inTime: wl.workerlist[j].inTime,
                outTime: wl.workerlist[j].outTime
              };
              if (wl.workerlist[j].reason == 1) {
                jsonValue.reason = "MC";
              } else if (wl.workerlist[j].reason == 2) {
                jsonValue.reason = "Leave";
              } else if (wl.workerlist[j].reason == 3) {
                jsonValue.reason = "Absent";
              } else if (wl.workerlist[j].reason == 4) {
                jsonValue.reason = "Home Leave";
              } else if (wl.workerlist[j].reason == 5) {
                jsonValue.reason = "Late";
              } else {
                jsonValue.reason = "Others";
              }
              wl.paragraph +=
                "<p>  Name: " +
                availableWorkers[k].workerName +
                " -  In Time: " +
                wl.workerlist[j].inTime +
                " -  Out Time: " +
                wl.workerlist[j].outTime +
                " -  Reason: " +
                jsonValue.reason +
                "</p> </br> ";
              wl.finalRenderList.push(jsonValue);
            }
          }
        }
      });
    }
  };
  setPreview = () => {
    let contArr = [];
    this.selectedIds.map(ind => {
      contArr.push(document.getElementById("elm_" + ind).innerHTML + "<br />");
    });
    this.setState({ show: true, modalCont: contArr.join("") });
  };


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
    const { userType, requestDet } = this.props;
    const { listingDetails, requestType } = this.state;
    const { loading } = this.props;
    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";
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
          {loading == true && (
            <div className="center-div">
              <img src={loadingurl} />
            </div>
          )}

          {listingDetails && loading == false && (
            <CollapsiblePanel
              listingDetails={listingDetails}
              redirectView={this.redirectView}
            />
          )}
          {/* {listingDetails && loading == false && this.Listings(listingDetails)} */}
        </div>

          {this.state.showSubButton && (
            <div className="col-sm-3">
              <br />{" "}
              <CustomButton
                bsStyle="warning"
                id="submit"
                type="submit"
                onClick={() => this.setPreview()}
              >
                Preview
              </CustomButton>
            </div>

    )}
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
  }
}
