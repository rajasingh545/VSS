import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import Dropdown from "../components/Dropdown";
import { DOMAIN_NAME } from "../config/api-config";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  workRequestPost,
  requestPostClear,
  listigDetails,
  clearListing,
} from "actions/workArrangement.actions";
import CustomButton from "../components/CustomButton";
import { getDetailsWithMatchedKey2 } from "../common/utility";

import DatePicker from "react-datepicker";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import InputSearch from "../components/InputSearch";
import CollapsiblePanel from "../components/CollapsiblePanel";
@connect((state) => ({
  loading: state.request.get("loadingListing"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
export default class DailyWorkTrackList extends React.Component {
  constructor(props) {
    super(props);
    let arr = [];
    arr[0] = { id: "1", name: "Submitted" };
    arr[1] = { id: "2", name: "Draft" };

    this.state = {
      requestCode: 2,
      requestStatus: 2,
      projectId: "",
      options: arr,
      startDate1: moment(),
      endDate1: moment(),
      show: false,
      modalCont: "",
      requestTypeTitle: "Select Status",
      projects: [],
      clients: [],
      supervisors: [],
      requestJsonData: {
        startDate: "",
        startDate1: moment(new Date()),
        endDate: "",
        endDate1: moment(new Date()),
        requestData: {},
        selectedProjectData: {
          projectId: "0",
          projectName: "Select All",
          selected: true,        
        },
        selectedClientData: {
          clientId: "0",
          clientName: "Select All",
          projects: "0",
          selected: true,
        },selectedSupervisorData:{
          userId: "0",
          userName: "Select All",
          supervisors: "0",
          selected: true,
        },
      }
    };

    this.selectedIds = [];
    this.initialItems = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(requestPostClear());
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    this.state.requestType = this.props.requestType;
    this.state.clientName = this.props.clientName;
    this.state.projectName = this.props.projectName;
    this.state.supervisorName = this.props.supervisorName;

    //  if(!this.props.requestDet){
    dispatch(requestDetails(this.state));
    //  }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);

    const { requestDet } = nextProps;
    this.setState({ listingDetails: nextProps.listingDetails });
    this.setState({ requestDet: requestDet });

    if (nextProps.workRequestData) {
      // this.initialItems = nextProps.workRequestData;
      this.setState({ workRequestData: nextProps.workRequestData });
    }

    let projects = requestDet ? [...requestDet.projects] : [],
      clients = requestDet ? [...requestDet.clients] : [],
      defaultProject = {
        endTime: "",
        projectId: "0",
        projectName: "Select All",
        selected: true,
        startTime: "",
      },
      defaultClient = {
        clientId: "0",
        clientName: "Select All",
        projects: "0",
        selected: true,
      };
    projects.splice(0, 0, defaultProject);
    clients.splice(0, 0, defaultClient);
    this.setState({ listingDetails: nextProps.listingDetails });
    this.setState({ requestDet: requestDet });
    this.setState({ projects: nextProps.requestDet.projects });
    this.setState({ clients: nextProps.requestDet.clients });
    this.setState({supervisors: nextProps.requestDet.supervisorsList  });
    this.state.supervisors = nextProps.requestDet.supervisorsList;
    this.state.projects = nextProps.requestDet.projects;
    this.state.clients = nextProps.requestDet.clients;


  }
  componentWillUnmount() {
   
    const { dispatch } = this.props;
    dispatch(clearListing());
  }
  componentDidMount() {
    let requestType = sessionStorage.getItem("requestType");
    let clientId = sessionStorage.getItem("clientId");
    let projectId = sessionStorage.getItem("projectId");
    let userId = sessionStorage.getItem("userId");
    let requestTypeTitle = sessionStorage.getItem("requestTypeTitle");
    let selectedDate = moment();
    if (sessionStorage.getItem("dateSelected")) {
      selectedDate = sessionStorage.getItem("dateSelected");
    }

    let dateSelected = moment(selectedDate);
    let actualDate = dateSelected.format("YYYY/MM/DD");
    if (requestType) {
      // console.log("dateSelected",dateSelected.format("YYYY/MM/DD"));
      this.setState({
        requestType,
        requestTypeTitle,
        startDate1: dateSelected,
      });
      this.state.startDate = actualDate;
      this.state.requestType=requestType;
      this.handleRequestType(requestType, [], "", requestTypeTitle);
    }
  }
  redirectView = (requestId) => {
    if(this.state.userType == 1)
    {
    this.props.history.push("/DWTRPreview/" + requestId);
    }
    console.log("this.state.requestType"+this.state.requestType);
    sessionStorage.setItem("requestType",this.state.requestType);
    if(this.state.userType == 5 && this.state.requestType == 2)
    {
    this.props.history.push("/DWTRPreview/" + requestId);
    }
    
  };

  Listings = (listings) => {
    // console.log(listings);

    let { workRequestData, requestDet } = this.props;
    let response = "";
    let requestDetails = {};
    this.initialItems = [];
    if (workRequestData && workRequestData.length > 0) {
      response = listings.map((data, index) => {
        let projectName = "";
        let clientname = "";
        if (this.props.requestDet) {
          projectName = getDetailsWithMatchedKey2(
            data.projectId,
            this.props.requestDet.projects,
            "projectId",
            "projectName"
          );
          clientname = getDetailsWithMatchedKey2(
            data.clientId,
            this.props.requestDet.clients,
            "clientId",
            "clientName"
          );
        }
        let checkBox = true;
        if (this.state.requestType == 1) {
          checkBox = false;
        }
        this.initialItems.push({
          ...data,
          projectName,
          clientname,
        });
        let elmId = "elm_" + requestDetails.workArrangementId;
        data.Title =
          projectName +
          " : " +
          clientname +
          " , " +
          data.createdByName +
          " , " +
          moment(data.createdOn).format("DD-MM-YYYY HH:mm A")+" , " +
          data.remarks;
        data.paragraph = "";
        let p = "";

        if (data.requestSizeList && data.requestSizeList.length > 0) {
          data.requestSizeList.map((_x) => {
            p += "<p> " + _x.expandteams + " ;</p>  </br>";
          });
        }
        if (data.requestMatList && data.requestMatList.length > 0) {
          data.requestMatList.map((_x) => {
            p += "<p> " + _x.expandmaterials + " ;</p>  </br>";
          });
        }
        if (data.requestItems && data.requestItems.length > 0) {
          data.requestItems.map((_x) => {
            p += "<p> " + _x.WR_text + " : " + _x.expanditems + " ;</p>  </br>";
          });
        }
        
        data.paragraph += p;
        // console.log(data);

        // return (
        //   <div
        //     className="row Listing1 hrline hoverColor"
        //     style={{ cursor: "pointer" }}
        //     key={data.workRequestId}
        //     onClick={() => this.redirectView(data.worktrackId)}
        //   >
        //     <strong>{projectName} :</strong> {clientname}
        //   </div>
        // );
      });
      // console.log(listings);

      return (
        <CollapsiblePanel
          listingDetails={listings}
          redirectView={this.redirectView}
        />
      );
    } else {
      response = (
        <div
          style={{
            color: "red",
            width: "80%",
            textAlign: "center",
            textWeight: "bold",
            paddingTop: "100px",
          }}
        >
          No Listings Found
        </div>
      );
    }
    return response;
  };
  onCheckBoxClickCallBack = (id, checked) => {
    if (checked === true) {
      this.selectedIds.push(id);
    } else {
      let index = this.selectedIds.indexOf(id);
      this.selectedIds.splice(index, 1);
    }

    if (this.selectedIds.length > 0) {
      this.setState({ showSubButton: true });
    } else {
      this.setState({ showSubButton: false });
    }
  };
  onStartDateChange = (e) => {
    console.log('Date selected '+e.format("YYYY/MM/DD"));
    const { dispatch } = this.props;
    if (e != null) {
      this.setState({
        startDate: e.format("YYYY/MM/DD"),
        startDate1: e,
      });
      sessionStorage.setItem("dateSelected", e.format("YYYY/MM/DD"));
    } else {
      this.setState({
        startDate: "",
        startDate1: "",
      });
    }
    this.state.startDate = e.format("YYYY/MM/DD");
    if (this.state.requestType) {
      dispatch(workRequestPost(this.state));
    }
  };

  onEndDateChange = (e) => {
    console.log('Date selected '+e.format("YYYY/MM/DD"));
    const { dispatch } = this.props;
    if (e != null) {
      this.setState({
        endDate: e.format("YYYY/MM/DD"),
        endDate1: e,
      });
      sessionStorage.setItem("dateSelected", e.format("YYYY/MM/DD"));
    } else {
      this.setState({
        endDate: "",
        endDate1: "",
      });
    }
    this.state.endDate = e.format("YYYY/MM/DD");
    if (this.state.requestType) {
      dispatch(workRequestPost(this.state));
    }
  };

  onSelectDropdownClient = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedClientData = selectedData;
    this.setState({ requestJsonData });
  };
  
  onSelectDropdownProject = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedProjectData = selectedData;
    this.setState({ requestJsonData });
  };
  onSelectDropdown = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedSupervisorData = selectedData;
    this.setState({ requestJsonData });
  };
  onSelectStatus = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedStatusData = selectedData;
    this.setState({ requestJsonData });
  };
  setPreview = () => {
    let contArr = [];
    this.selectedIds.map((ind) => {
      contArr.push(document.getElementById("elm_" + ind).innerHTML + "<br />");
    });
    this.setState({ show: true, modalCont: contArr.join("") });
  };

  handleRequestType = (key, list, stateKey, title) => {
    const { dispatch, userType, userId,projectId,clientId } = this.props;

   // this.state.requestType = key;
    this.state.requestCode = 18;
    this.state.userType = userType;
    this.state.userId = userId;
    this.state.projectId = projectId;
    this.state.clientId = clientId;
    //this.state.requestType = requestType;
    if(this.state.requestJsonData != null && this.state.requestJsonData != undefined)
    {
      if(this.state.requestJsonData.selectedClientData.clientId === "0")
      {
      toast.error("Please select Client", { autoClose: 2000 });
      }else if(this.state.requestJsonData.selectedProjectData.projectId === "0")
      {
      toast.error("Please select Project", { autoClose: 2000 });
      }else if(this.state.requestJsonData.selectedSupervisorData.userId === "0")
      {
      toast.error("Please select Supervisor", { autoClose: 2000 });     
      }else if(this.state.requestJsonData.selectedStatusData === undefined)
      {
      toast.error("Please select Status", { autoClose: 2000 });
      }
      else{
        console.log("this.state", this.state)
       dispatch(workRequestPost(this.state));
       }
    }
  };

  setProjectId = (e) => {
    this.state.projectId = e.target.value;
    this.setState({ cboProjects: "0", listingDetails: {} });
  };
  handleClose = () => {
    this.setState({ show: false });
    //this.setState({show:false, value_projects:"", value_supervisors:"", value_supervisors2:""});
  };
  handleSubmit = () => {
    const { dispatch } = this.props;
    this.handleClose();
    let param = {};
    param.requestCode = 4;
    param.ids = this.selectedIds;
    dispatch(workRequestPost(param));
    toast.success("Updated Successfully", { autoClose: 2000 });
    setTimeout(() => {
      this.props.history.push("/Home");
    }, 2000);
  };
  FilterDataCallBackfun = (result) => {
    this.setState({ workRequestData: result });
  };
  render() {
    const { userType, requestDet, workRequestData } = this.props;
    const { requestType , projects, clients,clientId, projectNo,userId} = this.state;
    // console.log("options", options);
    const { loading } = this.props;

    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";
    return (
      <div>
        <ToastContainer autoClose={8000} />
        <br />

        <div className="row">
        <div className="col-xs-2">
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
            <DatePicker
              selected={this.state.endDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onEndDateChange}
              name="endDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
            />
            </div>
             <div className="col-xs-2">
            <Dropdown
              title="Select Client"
              name="clientName"
              keyName="clientId"
              stateId="status"
              list={clients}
              value={clientId}
              resetThenSet={this.onSelectDropdownClient}
            />
          </div>

          <div className="col-xs-2">
            <Dropdown
              title="Select Project"
              name="projectName"
              keyName="projectId"
              stateId="projects"
              list={projects}
              value={projectNo}              
              resetThenSet={this.onSelectDropdownProject}
            />
          </div>
          <div className="col-xs-2">
          <Dropdown
              title="Select Supervisor"
              name="Name"
              keyName="userId"
              stateId="supervisors"              
              list={this.state.supervisors}
              value={userId}
              resetThenSet={this.onSelectDropdown}
            />
        </div>

          <div className="col-xs-2">
          
            <Dropdown
              title={this.state.requestTypeTitle}
              name="name"
              keyName="id"
              stateId="status"
              list={this.state.options}
              value={requestType}
              resetThenSet={this.onSelectStatus}             
            />
          
          </div>
        </div>

        <div className="col-xs-4">
            <Button
              bsStyle="primary"
              type="submit"
              onClick={this.handleRequestType}
            >
              {loading === true ? "Loading ..." : "Search"}
            </Button>
          </div>
        <div className="row">
          
          <div className="col-xs-2">&nbsp;</div>
        </div>

        <div id="divRequestListing">
          {loading == true && (
            <div className="center-div">
              <img src={loadingurl} />
            </div>
          )}
          {this.state.workRequestData && loading == false && (
            <div className="row">
              <div className="col-xs-8">
                {/* <InputSearch
                  initialItems={this.initialItems}
                  FilterData={this.FilterDataCallBackfun}
                /> */}
                {this.Listings(this.state.workRequestData)}
              </div>
            </div>
          )}
        </div>
        <div>
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
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Preview</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              id="showContent"
              dangerouslySetInnerHTML={{ __html: this.state.modalCont }}
            ></div>
          </Modal.Body>
          <Modal.Footer>
            <div className="col-sm-3">
              {" "}
              <CustomButton bsStyle="primary" onClick={this.handleSubmit}>
                Submit
              </CustomButton>
            </div>
            <div className="col-sm-3">
              {" "}
              <CustomButton bsStyle="secondary" onClick={this.handleClose}>
                Close
              </CustomButton>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
