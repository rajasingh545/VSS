/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import DropdownMultiple from "../components/DropdownMultiple";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import CustInput from "../components/CustInput";
import PreviewTemplate from "../components/PreviewTemplate";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  requestPost,
  listigDetails,
  clearListing,
} from "actions/workArrangement.actions";
import { Modal } from "react-bootstrap";
import {
  getPreviewContent,
  getDetailsWithMatchedKey2,
} from "../common/utility";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import moment from "moment";
// import { isThisSecond } from "date-fns/esm";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  requestPost: state.request.get("requestPost"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class WorkArrangement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workers: [],
      project: [],
      supervisors: [],
      addSupervisors: [],
      show: false,
      modalTitle: "",
      modalMsg: "",
      projectTitle: "Select Project",
      supervisorTitle: "Select Supervisor",
      addsupervisorTitle: "Select Supervisor",
      workersTitle: "Select Workers",
      startDate1: moment(),
      startDate: moment().format("YYYY-MM-DD"),
      addsupervisorResetFlag: false,
      projectResetFlag: false,
      supervisorResetFlag: false,
      workerResetFlag: false,
      partialWorkers: [],
      partialAddSup: [],
      partialBaseSup: [],
      selectedSupervisor: {},
      selectedProject: {},
      selectedListSup: [],
      selectedListWork: [],
      value_supervisors: "",
      value_supervisors2: "",
    };
    this.partialWorkers = [];
    this.partialAddSup = [];
    this.partialBaseSup = [];
    this.resetThenSet = this.resetThenSet.bind(this); //this is required to bind the dispatch
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
    //get details of listing
    if (this.props.match.params && this.props.match.params.id !== undefined) {
      this.state.listingId = this.props.match.params.id;
      this.state.requestCode = 3;
      dispatch(listigDetails(this.state));
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log("next props", nextProps);

    if (nextProps.requestDet) {
      if (nextProps.requestDet.supervisors) {
        this.setState({
          supervisors: nextProps.requestDet.supervisors,
          addSupervisors: nextProps.requestDet.supervisors,
          workers: nextProps.requestDet.workers,
          value_supervisors: "",
          value_supervisors2: "",
        });
      } else if (
        nextProps.requestDet.availableWorkers &&
        this.state.requestCode == 99
      ) {
        this.state.workers = nextProps.requestDet.availableWorkers;
      } else {
        this.setState({
          workers: nextProps.requestDet.availableWorkers,
          projects: nextProps.requestDet.projects,
          supervisors: nextProps.requestDet.supervisorsList,
          addSupervisors: nextProps.requestDet.supervisorsList,
        });
        this.state.projects = nextProps.requestDet.projects;
        this.state.supervisors = nextProps.requestDet.supervisorsList;
        this.state.addSupervisors = nextProps.requestDet.supervisorsList;
        this.state.workers = nextProps.requestDet.availableWorkers;
      }
    }

    if (nextProps.requestPost && nextProps.requestPost.responsecode === 2) {
      toast.error("Work Arrangement already created for the project", {
        autoClose: 3000,
      });
      this.clearStore();
      return false;
    } else if (
      nextProps.requestPost &&
      nextProps.requestPost.responsecode === 1
    ) {
      toast.success("Work Arrangement Created Successfully", {
        autoClose: 3000,
      });
      this.resetForm();
      this.clearStore();
      setTimeout(() => {
        this.props.history.push("/WorkArrangmentList");
      }, 3000);
    }

    // console.log("==out ", nextProps.requestPost);
  }

  resetForm = () => {
    this.setState({
      show: false,
      addsupervisorResetFlag: true,
      projectResetFlag: true,
      supervisorResetFlag: true,
      workerResetFlag: true,
      startDate1: moment(),
      startDate: moment().format("YYYY-MM-DD"),
      projectId: "",
      value_supervisors: "",
      workerIds: [],
      selectedItems: [],
      remarks: "",
    });
    //in order to make selection of form again
    setTimeout(
      function () {
        this.state.addsupervisorResetFlag = false;
        this.state.projectResetFlag = false;
        this.state.supervisorResetFlag = false;
        this.state.workerResetFlag = false;
      }.bind(this),
      3000
    );
  };
  clearStore = () => {
    const { dispatch } = this.props;
    dispatch(clearListing([]));
  };

  getSupervisor = (key, list, stateKey, name, selectedObj) => {
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
    dispatch(requestDetails(this.state));
    this.resetThenSet(key, list, stateKey, name, selectedObj);
  };
  getAvailableWorker = () => {
    const { dispatch } = this.props;
    this.state.requestCode = 99;
    dispatch(requestDetails(this.state));
  };
  toggleSelected(list, stateKey, selectedIds, selectedList) {
    // console.log(list, stateKey, selectedIds, selectedList);
    this.setState({
      [stateKey]: list,
    });

    let selectedItems = list.filter(function (obj) {
      return obj.selected;
    });
    // console.log(selectedItems);
    if (stateKey == "AdditionalSupervisors") {
      let nameArr = selectedItems.map(function (obj) {
        return obj.Name;
      });

      this.setState({
        userId: selectedIds,
        Name: nameArr,
        selectedItemsAddSup: selectedItems,
        selectedListSup: selectedList,
      });
    } else {
      let nameArr = selectedItems.map(function (obj) {
        return obj.workerName;
      });

      this.setState({
        workerIds: selectedIds,
        workerName: nameArr,
        selectedItemsWorkers: selectedItems,
        selectedListWork: selectedList,
      });
    }
  }

  resetThenSet(key, list, stateKey, name, selectedObj) {
    let { supervisors, addSupervisors } = this.state;
    if (stateKey === "projects") {
      this.setState({
        [stateKey]: list,
        selectedProject: selectedObj,
      });

      let valuekey = `value_${stateKey}`;

      this.setState({
        [valuekey]: key.toString(),
      });
    } else {
      if(selectedObj){
        addSupervisors = supervisors.filter(
          (task) => task.userId !== selectedObj.userId
        );
        this.setState({
          [stateKey]: list,
          selectedSupervisor: selectedObj,
          addSupervisors,
        });
      }
      

      let valuekey = `value_${stateKey}`;

      this.setState({
        [valuekey]: key.toString(),
      });
    }
  }
  setRemarks = (e) => {
    let remarks = e.target.value;
    this.setState({ remarks });
  };
  validateForm = () => {
    // console.log("validation ===>", this.state);

    if (!this.state.startDate || this.state.startDate == "") {
      toast.error("Date is required", { autoClose: 3000 });
      return false;
    }
    if (!this.state.projectId || this.state.projectId == "") {
      toast.error("Project is required", { autoClose: 3000 });
      return false;
    }
    if (!this.state.value_supervisors || this.state.value_supervisors == "") {
      toast.error("Base supervisor is required", { autoClose: 3000 });
      return false;
    }
    // if(!this.state.value_supervisors2 || this.state.value_supervisors2 ==""){
    //   toast.error("Additional supervisor is required", { autoClose: 3000 });
    //   return false;
    // }
    if (!this.state.workerIds || this.state.workerIds.length == 0) {
      toast.error("Workers is required", { autoClose: 3000 });
      return false;
    }
    if (this.state.value_supervisors == this.state.value_supervisors2) {
      toast.error("Base & Additional Supervisors can not be same", {
        autoClose: 3000,
      });
      return false;
    }
    return true;
  };
  submitRequest = (status) => {
    const { dispatch } = this.props;

    let formValidation = this.validateForm();
    // console.log("validatiing form===", formValidation);
    if (formValidation == true) {
      this.state.requestCode = status == 3 ? 2 : 1;
      this.state.status = status;
      dispatch(requestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
    }
  };
  handleClose = () => {
    this.setState({ show: false });
    //this.setState({show:false, value_projects:"", value_supervisors:"", value_supervisors2:""});
  };
  setPreview = () => {
    // if(this.validateForm() == true){
    let detailArr = getPreviewContent(this.state, this.state);
    let cont = <PreviewTemplate detailsArr={detailArr} />;

    this.setState({ show: true, modalTitle: "Preview", modalMsg: cont });
    // }
  };
  onStartDateChange = (e) => {
    if (e != null) {
      this.setState({
        startDate: e.format("YYYY/MM/DD"),
        startDate1: e,
      });
    } else {
      this.setState({
        startDate: "",
        startDate1: "",
      });
    }

    this.state.startDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date
    this.getAvailableWorker();
    if (this.state.projectId) {
      this.getSupervisor(this.state.projectId);
    }
  };
  goBack = (e) => {
    e.preventDefault();
    this.props.history.push("/Home");
  };
  displayPartialWorkers = (workers) => {
    let self = this;
    // console.log("log", workers);
    return workers.map((name) => {
      return (
        <div>
          {" "}
          <input
            value={name.workerId}
            type="checkbox"
            onClick={this.selectPartialWorkers}
          />
          &nbsp;{name.workerName}
        </div>
      );
    });
  };
  displayPartialAddSup = (AddSup) => {
    let self = this;
    // console.log("log", workers);
    return AddSup.map((name) => {
      return (
        <div>
          {" "}
          <input
            value={name.userId}
            type="checkbox"
            onClick={this.selectPartialAddSup}
          />
          &nbsp;{name.Name}
        </div>
      );
    });
  };
  displayPartialBaseSup = (AddSup) => {
    let self = this;
    // console.log("log", workers);
    return AddSup.map((name) => {
      return (
        <div>
          {" "}
          <input
            value={name.userId}
            type="checkbox"
            onClick={this.selectPartialBaseSup}
          />
          &nbsp;{name.Name}
        </div>
      );
    });
  };
  selectPartialBaseSup = (e) => {
    e.stopPropagation();
    // console.log("==", e.target.checked, e.target.value);
    const { selectedSupervisor } = this.state;
    if (e.target.checked == true) {
      this.partialBaseSup.push(e.target.value);
      if (e.target.value == selectedSupervisor.userId) {
        selectedSupervisor.isPartial = true;
      }
    } else {
      var index = this.partialBaseSup.indexOf(e.target.value);
      if (index !== -1) {
        this.partialBaseSup.splice(index, 1);
      }
      if (e.target.value == selectedSupervisor.userId) {
        selectedSupervisor.isPartial = false;
      }
    }
    this.setState({ partialWorkers: this.partialWorkers, selectedSupervisor });
  };
  selectPartialAddSup = (e) => {
    e.stopPropagation();
    // console.log("==", e.target, this.state.selectedListSup);
    const { selectedListSup } = this.state;
    if (e.target.checked == true) {
      this.partialAddSup.push(e.target.value);
      selectedListSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = true;
        }
      });
    } else {
      var index = this.partialAddSup.indexOf(e.target.value);
      if (index !== -1) {
        this.partialAddSup.splice(index, 1);
      }
      selectedListSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = false;
        }
      });
    }
    this.setState({ partialWorkers: this.partialWorkers, selectedListSup });
  };
  selectPartialWorkers = (e) => {
    e.stopPropagation();
    const { selectedListWork } = this.state;
    if (e.target.checked == true) {
      this.partialWorkers.push(e.target.value);
      selectedListWork.map((WorkList) => {
        if (e.target.value == WorkList.workerId) {
          WorkList.isPartial = true;
        }
      });
    } else {
      var index = this.partialWorkers.indexOf(e.target.value);
      if (index !== -1) {
        this.partialWorkers.splice(index, 1);
      }
      selectedListWork.map((WorkList) => {
        if (e.target.value == WorkList.workerId) {
          WorkList.isPartial = true;
        }
      });
    }

    this.setState({ partialWorkers: this.partialWorkers, selectedListWork });
  };

  /* Render */
  render() {
    const {
      headerTitle,
      listingId,
      selectedListSup,
      selectedListWork,
      projectId,
      selectedSupervisor,
      selectedItemsAddSup,
    } = this.state;
    // console.log(selectedSupervisor);

    const { loading } = this.props;
    let availSupervisorsCount = 0,
      availWorkersCount = 0;
    if (projectId !== undefined || Number(projectId) > 0) {
      availSupervisorsCount = this.state.addSupervisors ? this.state.addSupervisors.length : 0;
      availWorkersCount = this.state.workers ? this.state.workers.length : 0;
    }
    return (
      <div className="container work-arr-container">
        <br />
        <ToastContainer autoClose={8000} />

        <div className="row">
          <div className="col-sm-6">
            <label>Date</label>
          </div>
          <div className="col-sm-6">
            <DatePicker
              selected={this.state.startDate1}
              className=" form-control"
              isClearable={false}
              onChange={this.onStartDateChange}
              minDate={new Date()}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Project</label>
          </div>
          <div className="col-sm-6">
            <Dropdown
              title={this.state.projectTitle}
              name="projectName"
              keyName="projectId"
              stateId="projects"
              reset={this.state.projectResetFlag}
              list={this.state.projects}
              value={this.state.value_projects}
              resetThenSet={this.getSupervisor}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label>Base Supervisor</label>
          </div>
          <div className="col-sm-6">
            <Dropdown
              title={this.state.supervisorTitle}
              name="Name"
              keyName="userId"
              stateId="supervisors"
              reset={this.state.supervisorResetFlag}
              list={this.state.supervisors}
              resetThenSet={this.resetThenSet}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label>Partial Base Supervisor</label>
          </div>
          <div className="col-sm-6">
            {typeof selectedSupervisor.userId !== "undefined" && (
              <div>{this.displayPartialBaseSup([selectedSupervisor])}</div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Additional Supervisor</label>{" "}
            {"(" + availSupervisorsCount + ")"}
          </div>
          <div className="col-sm-6">
            {/* <Dropdown
              title={this.state.addsupervisorTitle}
              name="Name"
              keyName="userId"
              stateId="supervisors2"
              reset={this.state.addsupervisorResetFlag}
              list={this.state.supervisors}
              resetThenSet={this.resetThenSet}
            /> */}
            <DropdownMultiple
              titleHelper="Additional Supervisor"
              title={this.state.addsupervisorTitle}
              name="Name"
              keyName="userId"
              reset={this.state.addsupervisorResetFlag}
              stateKey="AdditionalSupervisors"
              headerTitle={headerTitle}
              list={this.state.addSupervisors}
              toggleItem={this.toggleSelected}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Partial Additional Supervisor</label>
          </div>
          <div className="col-sm-6">
            {this.state.selectedItemsAddSup && (
              <div>
                {this.displayPartialAddSup(this.state.selectedItemsAddSup)}
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Workers</label> {"(" + availWorkersCount + ")"}
          </div>
          <div className="col-sm-6">
            <DropdownMultiple
              titleHelper="Workers"
              title={this.state.workersTitle}
              name="workerName"
              keyName="workerId"
              reset={this.state.workerResetFlag}
              stateKey="workers"
              headerTitle={headerTitle}
              list={this.state.workers}
              toggleItem={this.toggleSelected}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Partial Workers</label>
          </div>
          <div className="col-sm-6">
            {this.state.selectedItemsWorkers && (
              <div>
                {this.displayPartialWorkers(this.state.selectedItemsWorkers)}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label>Remark</label>
          </div>
          <div className="col-sm-6">
            <CustInput
              type="textarea"
              value={this.state.remarks}
              onChange={this.setRemarks}
            />
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-sm-3">
            <CustomButton
              id="draft"
              bsStyle="secondary"
              type="submit"
              onClick={this.goBack}
            >
              Back
            </CustomButton>{" "}
          </div>
          <div className="col-sm-3">
            {" "}
            <CustomButton
              bsStyle="warning"
              id="preview"
              type="submit"
              onClick={this.setPreview}
            >
              Preview
            </CustomButton>
          </div>
          <div className="col-sm-3">
            <CustomButton
              bsStyle="primary"
              id="draft"
              type="submit"
              onClick={() => this.submitRequest(2)}
            >
              Draft
            </CustomButton>{" "}
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>{this.state.modalTitle}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{this.state.modalMsg}</p>
          </Modal.Body>
          <Modal.Footer>
            <CustomButton bsStyle="secondary" onClick={this.handleClose}>
              Close
            </CustomButton>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

/* Export Home*/
export default WorkArrangement;
