import React from "react";
import { connect } from "react-redux";
import PreviewTemplate from "../components/PreviewTemplate";
import Dropdown from "../components/Dropdown";
import { DOMAIN_NAME } from "../config/api-config";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  workRequestPost,
  requestPostClear,
  listigDetails,
  clearListing
} from "actions/workArrangement.actions";
import CustomButton from "../components/CustomButton";
import { getDetailsWithMatchedKey2 } from "../common/utility";

import DatePicker from "react-datepicker";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import InputSearch from "../components/InputSearch";

@connect(state => ({
  loading: state.request.get("loadingListing"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet")
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
        selectedProjectData: {}
      }
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
    const { requestDet } = nextProps;
    this.setState({ listingDetails: nextProps.listingDetails });
    this.setState({ requestDet: requestDet });
    this.setState({ projects: requestDet.projects });
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
        startDate1: dateSelected
      });
      this.state.startDate = actualDate;
      this.handleRequestType(requestType, [], "", requestTypeTitle);
    }
  }
  redirectView = requestId => {
    this.props.history.push("/WorkRequest/" + requestId);
  };

  Listings = listings => {
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
            [this.props.requestDet.clients],
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
          clientname
        });
        let elmId = "elm_" + requestDetails.workArrangementId;
        let wrstr =
          "WR" +
          ("0000" + data.workRequestId).substring(data.workRequestId.length);
        return (
          <div
            className="row Listing1 hrline hoverColor"
            style={{ cursor: "pointer" }}
            key={data.workRequestId}
            onClick={() => this.redirectView(data.workRequestId)}
          >
            <strong>{wrstr} : </strong>
            {projectName} : {clientname} Requested By : {data.requestedBy}
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
  onStartDateChange1 = e => {
    const { dispatch } = this.props;
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.startDate = e.format("YYYY/MM/DD");
      this.setState({
        startDate: e.format("YYYY/MM/DD"),
        startDate1: e
      });
      sessionStorage.setItem("dateSelected", e.format("YYYY/MM/DD"));
    } else {
      this.setState({
        startDate: "",
        startDate1: ""
      });
    }
    this.state.startDate = e.format("YYYY/MM/DD");
    if (this.state.requestType) {
      dispatch(workRequestPost(this.state));
    }
  };
  onStartDateChange = e => {
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.startDate = e.format("YYYY/MM/DD");
      requestJsonData.startDate1 = e;
      this.setState({
        requestJsonData
      });
    }
  };
  onEndDateChange = e => {
    if (e != null) {
      let { requestJsonData } = this.state;
      requestJsonData.endDate = e.format("YYYY/MM/DD");
      requestJsonData.endDate1 = e;
      this.setState({
        requestJsonData
      });
    }
  };
  onSelectDropdown = (key, list, stateKey, title, selectedData) => {
    let { requestJsonData } = this.state;
    requestJsonData.requestData = selectedData;
    this.setState({ requestJsonData });
  };
  onSelectDropdownProject = (key, list, stateKey, title, selectedData) => {
    const { dispatch } = this.props;
    let { requestJsonData } = this.state;
    requestJsonData.selectedProjectData = selectedData;
    this.setState({ requestJsonData });
    dispatch(workRequestPost(this.state));
  };
  setPreview = () => {
    let contArr = [];
    this.selectedIds.map(ind => {
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

  setProjectId = e => {
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

  FilterDataCallBackfun = result => {
    this.setState({ workRequestData: result });
  };
  render() {
    const { userType, requestDet, workRequestData } = this.props;
    const { requestType, requestJsonData, projects } = this.state;
    // console.log("options", options);
    const { loading } = this.props;

    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";
    console.log(requestJsonData);

    return (
      <div>
        <ToastContainer autoClose={8000} />
        <br />
        <div className="row">
          <div className="col-xs-3">
            <DatePicker
              selected={requestJsonData.startDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onStartDateChange}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
            />
          </div>
          <div className="col-xs-3">
            <DatePicker
              selected={requestJsonData.endDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onEndDateChange}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
            />
          </div>
          <div className="col-xs-3">
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
          <div className="col-xs-3">
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
        </div>
        <div className="row">
          <div className="col-xs-8">
            <div className="padding15" id="divRequestListing">
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
