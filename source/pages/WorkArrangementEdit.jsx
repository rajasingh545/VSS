/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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
import { DOMAIN_NAME } from "../config/api-config";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  requestDet: state.request.get("requestDet"),
  requestPost: state.request.get("requestPost"),
}))
@baseHOC
class WorkArrangementEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workers: [],
      project: [],
      supervisors: [],
      show: false,
      modalTitle: "",
      modalMsg: "",
      projectTitle: "Select Project",
      supervisorTitle: "Select Supervisor",
      addsupervisorTitle: "Select Supervisor",
      partialWorkers: [],
      partialAddSup: [],
      partialBaseSupervisors: [],
    };
    this.partialWorkers = [];
    this.partialAddSup = [];
    this.partialBaseSupervisors = [];
    this.resetThenSet = this.resetThenSet.bind(this); //this is required to bind the dispatch
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    // console.log("next props", this.props);
    //get details of listing
    if (this.props.match.params && this.props.match.params.id) {
      this.state.listingId = this.props.match.params.id;
      dispatch(requestDetails(this.state));

      this.state.requestCode = 3;
      if (
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.requestType_Title &&
        this.props.location.state.requestType_Title === "Draft"
      ) {
        this.state.requestType = 2;
      } else if (
        this.props.location &&
        this.props.location.state &&
        this.props.location.state.requestType_Title &&
        this.props.location.state.requestType_Title === "Submitted"
      ) {
        this.state.requestType = 1;
      }

      dispatch(listigDetails(this.state));
    }
  }
  componentWillReceiveProps(nextProps) {
    console.log("next props", nextProps);
    let { listingDetails } = nextProps;
    const { dispatch } = this.props;
    if (Array.isArray(nextProps.requestPost)) {
      if (
        nextProps.location &&
        nextProps.location.state &&
        nextProps.location.state.requestType_Title &&
        nextProps.location.state.requestType_Title === "Draft"
      ) {
        if (
          nextProps.listingDetails &&
          nextProps.listingDetails.workdraft &&
          nextProps.listingDetails.workdraft ===
            "Worker or Supervisor Already Assigned Project"
        ) {
          toast.error(
            "Worker or Supervisor Already Assigned to another Project",
            {
              autoClose: 3000,
            }
          );
          // this.resetForm();
          this.clearStore();
          setTimeout(() => {
            this.props.history.push("/WorkArrangmentList");
          }, 3000);
        }
      }

      if (nextProps.requestDet) {
        if (nextProps.requestDet.supervisors) {
          this.setState({
            supervisors: nextProps.requestDet.supervisors,
            value_supervisors: "",
            value_supervisors2: "",
          });
        } else if (nextProps.requestDet && nextProps.listingDetails) {
          // this.setState({workers:nextProps.requestDet.workers, projects:nextProps.requestDet.projects, supervisors:nextProps.requestDet.supervisorsList});
          this.state.projects = [...nextProps.requestDet.projects];
          this.state.supervisors = [...listingDetails.availablesupervisor];
          this.state.workers = [...listingDetails.availableworker];
          this.state.addSupervisors = [...listingDetails.availablesupervisor];
          this.state.baseSupervsor = [...listingDetails.availablesupervisor];
          this.state.addSupervisors = this.state.addSupervisors.filter(
            (addSup) => addSup.userId !== listingDetails.baseSupervsor
          );
          this.state.baseSupervsor = this.state.baseSupervsor.filter(
            (addSup) => addSup.userId === listingDetails.baseSupervsor
          );
        }
      }

      if (listingDetails && this.state.projects && this.state.supervisors) {
        this.setState({ value_projects: listingDetails.projectId });
        this.setState({ projectId: listingDetails.projectId });
        let proTitle = getDetailsWithMatchedKey2(
          listingDetails.projectId,
          this.state.projects,
          "projectId",
          "projectName"
        );
        this.state.projectTitle = proTitle;
        let superTitle = getDetailsWithMatchedKey2(
          listingDetails.baseSupervsor,
          this.state.supervisors,
          "userId",
          "Name"
        );
        this.state.supervisorTitle = superTitle;
        console.log(this.state.supervisorTitle);

        this.setState({ value_supervisors: listingDetails.baseSupervsor });
        let addsuperTitle = getDetailsWithMatchedKey2(
          listingDetails.addSupervsor,
          this.state.addSupervisors,
          "userId",
          "Name"
        );
        this.state.addsupervisorTitle = addsuperTitle;
        this.setState({ value_supervisors2: listingDetails.addSupervsor });
        this.setState({ remarks: listingDetails.remarks });
        let selectedWorkerIds = [],
          selectedSupIds = [],
          selectedBasSupId = [];
        let selectedWorkerNames = [],
          selectedSupervisorNames = [],
          selectedBaseSupervisorName = [];
        let dateSelected = moment(listingDetails.createdOn, "YYYY-MM-DD");
        let actualDate = dateSelected.format("YYYY/MM/DD");
        this.setState({ startDate1: dateSelected, startDate: actualDate });
        let selectedItemsWorkers = [],
          selectedItemsAddSup = [],
          selectedItemsBaseSup = [];
        let workerListArr = this.state.workers.map((val) => {
          let selected = false;
          this.state.partialWorkerIds = listingDetails.partialWorkers;
          if (
            listingDetails.workers &&
            listingDetails.workers.includes(val.workerIdActual.toString())
          ) {
            selected = true;
            selectedWorkerIds.push(val.workerId);
            selectedItemsWorkers.push(val);
            if (
              this.state.partialWorkerIds &&
              this.state.partialWorkerIds.includes(
                val.workerIdActual.toString()
              )
            ) {
              this.partialWorkers.push(val.workerId);
            }
          }
          return {
            ...val,
            selected,
          };
        });
        let supListArr = this.state.addSupervisors.map((val) => {
          let selected = false;
          this.state.partialSupIds = listingDetails.partialsupervisor;
          if (
            listingDetails.addSupervsor &&
            listingDetails.addSupervsor.includes(val.userId.toString())
          ) {
            selected = true;
            selectedSupIds.push(val.userId);
            selectedItemsAddSup.push(val);
            if (
              this.state.partialSupIds &&
              this.state.partialSupIds.includes(val.userId.toString())
            ) {
              this.partialAddSup.push(val.userId);
            }
          }
          return {
            ...val,
            selected,
          };
        });
        // console.log(this.state.baseSupervsor);

        let BaseSupListArr = this.state.baseSupervsor.map((val) => {
          let selected = false;
          this.state.partialBaseSupId = listingDetails.partialBaseSupervisors;
          if (
            listingDetails.baseSupervsor &&
            listingDetails.baseSupervsor === val.userId.toString()
          ) {
            selected = true;
            selectedBasSupId.push(val.userId);
            selectedItemsBaseSup.push(val);
            if (
              this.state.partialBaseSupId &&
              this.state.partialBaseSupId.includes(val.userId.toString())
            ) {
              this.partialBaseSupervisors.push(val.userId);
            }
          }
          return {
            ...val,
            selected,
          };
        });
        this.setState({
          workers: workerListArr,
          workerIds: selectedWorkerIds,
          workerName: selectedWorkerNames,
          selectedListWork: selectedItemsWorkers,
          partialWorkers: this.partialWorkers,

          supervisors: supListArr,
          supervisorIds: selectedSupIds,
          supervisorName: selectedSupervisorNames,
          selectedItemsAddSup: selectedItemsAddSup,
          partialSupervisors: this.partialAddSup,

          baseSupervisors: BaseSupListArr,
          baseSupervisorIds: selectedBasSupId,
          baseSupervisorName: selectedBaseSupervisorName,
          selectedItemsBaseSup: selectedItemsBaseSup,
          partialBaseSupervisors: this.partialBaseSupervisors,
        });

        // this.setState({value_supervisors:listingDetails.baseSupervsor , value_supervisors2:listingDetails.addSupervsor, projectId:listingDetails.projectId});
      }
      if (this.state.projectId) {
        const obj = {
          requestCode: 1,
          projectId: this.state.projectId,
          workArrangement: this.props.match.params.id,
        };

        dispatch(requestDetails(obj));
      }
    }
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearListing([]));
  }
  clearStore = () => {
    const { dispatch } = this.props;
    dispatch(clearListing([]));
  };
  getAvailableWorker = () => {
    const { dispatch } = this.props;
    this.state.requestCode = 99;
    this.state.workArrangementId = this.props.match.params.id;
    dispatch(requestDetails(this.state));
  };

  getSupervisor = (key, list, stateKey) => {
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
    dispatch(requestDetails(this.state));
    this.resetThenSet(key, list, stateKey);
  };
  // toggleSelected(list, stateKey, selectedIds){
  //   this.setState({
  //     [stateKey]: list
  //   });
  //   let nameArr = list.filter(function(obj) {
  //     return obj.selected;
  //   }).map(function(obj) { return obj.workerName; });

  //   this.setState({workerIds:selectedIds, workerName:nameArr});
  // }
  toggleSelected(list, stateKey, selectedIds, selectedList) {
    this.setState({
      [stateKey]: list,
    });

    let selectedItems = list.filter(function (obj) {
      return obj.selected;
    });
    if (stateKey == "AdditionalSupervisors") {
      let nameArr = selectedItems.map(function (obj) {
        return obj.Name;
      });

      this.setState({
        userIds: selectedIds,
        Name: nameArr,
        selectedItemsAddSup: selectedItems,
        selectedListSup: selectedList,
        value_supervisors2: selectedIds,
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
  resetThenSet(key, list, stateKey) {
    this.setState({
      [stateKey]: list,
    });

    let valuekey = `value_${stateKey}`;

    this.setState({
      [valuekey]: key.toString(),
    });
  }
  setRemarks = (e) => {
    let remarks = e.target.value;
    this.setState({ remarks });
  };
  validateForm = () => {
    // console.log("=== validate", this.state);
    if (!this.state.projectId || this.state.projectId == "") {
      toast.error("Project is required", { autoClose: 3000 });
      return false;
    }
    if (!this.state.value_supervisors || this.state.value_supervisors == "") {
      toast.error("Base supervisor is required", { autoClose: 3000 });
      return false;
    }
    // console.log(this.state.selectedItemsAddSup.length);
    /*if (
      !this.state.selectedItemsAddSup ||
      this.state.selectedItemsAddSup.length == 0
    ) {
      toast.error("Additional supervisor is required", { autoClose: 3000 });
      return false;
    }*/
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
      this.state.requestCode = 5;
      this.state.status = status;
      dispatch(requestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
      toast.success("Work Arrangement updated Successfully", {
        autoClose: 3000,
      });
      setTimeout(() => {
        this.props.history.push("/WorkArrangmentList");
      }, 3000);
    }
  };
  handleClose = () => {
    this.setState({ show: false });
    //this.setState({show:false, value_projects:"", value_supervisors:"", value_supervisors2:""});
  };
  setPreview = () => {
    if (this.validateForm() == true) {
      this.state.workArrangementId = this.state.listingId;
      this.state.workerName = this.state.selectedListWork.map(
        (_x) => _x.workerName
      );
      this.state.supervisor = this.state.supervisorTitle;
      this.state.supervisor2 = this.state.selectedItemsAddSup.map(
        (_x) => _x.Name
      );
      this.state.supervisor2 = this.state.supervisor2.join(", ");

      let detailArr = getPreviewContent(this.state, this.state);
      detailArr.supervisor = this.state.supervisor;
      detailArr.supervisor2 = this.state.supervisor2;

      let cont = <PreviewTemplate detailsArr={detailArr} />;
      this.setState({ show: true, modalTitle: "Preview", modalMsg: cont });
    }
  };
  goBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };
  onStartDateChange = (e) => {
    // console.log("===",e);
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
  };
  displayPartialWorkers = (workers) => {
    let self = this;
    // console.log("log", workers, this.state.partialWorkers);
    return workers.map((name) => {
      let flag = false;
      if (
        this.state.partialWorkers &&
        this.state.partialWorkers.includes(name.workerId.toString())
      ) {
        flag = true;
      }

      return (
        <div>
          {" "}
          <input
            value={name.workerId}
            type="checkbox"
            checked={flag}
            onClick={this.selectPartialWorkers}
          />
          &nbsp;{name.workerName}
        </div>
      );
    });
  };
  displayPartialAddSup = (AddSup) => {
    // let self = this;
    // console.log("log", AddSup, this.state.partialSupervisors);
    return AddSup.map((name) => {
      let flag = false;
      if (
        this.state.partialSupervisors &&
        this.state.partialSupervisors.includes(name.userId.toString())
      ) {
        flag = true;
      }
      return (
        <div>
          {" "}
          <input
            value={name.userId}
            type="checkbox"
            checked={flag}
            onClick={this.selectPartialAddSupervisors}
          />
          &nbsp;{name.Name}
        </div>
      );
    });
  };
  displayPartialBaseSup = (AddSup) => {
    // let self = this;
    // console.log("log", AddSup, this.state.partialSupervisors);
    return AddSup.map((name) => {
      let flag = false;
      if (
        this.state.partialBaseSupervisors &&
        this.state.partialBaseSupervisors.includes(name.userId.toString())
      ) {
        flag = true;
      }
      return (
        <div>
          {" "}
          <input
            value={name.userId}
            type="checkbox"
            checked={flag}
            onClick={this.selectPartialBaseSupervisors}
          />
          &nbsp;{name.Name}
        </div>
      );
    });
  };
  selectPartialBaseSupervisors = (e) => {
    e.stopPropagation();
    // console.log("==", e.target);
    const { selectedListSup, selectedItemsBaseSup } = this.state;
    if (e.target.checked == true) {
      this.partialBaseSupervisors.push(e.target.value);
      selectedItemsBaseSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = true;
        }
      });
    } else {
      var index = this.partialBaseSupervisors.indexOf(e.target.value);
      if (index !== -1) {
        this.partialBaseSupervisors.splice(index, 1);
      }
      selectedItemsBaseSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = false;
        }
      });
    }
    this.setState({
      partialBaseSupervisors: this.partialBaseSupervisors,
      value_Base_supervisors2: this.partialBaseSupervisors,
      partialBaseSupervisors: this.partialBaseSupervisors,
      selectedItemsBaseSup,
    });
  };
  selectPartialAddSupervisors = (e) => {
    e.stopPropagation();
    // console.log("==", e.target);
    const { selectedListSup, selectedItemsAddSup } = this.state;
    if (e.target.checked == true) {
      this.partialAddSup.push(e.target.value);
      selectedItemsAddSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = true;
        }
      });
    } else {
      var index = this.partialAddSup.indexOf(e.target.value);
      if (index !== -1) {
        this.partialAddSup.splice(index, 1);
      }
      selectedItemsAddSup.map((SupList) => {
        if (e.target.value == SupList.userId) {
          SupList.isPartial = false;
        }
      });
    }
    this.setState({
      partialAddSup: this.partialAddSup,
      value_supervisors2: this.partialAddSup,
      partialSupervisors: this.partialAddSup,
      selectedItemsAddSup,
    });
  };
  selectPartialWorkers = (e) => {
    e.stopPropagation();

    // console.log("==",e.target)
    if (e.target.checked == true) {
      this.partialWorkers.push(e.target.value);
    } else {
      var index = this.partialWorkers.indexOf(e.target.value);
      if (index !== -1) {
        this.partialWorkers.splice(index, 1);
      }
    }

    this.setState({ partialWorkers: this.partialWorkers });
  };
  /* Render */
  render() {
    const { headerTitle, listingId, selectedItemsBaseSup } = this.state;
    // console.log("this.state", this.state);

    const { loading } = this.props;
    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";

    return (
      <div className="container work-arr-container">
        <br />
        <ToastContainer autoClose={8000} />
        {loading == true && (
          <div className="center-div">
            <img src={loadingurl} />
          </div>
        )}

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
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
              disabled
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
              list={this.state.projects}
              value={this.state.value_projects}
              resetThenSet={this.getSupervisor}
              disabled={false}
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
            {this.state.selectedItemsAddSup && (
              <div>
                {this.displayPartialBaseSup(this.state.selectedItemsBaseSup)}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label>Additional Supervisor</label>
          </div>
          <div className="col-sm-6">
            {/* <Dropdown
                  title={this.state.addsupervisorTitle}
                  name="Name"
                  keyName="userId"
                  stateId="supervisors2"
                  list={this.state.supervisors}
                  resetThenSet={this.resetThenSet}
            /> */}
            <DropdownMultiple
              titleHelper="Additional Supervisor"
              title="Select Additional Supervisor"
              name="Name"
              keyName="userId"
              stateKey="AdditionalSupervisors"
              headerTitle={headerTitle}
              list={this.state.supervisors}
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
            <label>Workers</label>
          </div>
          <div className="col-sm-6">
            <DropdownMultiple
              titleHelper="Workers"
              title="Select Workers"
              name="workerName"
              keyName="workerId"
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
            {this.state.selectedListWork && (
              <div>
                {this.displayPartialWorkers(this.state.selectedListWork)}
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
              bsStyle="secondary"
              id="draft"
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

          {listingId && (
            <div className="col-sm-3">
              {" "}
              <CustomButton
                bsStyle="primary"
                id="submit"
                type="submit"
                onClick={() => this.submitRequest(3)}
              >
                Update
              </CustomButton>
            </div>
          )}
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
export default withRouter(WorkArrangementEdit);
