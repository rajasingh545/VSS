/* Module dependencies */
import React from "react";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import { connect } from "react-redux";
import baseHOC from "./baseHoc";
import CustInput from "../components/CustInput";
import TimeField from "../components/TimePicker";
import {
  getCurrentDate,
  getReasons,
  getDetailsWithMatchedKey2,
} from "../common/utility";
import {
  requestDetails,
  requestPost,
  requestPostClear,
  listigDetails,
} from "actions/workArrangement.actions";
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datepicker";
import moment from "moment";
import TimePicker from "rc-time-picker";

@connect((state) => ({
  listingDetails: state.request.get("listingDetails"),
  requestDet: state.request.get("requestDet"),
  requestPost: state.request.get("requestPost"),
}))
@baseHOC
class Attedence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "option1",
      projectTitle: "Select Project",
      showSubButton: false,
      team: [],
      startDate1: moment(),
      startDate: moment().format("YYYY/MM/DD"),
      projectId: "",
      projects: [],
    };
    this.selectedIds = [];
    this.timeValuesArr = [];
    this.errorIdArr = [];
    this.teamArr = [];
    this.WAId = "";
    this.resetThenSet = this.resetThenSet.bind(this); // this is required to bind the dispatch
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.reasonsList = getReasons();
    const now = new Date().getTime();
    this.time = moment(now);
  }
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(requestPostClear([]));
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
  }
  componentWillReceiveProps(nextProps) {
    const { dispatch } = this.props;
    // console.log("nextProps ", nextProps);
    if (
      nextProps.requestPost !== undefined &&
      Array.isArray(nextProps.requestPost)
    ) {
      if (nextProps.requestDet) {
        if (this.props.userType == 1) {
          this.state.projects = nextProps.requestDet.projects;
        }
        if (this.props.userType == 5 || this.props.userType == 3) {
          const projectId = this.props.project;
          const projectsArr = projectId.split(",");
          const porjectsMapArr = [];
          for (let i = 0; i < projectsArr.length; i++) {
            const element = projectsArr[i];
            nextProps.requestDet.projects.map((_p) => {
              if (element == _p.projectId) {
                porjectsMapArr.push(_p);
              }
            });
          }
          // projectsArr.map((pid) => {
          //   const projectName = getDetailsWithMatchedKey2(
          //     pid,
          //     nextProps.requestDet.projects,
          //     "projectId",
          //     "projectName"
          //   );
          //   porjectsMapArr.push({ projectId: pid, projectName });
          // });

          this.setState({ projects: porjectsMapArr });
          this.state.projects = porjectsMapArr;
        }

        this.state.workers = nextProps.requestDet.workers;
        this.state.availableSupervisorsList =
          nextProps.requestDet.supervisorsList;
        this.state.team = nextProps.requestDet.team;
      }
      if (
        nextProps.listingDetails &&
        nextProps.listingDetails !== undefined &&
        !Array.isArray(nextProps.listingDetails)
      ) {
        if (
          nextProps.listingDetails.workerlist !== undefined &&
          (Array.isArray(nextProps.listingDetails.workerlist) ||
            Array.isArray(nextProps.listingDetails.supervisorlist))
        ) {
          let list = nextProps.listingDetails.workerlist.concat(
            nextProps.listingDetails.supervisorlist
          );
          if (list.length > 0) {
            this.setState({
              workersList: nextProps.listingDetails.workerlist,
              supervisorsList: nextProps.listingDetails.supervisorlist,
            });
            if (nextProps.listingDetails.workerlist[0]) {
              this.state.remarks =
                nextProps.listingDetails.workerlist[0].remarks;
            }
          } else {
            toast.error(
              "Project not yet created please select another project",
              {
                autoClose: 3000,
              }
            );
            this.setState({
              workersList: [],
              supervisorsList: [],
              projectId: "",
            });
          }
        }
      } else if (
        nextProps.listingDetails !== undefined &&
        Array.isArray(nextProps.listingDetails)
      ) {
        toast.error("Project not yet created please select another project", {
          autoClose: 3000,
        });
        this.setState({
          workersList: [],
          supervisorsList: [],
          projectId: "",
        });
      }
    } else {
      dispatch(requestPostClear([]));
    }
  }
  getWorkers = (key, list = [], stateKey = {}) => {
    const { dispatch } = this.props;
    if (key) {
      this.state.requestCode = 6;
      this.state.projectId = key;
      this.selectedIds = [];
      const projectName = getDetailsWithMatchedKey2(
        key,
        this.props.requestDet.projects,
        "projectId",
        "projectName"
      );
      this.state.projectTitle = projectName;
      dispatch(listigDetails(this.state));
    }
    //  this.resetThenSet(key, stateKey);
  };

  resetThenSet(id, key) {
    const temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach((item) => (item.selected = false));
    temp[id].selected = true;
    this.setState({
      [key]: temp,
    });
  }
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value,
    });
  }
  onSubmit = (type) => {
    const { dispatch } = this.props;
    const finalValuesArr = [];
    if (this.selectedIds.length == 0) {
      toast.error("Please select worker to submit", { autoClose: 3000 });
      return false;
    }
    const error = 0;
    this.selectedIds.map((id) => {
      if (this.timeValuesArr[`in_${id}`]) {
        finalValuesArr[id] = {
          IN: this.timeValuesArr[`in_${id}`],
        };
      }
      if (this.timeValuesArr[`out_${id}`]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          OUT: this.timeValuesArr[`out_${id}`],
        };
      }
      if (this.timeValuesArr[`reason_${id}`]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          reason: this.timeValuesArr[`reason_${id}`],
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
    const param = {
      ...this.state,
      requestCode: 7,
      finalValuesArr,
      WAId: this.WAId,
      type,
    };

    this.setState({
      workersList: [],
      supervisorsList: [],
      projectTitle: "Select Project",
      showSubButton: false,
    });
    // console.log(this.timeValuesArr, finalValuesArr);

    dispatch(requestPost(param));
    if (type == 1) {
      toast.success("Attendance Submitted Successfully", { autoClose: 3000 });
    } else {
      toast.success("Attendance Saved Successfully", { autoClose: 3000 });
    }
    setTimeout(() => {
      this.props.history.push("/AttendanceList");
    }, 3000);
  };
  onCheckBoxClick = (e) => {
    e.stopPropagation();
    const id = e.target.value;
    const checked = e.target.checked;

    if (checked === true) {
      this.selectedIds.push(id);
    } else {
      const index = this.selectedIds.indexOf(id);
      this.selectedIds.splice(index, 1);
    }
    if (this.selectedIds.length > 0) {
      this.setState({ showSubButton: true });
    } else {
      this.setState({ showSubButton: false });
    }
  };
  setReason = (key, list, stateKey) => {
    const index = this.errorIdArr.indexOf(stateKey.split("_")[1]);
    const inTime = stateKey.split("_");

    const key1 = `in_${inTime[1]}`;
    const selectKey = `select_${inTime[1]}`;

    if (!this.timeValuesArr[key1] && (key == 5 || key == 99)) {
      toast.error("In time can't be empty", { autoClose: 3000 });
      this.state[selectKey] = "Select..";
      this.setState({ [selectKey]: "Select.." });
      // return false;
    } else {
      this.timeValuesArr[stateKey] = key;
    }
    if (index > -1) {
      this.errorIdArr.splice(index, 1);
    }
  };
  onTimeChange = (value, name, id, workerName) => {
    // console.log(value);

    this.timeValuesArr[name] = value.format("HH:mm:ss");
    let check = name.split("_"),
      { projects, projectId } = this.state,
      { requestDet, listingDetails } = this.props,
      workerIn = "00:00:00",
      workerOut = "00:00:00";
    const selectedProject = projects.find(
      (element) => element.projectId === projectId
    );
    let wl = [...requestDet.availableWorkers];
    if (check[0] == "in") {
      wl.map((superList) => {
        if (
          superList.workerIdActual === id &&
          superList.workerName === workerName
        ) {
          superList.inTime = this.timeValuesArr[name].replace(/:/g, ".");
          superList.outTime = "00.00";
        }
      });
      workerIn = this.timeValuesArr[name] + ":00";
    } else {
      wl.map((superList) => {
        if (
          superList.workerIdActual === id &&
          superList.workerName === workerName
        ) {
          superList.outTime = this.timeValuesArr[name].replace(/:/g, ".");
        }
      });
      workerOut = this.timeValuesArr[name] + ":00";
    }
    // console.log(wl);
    const startTime = selectedProject.startTime
        .split(":")
        .slice(0, 2)
        .join("."),
      endTime = selectedProject.endTime.split(":").slice(0, 2).join(".");
    this.setState({ projectStartTime: startTime, projectEndTime: endTime });
    let text = " ";

    wl.map((e) => {
      if (e.inTime !== undefined || e.outTime !== undefined) {
        console.log(endTime, e.outTime);
        let lt = Math.abs(Number(e.inTime - startTime)).toFixed(2),
          ot = "";
        lt = String(Math.floor(Math.floor(lt) + lt.split(".")[1] / 60)).concat(
          ".",
          lt.split(".")[1] % 60
        );
        if (e.outTime == "00.00") {
          ot = "00.00";
        } else {
          ot = Math.abs(Number(endTime - e.outTime)).toFixed(2);
          ot = String(
            Math.floor(Math.floor(ot) + ot.split(".")[1] / 60)
          ).concat(".", ot.split(".")[1] % 60);
        }
        text +=
          e.workerName +
          " in time " +
          e.inTime +
          " LT " +
          lt +
          " OT " +
          ot +
          ", ";
      }
    });
    this.timeFunc(startTime, endTime, workerIn, workerOut, id);

    // this.setState({ remarks: text });
    // let { workersList, supervisorsList } = this.state;
    // let AttedenceList = workersList.concat(supervisorsList);
  };

  validateOutTime = (value, name) => {
    const fnme = name.split("_");

    if (
      this.timeValuesArr[`out_${fnme[1]}`] &&
      this.timeValuesArr[`out_${fnme[1]}`] < this.timeValuesArr[`in_${fnme[1]}`]
    ) {
      toast.error("Out time can't be less than in time", { autoClose: 3000 });
      return false;
    }
  };

  timeFunc = (startTime, endTime, workerIn, workerOut, wId) => {
    // console.log(startTime, endTime, workerIn, workerOut, wId);

    const sTime = startTime,
      eTime = endTime,
      wIn = workerIn.split(":").slice(0, 2).join("."),
      wOut = workerOut.split(":").slice(0, 2).join(".");
    // console.log(sTime, eTime, wIn, wOut);

    // console.log(this.timeValuesArr, this.timeValuesArr["reason_" + wId], wId);

    if (
      Number(sTime) < Number(wIn) &&
      Number(wIn) !== 0 &&
      this.timeValuesArr["reason_" + wId] == undefined
    ) {
      if (this.errorIdArr.indexOf(wId) == "-1") {
        this.errorIdArr.push(wId);
      }
    } else if (
      Number(sTime) > Number(wIn) &&
      Number(wIn) !== 0 &&
      this.timeValuesArr["reason_" + wId] == undefined
    ) {
      if (this.errorIdArr.indexOf(wId) == "-1") {
        this.errorIdArr.push(wId);
      }
    } else if (Number(sTime) == Number(wIn)) {
      const index = this.errorIdArr.indexOf(wId);
      if (index > -1) {
        this.errorIdArr.splice(index, 1);
      }
    } else if (
      Number(eTime) > Number(wOut) &&
      Number(wOut) !== 0 &&
      Number(wOut) !== Number("00.00") &&
      this.timeValuesArr["reason_" + wId] == undefined
    ) {
      if (this.errorIdArr.indexOf(wId) == "-1") {
        this.errorIdArr.push(wId);
      }
    } else if (Number(eTime) == Number(wOut)) {
      const index = this.errorIdArr.indexOf(wId);
      if (index > -1) {
        this.errorIdArr.splice(index, 1);
      }
    }
    // console.log(this.errorIdArr);
  };

  renderWorkers = (workers, type, startTime, endTime) => {
    if (workers.length > 0) {
      this.teamArr = [];

      // this.selectedIds = [];
      return workers.map((worker, ind) => {
        // console.log(
        //   "this.state.selectedOption",
        //   this.state.selectedOption,
        //   worker.status,
        //   worker.statusOut
        // );

        let rec = 0;
        if (
          (this.state.selectedOption == 1 &&
            (worker.status == 1 || worker.status != 1)) ||
          (this.state.selectedOption == 2 &&
            (worker.statusOut == 1 || worker.statusOut != 1))
        ) {
          let workerName = "";
          if (type === "Supervisors") {
            workerName = getDetailsWithMatchedKey2(
              worker.workerId,
              this.state.availableSupervisorsList,
              "userId",
              "Name"
            );
          } else if (type === "Workers") {
            workerName = getDetailsWithMatchedKey2(
              worker.workerId,
              this.state.workers,
              "workerIdActual",
              "workerName"
            );
          }
          // console.log("startTime, endTime", startTime, endTime);

          // this.timeFunc(
          //   startTime.split(":").slice(0, 2).join("."),
          //   endTime.split(":").slice(0, 2).join("."),
          //   worker.inTime,
          //   worker.outTime,
          //   worker.workerId
          // );
          const InName = `in_${worker.workerId}`;
          const OutName = `out_${worker.workerId}`;
          const reasonId = `reason_${worker.workerId}`;
          this.WAId = worker.workArrangementId;
          const workerTeam = worker.workerTeam;

          this.state[`select_${worker.workerId}`] = "Select..";

          if (this.teamArr[workerTeam]) {
            this.teamArr[workerTeam] = parseInt(this.teamArr[workerTeam]) + 1;
          } else {
            this.teamArr[workerTeam] = 1;
          }

          let invalue = "";
          let outvalue = "";
          // console.log(this.state.selectedOption);

          if (worker.inTime != "00:00:00" && this.state.selectedOption == "1") {
            invalue = moment(
              `${moment().format("DD-MM-YYYY")} ${worker.inTime}`
            );
          } else if (
            worker.inTime == "00:00:00" &&
            this.state.selectedOption == "1"
          ) {
            invalue = moment(`${moment().format("DD-MM-YYYY")} ${startTime}`);
          } else {
            invalue = moment(`${moment().format("DD-MM-YYYY")} ${startTime}`);
          }
          if (
            worker.outTime != "00:00:00" &&
            this.state.selectedOption == "2"
          ) {
            outvalue = moment(
              `${moment().format("DD-MM-YYYY")} ${worker.outTime}`
            );
          } else if (
            worker.outTime == "00:00:00" &&
            this.state.selectedOption == "2"
          ) {
            outvalue = moment(`${moment().format("DD-MM-YYYY")} ${endTime}`);
          } else {
            outvalue = moment(`${moment().format("DD-MM-YYYY")} ${endTime}`);
          }
          rec++;
          const disable = worker.assignedWorker == 1 ? true : false;
          return (
            <div className="row" key={ind}>
              <div className="col-xs-1" style={{ width: "10px" }}>
                <span>
                  <input
                    value={worker.workerId}
                    type="checkbox"
                    onClick={this.onCheckBoxClick}
                    disabled={disable}
                  />
                </span>
              </div>
              <div className="col-xs-3 ellipsis">
                <span>{workerName}</span>
              </div>
              {this.state.selectedOption == 1 && (
                <div className="col-xs-2" style={{ textAlign: "center" }}>
                  <TimePicker
                    defaultValue={invalue}
                    // value={startTime}
                    format="hh:mm a"
                    showSecond={false}
                    onChange={(value, id = InName) =>
                      this.onTimeChange(value, id, worker.workerId, workerName)
                    }
                    use12Hours
                    name={InName}
                    id={InName}
                    className="width100"
                    disabled={disable}
                  />
                </div>
              )}
              {this.state.selectedOption == 2 && (
                <div className="col-xs-2" style={{ textAlign: "center" }}>
                  <TimePicker
                    defaultValue={outvalue}
                    // value={endTime}
                    format="hh:mm a"
                    showSecond={false}
                    onChange={(value, id = OutName) =>
                      this.onTimeChange(value, id, worker.workerId, workerName)
                    }
                    onClose={(value, id = OutName) =>
                      this.validateOutTime(value, id)
                    }
                    use12Hours
                    name={OutName}
                    id={OutName}
                    className="width100"
                    disabled={disable}
                  />
                </div>
              )}
              <div className="col-xs-6" style={{ textAlign: "center" }}>
                <Dropdown
                  title={this.state[`select_${worker.workerId}`]}
                  name="reason"
                  keyName="id"
                  stateId={reasonId}
                  list={this.reasonsList}
                  value={worker.reason}
                  resetThenSet={this.setReason}
                  error={
                    this.errorIdArr.indexOf(worker.workerId) > -1 ? true : false
                  }
                  disabled={disable}
                />
              </div>
            </div>
          );
        }
      });
    }

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
  };

  teamDisplay = () => {
    const stateArr = this.state;
    return this.teamArr.map((teamCount, teamId) => {
      const teamName = getDetailsWithMatchedKey2(
        teamId,
        stateArr.team,
        "teamid",
        "teamName"
      );
      return (
        <div>
          <div className="col-xs-3">
            <span>
              <strong>Total Pax {teamName}</strong>:
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
    this.state.startDate = e.format("YYYY/MM/DD"); // dont remove - to get immedaite value of date
    this.getWorkers(this.state.projectId);
  };
  setRemarks = (e) => {
    // this.state.remarks = e.target.value;
    this.setState({ remarks: e.target.value });
  };
  /* Render */
  render() {
    const { headerTitle, workersList, supervisorsList } = this.state;
    const cDate = getCurrentDate();
    // let cTime = getCurrentTime();
    let readonly = false,
      { projects, projectId } = this.state,
      selectedProject = {},
      startTime = "",
      endTime = "";
    if (projectId !== "" && projects.length > 0) {
      selectedProject = projects.find(
        (element) => element.projectId === projectId
      );
      startTime = selectedProject.startTime;
      endTime = selectedProject.endTime;
    }
    // console.log(startTime, endTime, projectId, projects);

    if (this.props.userType == 5 || this.props.userType == 3) {
      readonly = true;
    }
    // console.log(this.timeValuesArr);

    return (
      <div className="work-arr-container">
        <br />
        <ToastContainer autoClose={8000} />
        <div className="row">
          {startTime !== "" && endTime !== "" && (
            <div className="col-sm-12" style={{ textAlign: "right" }}>
              <label>
                Start Time: {startTime} / End Time: {endTime}
              </label>
            </div>
          )}
          <div className="col-sm-3">
            <label>Date</label>
          </div>

          <div className="col-sm-3">
            {" "}
            <DatePicker
              selected={this.state.startDate1}
              className=" form-control"
              isClearable={false}
              minDate={new Date()}
              maxDate={new Date()}
              onChange={this.onStartDateChange}
              name="startDate"
              dateFormat="DD-MM-YYYY"
              locale="UTC"
              readOnly={readonly}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <label>Site</label>
          </div>
          <div className="col-sm-6">
            <Dropdown
              title={this.state.projectTitle}
              name="projectName"
              keyName="projectId"
              stateId="projects"
              list={this.state.projects}
              value={this.state.value_projects}
              resetThenSet={this.getWorkers}
            />
          </div>
        </div>
        {/* map mutiple workers 8 */}
        <div className="companyWorksList">
          <div className="row">
            <div className="col-xs-1" style={{ width: "10px" }}>
              <span>&nbsp;</span>
            </div>
            <div className="col-xs-3 ">
              <span>&nbsp;</span>
            </div>

            <div className="col-xs-2">
              <span>
                <input
                  type="radio"
                  value="1"
                  checked={this.state.selectedOption === "1"}
                  onChange={this.handleOptionChange}
                />
                &nbsp;IN
              </span>
            </div>
            <div className="col-xs-2">
              <span>
                <input
                  type="radio"
                  value="2"
                  checked={this.state.selectedOption === "2"}
                  onChange={this.handleOptionChange}
                />
                &nbsp;OUT
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-1" style={{ width: "10px" }}>
              <span>&nbsp;</span>
            </div>
            <div className="col-xs-3 ">
              <span>
                <strong>Supervisors</strong>
              </span>
            </div>
            {this.state.selectedOption == 1 && (
              <div className="col-xs-2">
                <span>&nbsp;IN</span>
              </div>
            )}
            {this.state.selectedOption == 2 && (
              <div className="col-xs-2">
                <span>&nbsp;OUT</span>
              </div>
            )}
            <div className="col-xs-6">
              <span>
                {/* <input type="radio" value="option2"
                        checked={this.state.selectedOption === 'option2'}
                        onChange={this.handleOptionChange} /> */}
                &nbsp;Reason
              </span>
            </div>
          </div>
          {supervisorsList &&
            this.renderWorkers(
              supervisorsList,
              "Supervisors",
              startTime,
              endTime
            )}
          {supervisorsList && supervisorsList.length > 0 && this.teamDisplay()}
          <br />
          <div className="row">
            <div className="col-xs-1" style={{ width: "10px" }}>
              <span>&nbsp;</span>
            </div>
            <div className="col-xs-3 ">
              <span>
                <strong>Workers</strong>
              </span>
            </div>
            {this.state.selectedOption == 1 && (
              <div className="col-xs-2">
                <span>&nbsp;IN</span>
              </div>
            )}
            {this.state.selectedOption == 2 && (
              <div className="col-xs-2">
                <span>&nbsp;OUT</span>
              </div>
            )}
            <div className="col-xs-6">
              <span>
                {/* <input type="radio" value="option2"
                        checked={this.state.selectedOption === 'option2'}
                        onChange={this.handleOptionChange} /> */}
                &nbsp;Reason
              </span>
            </div>
          </div>

          {workersList &&
            this.renderWorkers(workersList, "Workers", startTime, endTime)}
          {workersList && workersList.length > 0 && this.teamDisplay()}
          <br />
        </div>
        <div className="row">
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
        </div>
        {/* map mutiple site name with count of workers
    <div className="row">
        <div className="col-xs-6"><label>Site Name1</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" className="width100" onChange={this.onTimeChange}/>
        </div>

    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name2</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" onChange={this.onTimeChange}/>
        </div>
    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name3</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" onChange={this.onTimeChange}/>
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
                Submit
              </CustomButton>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Attedence;
