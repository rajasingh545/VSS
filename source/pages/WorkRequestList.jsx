import React from "react";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import PreviewTemplate from "../components/PreviewTemplate";
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
import { getDetailsWithMatchedKey2, addDays, subDays } from "../common/utility";

import DatePicker from "react-datepicker";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import InputSearch from "../components/InputSearch";
import CollapsiblePanel from "../components/CollapsiblePanel";
import { Image, Icon, Label, Menu, Table } from "semantic-ui-react";
@connect((state) => ({
  loading: state.request.get("loadingListing"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
export default class WorkRequestList extends React.Component {
  constructor(props) {
    super(props);
    let arr = [];
    arr[0] = { id: "1", name: "Submitted" };
    arr[1] = { id: "2", name: "Draft" };

    this.state = {
      requestCode: 2,
      requestStatus: 2,
      projectId: "",
      projects: [],
      clients: [],
      options: arr,
      startDate1: moment(),
      show: false,
      modalCont: "",
      requestTypeTitle: "Select Status",
      requestJsonData: {
        startDate: "",
        startDate1: moment(new Date()),
        endDate: "",
        endDate1: moment(new Date()),
        requestData: {},
        selectedProjectData: {
          endTime: "",
          projectId: "0",
          projectName: "Select All",
          selected: true,
          startTime: "",
        },
        selectedClientData: {
          clientId: "0",
          clientName: "Select All",
          projects: "0",
          selected: true,
        },
      },
    };
    this.initialItems = [];
    this.selectedIds = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(requestPostClear());
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    //  if(!this.props.requestDet){
    dispatch(requestDetails(this.state));
    //  }
  }
  componentWillReceiveProps(nextProps) {
    const { requestDet, workRequestData } = nextProps;
    // console.log("nextProps", nextProps);

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
    this.setState({ projects: projects });
    this.setState({ clients: clients });
    if (nextProps.workRequestData) {
      this.setState({ workRequestData: nextProps.workRequestData });
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearListing());
  }
  componentDidMount() {
    let requestType = sessionStorage.getItem("requestType");
    let requestTypeTitle = sessionStorage.getItem("requestTypeTitle");
    console.log(requestType, requestTypeTitle);
    sessionStorage.setItem(
      "dateSelected",
      this.state.startDate1.format("YYYY/MM/DD")
    );
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
      this.handleRequestType(requestType, [], "", requestTypeTitle);
    }
  }
  // redirectView = (requestId) => {
  //   this.props.history.push(`/WorkRequestPreview/${requestId}`);
  // };
  redirectView = (requestId) => {
    if (this.props.userType == 1) {
      this.props.history.push("/WorkRequestPreview/" + requestId);
      // this.props.history.push(`/WorkRequestPreview/${requestId}`);
    }
  };
  Listings = (listings) => {
    let { workRequestData, requestDet } = this.props;
    let response = "";
    let requestDetails = {};
    this.initialItems = [];
    if (workRequestData && workRequestData.length > 0) {
      response = listings.map((data, index) => {
        let projectName = "";
        let clientname = "";
        if (this.props.requestDet) {
          // console.log("==",this.props.requestDet.clients[data.projectId])

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
        let PName = [...projectName].join(""),
          CName = [...clientname].join("");
        PName = PName.slice(0, 3).toUpperCase();
        CName = CName.slice(0, 3).toUpperCase();

        let elmId = "elm_" + requestDetails.workArrangementId;
        let wrstr =
          "VSS-" +
          CName +
          "-" +
          PName +
          "-WR-" +
          ("0000" + data.workRequestId).substring(data.workRequestId.length);

        data.Title =
          wrstr +
          " " +
          projectName +
          " : " +
          clientname +
          "  Requested By :  " +
          data.requestedBy;
        // console.log(data.title, data.requestSizeList, data.requestmanpower);
        if (data.requestSizeList.length > 0) {
          let text = "";
          data.requestSizeList.map((_x, i) => {
            let title = _x.scaffoldsubcategory,
              size = _x.size;
            text +=
              "<p>" +
              title +
              "</p> </br>  <p> Size-" +
              (i + 1) +
              " :" +
              size +
              ";</p> </br>";
          });
          data.paragraph = text;
        } else {
          data.paragraph = "<p>No Record</p>";
        }
        // console.log(data);

        // return (
        //   <div
        //     className="row Listing1 hrline hoverColor"
        //     style={{ cursor: "pointer" }}
        //     key={data.workRequestId}
        //     onClick={() => this.redirectView(data.workRequestId)}
        //   >
        //     <strong>{wrstr} : </strong>
        //     {projectName} : {clientname} Requested By : {data.requestedBy}
        //   </div>
        // );
      });
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
  onStartDateChange1 = (e) => {
    const { dispatch } = this.props;
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.startDate = e.format("YYYY/MM/DD");
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
  onStartDateChange = (e) => {
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.startDate = e.format("YYYY/MM/DD");
      requestJsonData.startDate1 = e;
      this.setState({
        requestJsonData,
      });
    }
  };
  onEndDateChange = (e) => {
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.endDate = e.format("YYYY/MM/DD");
      requestJsonData.endDate1 = e;
      this.setState({
        requestJsonData,
      });
    }
  };
  onSelectDropdown = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.requestData = selectedData;
    this.setState({ requestJsonData });
  };
  onSelectDropdownProject = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedProjectData = selectedData;
    this.setState({ requestJsonData });
  };
  onSelectDropdownClient = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.selectedClientData = selectedData;
    this.setState({ requestJsonData });
  };
  onSearchHandle = () => {
    const { dispatch } = this.props;
    let {
        requestCode,
        requestJsonData,
        startDate1,
        userId,
        userType,
      } = this.state,
      JSONData = {};
    JSONData.requestCode = 23;
    JSONData.requestJsonData = requestJsonData;
    JSONData.startDate1 = startDate1;
    JSONData.userId = userId;
    JSONData.userType = userType;
    if (JSONData.requestJsonData.startDate === "") {
      JSONData.requestJsonData.startDate = moment(new Date()).format(
        "YYYY/MM/DD"
      );
    }
    if (
      Number(moment(new Date(requestJsonData.startDate1)).format("YYYYMMDD")) >
      Number(moment(new Date(requestJsonData.endDate1)).format("YYYYMMDD"))
    ) {
      toast.error("Please select correct date", { autoClose: 2000 });
    }
    if (JSONData.requestJsonData.requestData.id === undefined) {
      toast.error("Please select Status", { autoClose: 2000 });
    } else {
      dispatch(workRequestPost(JSONData));
    }
  };
  setPreview = () => {
    let contArr = [];
    this.selectedIds.map((ind) => {
      contArr.push(document.getElementById("elm_" + ind).innerHTML + "<br />");
    });
    this.setState({ show: true, modalCont: contArr.join("") });
  };

  handleRequestType = (key, list, stateKey, title) => {
    const { dispatch, userType, userId } = this.props;

    this.state.requestType = key;
    this.state.requestCode = 15;
    this.state.userType = userType;
    this.state.userId = userId;

    // console.log("this.state", this.state)
    dispatch(workRequestPost(this.state));
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
    const { requestType, requestJsonData, projects, clients } = this.state;
    // console.log("options", options);
    const { loading } = this.props;
    // console.log(projects, clients, workRequestData);

    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";
    if (
      Number(moment(new Date(requestJsonData.startDate1)).format("YYYYMMDD")) >
      Number(moment(new Date(requestJsonData.endDate1)).format("YYYYMMDD"))
    ) {
      toast.error("Please select correct date", { autoClose: 2000 });
    }
    return (
      <div>
        <ToastContainer autoClose={8000} />
        <br />
        <div className="row">
          <div className="col-xs-2">
            <DatePicker
              selected={requestJsonData.startDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onStartDateChange}
              minDate={userType == 1 ? "" : subDays(new Date(), 1)}
              maxDate={new Date()}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
            />
          </div>
          <div className="col-xs-2">
            <DatePicker
              selected={requestJsonData.endDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onEndDateChange}
              minDate={userType == 1 ? "" : new Date()}
              maxDate={addDays(new Date(), 1)}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
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
              resetThenSet={this.onSelectDropdown}
            />
          </div>

          <div className="col-xs-2">
            <Dropdown
              title="Select Client"
              name="clientName"
              keyName="clientId"
              stateId="status"
              list={clients}
              value={requestType}
              resetThenSet={this.onSelectDropdownClient}
            />
          </div>

          <div className="col-xs-2">
            <Dropdown
              title="Select Project"
              name="projectName"
              keyName="projectId"
              stateId="status"
              list={projects}
              value={requestType}
              resetThenSet={this.onSelectDropdownProject}
            />
          </div>

          <div className="col-xs-4">
            <Button
              bsStyle="primary"
              type="submit"
              onClick={this.onSearchHandle}
            >
              {loading === true ? "Loading ..." : "Search"}
            </Button>
          </div>
          {/* {workRequestData && loading == false && (
            <div>
              <div style={{ zIndex: 0 }}>
                <InputSearch
                  initialItems={this.initialItems}
                  FilterData={this.FilterDataCallBackfun}
                />
              </div>
            </div>
          )} */}
        </div>
        <div className="row">
          <div className="col-xs-8">
            <div className="padding15" id="divRequestListing">
              {loading == true && (
                <div className="center-div">
                  <img src={loadingurl} />
                </div>
              )}

              {/* {workRequestData && loading == false && (
            <CollapsiblePanel
              listingDetails={listingDetails}
              redirectView={this.redirectView}
            />
          )} */}
              {workRequestData && loading == false && (
                <div>{this.Listings(this.state.workRequestData)}</div>
              )}
            </div>
          </div>
          <div className="col-xs-2">&nbsp;</div>
        </div>

        {/* <div className="row">
          <div className="col-xs-8">
            <Dropdown
              title={this.state.requestTypeTitle}
              name="name"
              keyName="id"
              stateId="status"
              list={this.state.options}
              value={requestType}
              resetThenSet={this.handleRequestType}
            />
          </div>
          <div className="col-xs-2">&nbsp;</div>
        </div> */}

        {/* <div className="padding15" id="divRequestListing">
          {loading == true && (
            <div className="center-div">
              <img src={loadingurl} />
            </div>
          )}
          {workRequestData && loading == false && (
            <div>
              <div style={{ zIndex: 0 }}>
                <InputSearch
                  initialItems={this.initialItems}
                  FilterData={this.FilterDataCallBackfun}
                />
              </div>
              {this.Listings(this.state.workRequestData)}
            </div>
          )}
        </div> */}
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
