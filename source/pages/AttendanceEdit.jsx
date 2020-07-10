/* Module dependencies */
import React from "react";
import { withRouter } from "react-router-dom";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import { connect } from "react-redux";
import baseHOC from "./baseHoc";
import CustInput from "../components/CustInput";
import TimeField from "../components/TimePicker";
import {
  getCurrentDate,
  getReasons,
  getDetailsWithMatchedKey2
} from "../common/utility";
import {
  requestDetails,
  requestPost,
  listigDetails
} from "actions/workArrangement.actions";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import moment from "moment";

@connect(state => ({
  listingDetails: state.request.get("listingDetails"),
  requestDet: state.request.get("requestDet")
}))
@baseHOC
class AttedenceEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "option1",
      projectTitle: "",
      projectName: "",
      startTime: "",
      endTime: "",
      showSubButton: false,
      team: [],
      startDate1: moment(),
      workersList: [],
      supervisorsList: [],
      projectId: "",
      projects: []
    };
    this.selectedIds = [];
    this.timeValuesArr = [];
    this.teamArr = [];
    this.errorIdArr = [];
    this.WAId = "";
    this.resetThenSet = this.resetThenSet.bind(this); //this is required to bind the dispatch
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.reasonsList = getReasons();
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    // dispatch(requestDetails(this.state));
    //get details of listing
    if (
      this.props.match.params &&
      this.props.match.params.id &&
      this.props.match.params.pid
    ) {
      this.state.listingId = this.props.match.params.id;
      this.state.requestType = 1;
      //    this.state.projectTitle = getDetailsWithMatchedKey2(this.props.match.params.pid, this.props.requestDet.projects, "projectId", "projectName");
      this.getWorkers(this.props.match.params.pid);
    } else {
      this.state.requestType = 0;
    }
  }
  componentWillReceiveProps(nextProps) {
    let projectId = "";
    if (nextProps.requestDet) {
      if (this.props.userType == 1) {
        this.state.projects = nextProps.requestDet.projects;
      }
      if (this.props.userType == 5) {
        projectId = this.props.project;
        let projectName = getDetailsWithMatchedKey2(
          projectId,
          nextProps.requestDet.projects,
          "projectId",
          "projectName"
        );
        this.setState({ projects: [{ projectId, projectName }] });
        this.state.projects = [{ projectId, projectName }];
      }
      this.state.workers = nextProps.requestDet.workers;
      this.state.team = nextProps.requestDet.team;
    }
    if (typeof nextProps.listingDetails === "object") {
      if (
        nextProps.listingDetails.workerlist &&
        Array.isArray(nextProps.listingDetails.workerlist)
      ) {
        this.setState({
          workersList: nextProps.listingDetails.workerlist,
          supervisorsList: nextProps.listingDetails.supervisorlist
        });
        if (nextProps.listingDetails[0]) {
          this.state.remarks = nextProps.listingDetails.workerlist[0].remarks;
        }
      }
    }
  }
  getWorkers = (key, list, stateKey) => {
    const { dispatch } = this.props;
    dispatch(requestDetails(this.state));
    this.state.requestCode = 6;
    this.state.projectId = key;
    this.selectedIds = [];
    dispatch(listigDetails(this.state));
    //  this.resetThenSet(key, stateKey);
  };

  resetThenSet(id, key) {
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => (item.selected = false));
    temp[id].selected = true;
    this.setState({
      [key]: temp
    });
  }
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  onSubmit = type => {
    const { dispatch } = this.props;
    let finalValuesArr = [];
    if (this.selectedIds.length == 0) {
      toast.error("Please select worker to submit", { autoClose: 3000 });
      return false;
    }
    let error = 0;
    this.selectedIds.map(id => {
      if (this.timeValuesArr["in_" + id]) {
        finalValuesArr[id] = {
          IN: this.timeValuesArr["in_" + id]
        };
      }
      if (this.timeValuesArr["out_" + id]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          OUT: this.timeValuesArr["out_" + id]
        };
      }
      if (this.timeValuesArr["reason_" + id]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          reason: this.timeValuesArr["reason_" + id]
        };
      }
    });
    if (finalValuesArr.length == 0) {
      toast.error("Please make any one change to submit", { autoClose: 3000 });
      return false;
    }
    if (this.errorIdArr.length > 0) {
      toast.error("Please select the reason to submit", { autoClose: 3000 });
      return false;
    }
    let param = {
      ...this.state,
      requestCode: 7,
      finalValuesArr,
      WAId: this.WAId,
      type
    };

    dispatch(requestPost(param));
    toast.success("Attendance Submitted Successfully", { autoClose: 3000 });
  };
  onCheckBoxClick = e => {
    e.stopPropagation();
    let id = e.target.value;
    let checked = e.target.checked;

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
  setReason = (key, list, stateKey) => {
    this.timeValuesArr[stateKey] = key;
    const index = this.errorIdArr.indexOf(stateKey.split("_")[1]);
    if (index > -1) {
      this.errorIdArr.splice(index, 1);
    }
  };
  onTimeChange = el => {
    this.timeValuesArr[el.name] = el.value;
    let { projects, projectId } = this.state,
      { requestDet, listingDetails } = this.props,
      startTime = "",
      endTime = "",
      wId = el.name.split("_")[1],
      workerIn = "00:00:00",
      workerOut = "00:00:00";
    const selectedProject = projects.find(
      element => element.projectId === projectId
    );
    startTime = selectedProject.startTime;
    endTime = selectedProject.endTime;
    if (el.name.split("_")[0] == "in") {
      workerIn = el.value;
    } else {
      workerOut = el.value;
    }
    // console.log(startTime, endTime, workerIn, workerOut, wId);
    this.timeFunc(startTime, endTime, workerIn, workerOut, wId);
    this.setState({ projectStartTime: startTime, projectEndTime: endTime });
  };
  timeFunc = (startTime, endTime, workerIn, workerOut, wId) => {
    const sTime = startTime
        .split(":")
        .slice(0, 2)
        .join("."),
      eTime = endTime
        .split(":")
        .slice(0, 2)
        .join("."),
      wIn = workerIn
        .split(":")
        .slice(0, 2)
        .join("."),
      wOut = workerOut
        .split(":")
        .slice(0, 2)
        .join(".");
    // console.log(this.timeValuesArr, this.timeValuesArr["reason_" + wId], wId);

    if (
      Number(sTime) < Number(wIn) &&
      this.timeValuesArr["reason_" + wId] == undefined
    ) {
      if (this.errorIdArr.indexOf(wId) == "-1") {
        this.errorIdArr.push(wId);
      }
    } else if (
      Number(eTime) > Number(wOut) &&
      Number(wOut) !== Number("00.00") &&
      this.timeValuesArr["reason_" + wId] == undefined
    ) {
      if (this.errorIdArr.indexOf(wId) == "-1") {
        this.errorIdArr.push(wId);
      }
    }
    // console.log(this.errorIdArr);
  };
  renderWorkers = (workers, startTime, endTime) => {
    if (workers.length > 0) {
      this.teamArr = [];
      return workers.map((worker, ind) => {
        let workerName = getDetailsWithMatchedKey2(
          worker.workerId,
          this.state.workers,
          "workerIdActual",
          "workerName"
        );
        let InName = "in_" + worker.workerId;
        let OutName = "out_" + worker.workerId;
        let reasonId = "reason_" + worker.workerId;
        this.WAId = worker.workArrangementId;
        let workerTeam = worker.workerTeam;

        let title = "Select..";
        if (worker.reason != 0) {
          title = getDetailsWithMatchedKey2(
            worker.reason,
            this.reasonsList,
            "id",
            "reason"
          );
          this.timeValuesArr[reasonId] = Number(worker.reason);
        }

        if (this.teamArr[workerTeam]) {
          this.teamArr[workerTeam] = parseInt(this.teamArr[workerTeam]) + 1;
        } else {
          this.teamArr[workerTeam] = 1;
        }
        this.timeFunc(
          startTime,
          endTime,
          worker.inTime,
          worker.outTime,
          worker.workerId
        );
        // console.log(
        //   this.errorIdArr,
        //   worker.workerId,
        //   this.errorIdArr.indexOf(worker.workerId) > -1
        // );

        return (
          <div className="row" key={ind}>
            <div className="col-xs-1" style={{ width: "10px" }}>
              <span>
                <input
                  value={worker.workerId}
                  type="checkbox"
                  onClick={this.onCheckBoxClick}
                />
              </span>
            </div>
            <div className="col-xs-3 ellipsis">
              <span>{workerName}</span>
            </div>

            <div className="col-xs-2" style={{ textAlign: "center" }}>
              <TimeField
                value={worker.inTime}
                name={InName}
                className="width100"
                onChange={this.onTimeChange}
              />
            </div>
            <div className="col-xs-2" style={{ textAlign: "center" }}>
              <TimeField
                value={worker.outTime}
                name={OutName}
                className="width100"
                onChange={this.onTimeChange}
              />
            </div>
            <div className="col-xs-3" style={{ textAlign: "center" }}>
              <Dropdown
                title={title}
                name="reason"
                keyName="id"
                stateId={reasonId}
                list={this.reasonsList}
                value={worker.reason}
                resetThenSet={this.setReason}
                error={
                  this.errorIdArr.indexOf(worker.workerId) > -1 ? true : false
                }
              />
            </div>
          </div>
        );
      });
    } else {
      return (
        <div className="row">
          <div className="col-xs-1">
            <span>&nbsp;</span>
          </div>
          <div lassName="col-xs-6" style={{ color: "red" }}>
            {" "}
            No Records Found
          </div>
        </div>
      );
    }
  };
  teamDisplay = () => {
    let stateArr = this.state;
    return this.teamArr.map((teamCount, teamId) => {
      let teamName = getDetailsWithMatchedKey2(
        teamId,
        stateArr.team,
        "teamid",
        "teamName"
      );
      return (
        <div>
          <div className="col-xs-3">
            <span>
              <strong>{teamName}</strong>:
            </span>
          </div>
          <div className="col-xs-3">
            <span> {teamCount}</span>
          </div>
          <br />
        </div>
      );
    });
  };
  onStartDateChange = e => {
    if (e != null) {
      this.setState({
        startDate: e.format("YYYY/MM/DD"),
        startDate1: e
      });
    } else {
      this.setState({
        startDate: "",
        startDate1: ""
      });
    }
    this.state.startDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date
  };
  setRemarks = e => {
    this.setState({ remarks: e.target.value });
  };
  getTime = (projects, name, pid) => {
    projects.map(element => {
      if (element.projectId === pid) {
        return element[name];
      }
    });
  };
  /* Render */
  render() {
    // eslint-disable-next-line no-unused-vars
    const { workersList, supervisorsList, projectId, projects } = this.state;
    // let { supervisorlist, workerlist } = this.props.listingDetails;
    // let { projects } = this.props.requestDet;
    // let cDate = getCurrentDate();
    // let cTime = getCurrentTime();
    // eslint-disable-next-line one-var
    // let readonly = false;
    let startTime = "",
      endTime = "",
      projectTitle = "";
    if (this.props.match.params.pid && projectId && projects.length > 0) {
      projects.map(element => {
        if (element.projectId === projectId) {
          startTime = element.startTime;
          endTime = element.endTime;
          projectTitle = element.projectName;
        }
      });
      // selectedProject = projects.find(element => element.projectId === projectId);
    }
    // if (this.props.userType == 5) {
    //   readonly = true;
    // }
    console.log(this.state);
    // eslint-disable-next-line no-unreachable
    return (
      <div className="work-arr-container">
        <br />
        <ToastContainer autoClose={8000} />
        <div className="row">
          <div className="col-sm-12" style={{ textAlign: "right" }}>
            <label>
              Start Time: {startTime} / End Time: {endTime}
            </label>
          </div>
          <div className="col-sm-3">
            <label>Site</label>
          </div>
          <div className="col-sm-6">
            <strong>{projectTitle}</strong>
          </div>
        </div>
        {/* map mutiple workers 8*/}
        <div className="companyWorksList">
          {supervisorsList.length > 0 ? (
            <div>
              <div className="row">
                <div className="col-xs-1" style={{ width: "10px" }}>
                  <span>&nbsp;</span>
                </div>
                <div className="col-xs-3 ">
                  <span>
                    <strong>Supervisors</strong>
                  </span>
                </div>

                <div className="col-xs-2">
                  <span>&nbsp;IN</span>
                </div>
                <div className="col-xs-2">
                  <span>&nbsp;OUT</span>
                </div>
                <div className="col-xs-3">
                  <span>&nbsp;Reason</span>
                </div>
              </div>

              {this.renderWorkers(supervisorsList, startTime, endTime)}
              {/* {this.teamDisplay()} */}
            </div>
          ) : (
            ""
          )}

          {workersList.length > 0 ? (
            <div>
              <br></br>
              <div className="row">
                <div className="col-xs-1" style={{ width: "10px" }}>
                  <span>&nbsp;</span>
                </div>
                <div className="col-xs-3 ">
                  <span>
                    <strong>Workers</strong>
                  </span>
                </div>

                <div className="col-xs-2">
                  <span>&nbsp;IN</span>
                </div>
                <div className="col-xs-2">
                  <span>&nbsp;OUT</span>
                </div>
                <div className="col-xs-3">
                  <span>&nbsp;Reason</span>
                </div>
              </div>

              {this.renderWorkers(workersList, startTime, endTime)}
              {this.teamDisplay()}
            </div>
          ) : (
            ""
          )}

          <br />
        </div>
        {/* <div className="row">
          <div className="col-sm-3">
            <label>Remark</label>
          </div>
          <div className="col-sm-6">
            <CustInput
              type="textarea"
              onChange={this.setRemarks}
              name="remarks"
              value={this.state.remarks}
            />
          </div>
        </div> */}
        <br />
        {this.state.showSubButton === true && (
          <div className="row">
            <div className="col-sm-3">
              <CustomButton
                bsStyle="secondary"
                className="width50"
                onClick={() => this.onSubmit(2)}
                id="draft"
                type="submit"
              >
                Draft
              </CustomButton>
            </div>
            <div className="col-sm-3">
              <CustomButton
                bsStyle="primary"
                id="submit"
                onClick={() => this.onSubmit(1)}
                className="width50"
                type="submit"
              >
                Update
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(AttedenceEdit);
