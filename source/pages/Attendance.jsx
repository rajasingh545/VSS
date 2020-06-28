/* Module dependencies */
import React from 'react';
import Dropdown from '../components/Dropdown';
import CustomButton from '../components/CustomButton';
import { connect } from 'react-redux';
import baseHOC from './baseHoc';
import CustInput from '../components/CustInput';
import TimeField from '../components/TimePicker';
import { getCurrentDate, getReasons, getDetailsWithMatchedKey2 } from '../common/utility';
import { requestDetails, requestPost, listigDetails } from 'actions/workArrangement.actions';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import TimePicker from 'rc-time-picker';

@connect(state => ({
  listingDetails: state.request.get('listingDetails'),
  requestDet: state.request.get('requestDet'),
}))
@baseHOC
class Attedence extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: 'option1',
      projectTitle: 'Select Project',
      showSubButton: false,
      team: [],
      startDate1: moment(),
      startDate: moment().format('YYYY/MM/DD'),
    };
    this.selectedIds = [];
    this.timeValuesArr = [];
    this.teamArr = [];
    this.WAId = '';
    this.resetThenSet = this.resetThenSet.bind(this); // this is required to bind the dispatch
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.reasonsList = getReasons();
    const now = new Date().getTime();
    this.time = moment(now);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.requestDet) {
      if (this.props.userType == 1) {
        this.state.projects = nextProps.requestDet.projects;
      }
      if (this.props.userType == 5) {
        const projectId = this.props.project;
        const projectsArr = projectId.split(',');
        const porjectsMapArr = [];
        projectsArr.map((pid) => {
          const projectName = getDetailsWithMatchedKey2(pid, nextProps.requestDet.projects, 'projectId', 'projectName');
          porjectsMapArr.push({ projectId: pid, projectName });
        });

        this.setState({ projects: porjectsMapArr });
        this.state.projects = porjectsMapArr;
      }

      this.state.workers = nextProps.requestDet.workers;
      this.state.team = nextProps.requestDet.team;
    }

    if (nextProps.listingDetails) {
      this.setState({ workersList: nextProps.listingDetails });
      if (nextProps.listingDetails[0]) {
        this.state.remarks = nextProps.listingDetails[0].remarks;
      }
    }
  }
  getWorkers = (key, list, stateKey) => {
    const { dispatch } = this.props;
    if (key) {
      this.state.requestCode = 6;
      this.state.projectId = key;
      this.selectedIds = [];
      const projectName = getDetailsWithMatchedKey2(key, this.props.requestDet.projects, 'projectId', 'projectName');
      this.state.projectTitle = projectName;
      dispatch(listigDetails(this.state));
    }
    //  this.resetThenSet(key, stateKey);
  }

  resetThenSet(id, key) {
    const temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => item.selected = false);
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
      toast.error('Please select worker to submit', { autoClose: 3000 });
      return false;
    }
    const error = 0;
    this.selectedIds.map((id) => {
      if (this.timeValuesArr[`in_${ id }`]) {
        finalValuesArr[id] = {

          'IN': this.timeValuesArr[`in_${ id }`],
        };
      }
      if (this.timeValuesArr[`out_${ id }`]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          'OUT': this.timeValuesArr[`out_${ id }`],
        };
      }
      if (this.timeValuesArr[`reason_${ id }`]) {
        finalValuesArr[id] = {
          ...finalValuesArr[id],
          'reason': this.timeValuesArr[`reason_${ id }`],
        };
      }
    });
    if (finalValuesArr.length == 0) {
      toast.error('Please make any one change to submit', { autoClose: 3000 });
      return false;
    }
    const param = {
      ...this.state,
      requestCode: 7,
      finalValuesArr,
      WAId: this.WAId,
      type,


    };

    this.setState({ workersList: [], projectTitle: 'Select Project', showSubButton: false });
    dispatch(requestPost(param));
    if (type == 1) {
      toast.success('Attendance Submitted Successfully', { autoClose: 3000 });
    } else {
      toast.success('Attendance Saved Successfully', { autoClose: 3000 });
    }
  }
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
  }
  setReason = (key, list, stateKey) => {
    const inTime = stateKey.split('_');

    const key1 = `in_${ inTime[1] }`;
    const selectKey = `select_${ inTime[1] }`;

    if (!this.timeValuesArr[key1] && (key == 5 || key == 99)) {
      toast.error("In time can't be empty", { autoClose: 3000 });
      this.state[selectKey] = 'Select..';
      this.setState({ [selectKey]: 'Select..' });
      // return false;
    } else {
      this.timeValuesArr[stateKey] = key;
    }
  }
  onTimeChange = (value, name) => {
    this.timeValuesArr[name] = value.format('HH:mm');
  }

  validateOutTime =(value, name) => {
    const fnme = name.split('_');

    if (this.timeValuesArr[`out_${ fnme[1] }`] && this.timeValuesArr[`out_${ fnme[1] }`] < this.timeValuesArr[`in_${ fnme[1] }`]) {
      toast.error("Out time can't be less than in time", { autoClose: 3000 });
      return false;
    }
  }

  renderWorkers = (workers) => {
    if (workers.length > 0) {
      this.teamArr = [];

      // this.selectedIds = [];
      return workers.map((worker, ind) => {
        let rec = 0;
        if ((this.state.selectedOption == 1 && worker.status != 1) || (this.state.selectedOption == 2 && worker.statusOut != 1)) {
          const workerName = getDetailsWithMatchedKey2(worker.workerId, this.state.workers, 'workerIdActual', 'workerName');
          const InName = `in_${ worker.workerId }`;
          const OutName = `out_${ worker.workerId }`;
          const reasonId = `reason_${ worker.workerId }`;
          this.WAId = worker.workArrangementId;
          const workerTeam = worker.workerTeam;

          this.state[`select_${ worker.workerId }`] = 'Select..';

          if (worker.reason != 0) {
            title = getDetailsWithMatchedKey2(worker.reason, this.reasonsList, 'id', 'reason');
          }
          if (this.teamArr[workerTeam]) {
            this.teamArr[workerTeam] = parseInt(this.teamArr[workerTeam]) + 1;
          } else {
            this.teamArr[workerTeam] = 1;
          }

          let invalue = '';
          let outvalue = '';
          if (worker.inTime != '00:00:00') {
            invalue = moment(`03-25-2015 ${ worker.inTime }`);
            this.timeValuesArr[InName] = worker.inTime;
          }
          if (worker.outTime != '00:00:00') {
            outvalue = moment(`03-25-2015 ${ worker.outTime }`);
            this.timeValuesArr[OutName] = worker.outTime;
          }
          rec++;
          return (
            <div className="row" key={ ind }>
              <div className="col-xs-1" style={ { width: '10px' } }>
                <span><input value={ worker.workerId } type="checkbox" onClick={ this.onCheckBoxClick } /></span>
              </div>
              <div className="col-xs-3 ellipsis">
                <span>{workerName}</span>
              </div>
              {this.state.selectedOption == 1 &&
              <div className="col-xs-2" style={ { textAlign: 'center' } }>

                <TimePicker

                  defaultValue={ invalue }
                  format="hh:mm a"
                  showSecond={ false }
                  onChange={ (value, id = InName) => this.onTimeChange(value, id) }
                  use12Hours
                  name={ InName }
                  className="width100"
                />
              </div>
          }
              {this.state.selectedOption == 2 &&
              <div className="col-xs-2" style={ { textAlign: 'center' } }>

                <TimePicker
                  defaultValue={ outvalue }
                  format="hh:mm a"
                  showSecond={ false }
                  onChange={ (value, id = OutName) => this.onTimeChange(value, id) }
                  onClose={ (value, id = OutName) => this.validateOutTime(value, id) }
                  use12Hours
                  name={ OutName }
                  className="width100"
                />
              </div>
          }
              <div className="col-xs-6" style={ { textAlign: 'center' } }>
                <Dropdown
                  title={ this.state[`select_${ worker.workerId }`] }
                  name="reason"
                  keyName="id"
                  stateId={ reasonId }
                  list={ this.reasonsList }
                  value={ worker.reason }
                  resetThenSet={ this.setReason }
                />
              </div>
            </div>
          );
        }
      });
    }

    return (<div className="row">
      <div className="col-xs-1">
        <span>&nbsp;</span>
      </div>
      <div lassName="col-xs-6" style={ { color: 'red' } }> No Records Found</div>
    </div>
    );
  };

  teamDisplay = () => {
    const stateArr = this.state;
    return this.teamArr.map((teamCount, teamId) => {
      const teamName = getDetailsWithMatchedKey2(teamId, stateArr.team, 'teamid', 'teamName');
      return (
        <div>
          <div className="col-xs-3">
            <span><strong>Total Pax {teamName}</strong>:</span>

          </div>
          <div className="col-xs-3" >

            <span> {teamCount}</span>
          </div><br />
        </div>
      );
    });
  }
  onStartDateChange = (e) => {
    if (e != null) {
      this.setState({
        startDate: e.format('YYYY/MM/DD'),
        startDate1: e,
      });
    } else {
      this.setState({
        startDate: '',
        startDate1: '',
      });
    }
    this.state.startDate = e.format('YYYY/MM/DD'); // dont remove - to get immedaite value of date
    this.getWorkers(this.state.projectId);
  }
setRemarks = (e) => {
  // this.state.remarks = e.target.value;
  this.setState({ remarks: e.target.value });
}
  /* Render */
render() {
  const { headerTitle, workersList } = this.state;
  const cDate = getCurrentDate();
  // let cTime = getCurrentTime();
  let readonly = false;
  if (this.props.userType == 5) {
    readonly = true;
  }
  return (
    <div className="work-arr-container">
      <br />
      <ToastContainer autoClose={ 8000 } />
      <div className="row">
        <div className="col-sm-3"><label>Date</label></div>

        <div className="col-sm-3"> <DatePicker
          selected={ this.state.startDate1 }

          className=" form-control"
          isClearable={ false }
          onChange={ this.onStartDateChange }
          name="startDate"
          dateFormat="DD-MM-YYYY"
          locale="UTC"
          readOnly={ readonly }
        />
        </div>

      </div>
      <div className="row">
        <div className="col-sm-3"><label>Site</label></div>
        <div className="col-sm-6">
          <Dropdown
            title={ this.state.projectTitle }
            name="projectName"
            keyName="projectId"
            stateId="projects"
            list={ this.state.projects }
            value={ this.state.value_projects }
            resetThenSet={ this.getWorkers }
          />
        </div>
      </div>
      {/* map mutiple workers 8 */}
      <div className="companyWorksList">

        <div className="row">
          <div className="col-xs-1" style={ { width: '10px' } }>
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
                checked={ this.state.selectedOption === '1' }
                onChange={ this.handleOptionChange }
              />
            &nbsp;IN
            </span>
          </div>
          <div className="col-xs-2">
            <span>
              <input
                type="radio"
                value="2"
                checked={ this.state.selectedOption === '2' }
                onChange={ this.handleOptionChange }
              />
            &nbsp;OUT
            </span>

          </div>

        </div>

        <div className="row">
          <div className="col-xs-1" style={ { width: '10px' } }>
            <span>&nbsp;</span>
          </div>
          <div className="col-xs-3 ">
            <span><strong>Workers</strong></span>
          </div>
          {this.state.selectedOption == 1 &&
            <div className="col-xs-2">
              <span>
            &nbsp;IN
              </span>
            </div>
}
          {this.state.selectedOption == 2 &&
            <div className="col-xs-2">
              <span>
            &nbsp;OUT
              </span>

            </div>
}
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
      this.renderWorkers(workersList)

    }
        {workersList && workersList.length > 0 &&

      this.teamDisplay()
      }
        <br />
      </div>
      <div className="row">
        <div className="col-sm-3"><label>Remark</label></div>
        <div className="col-sm-6">
          <CustInput type="textarea" onChange={ this.setRemarks } name="remarks" value={ this.state.remarks } />
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
      {this.state.showSubButton === true &&
        <div className="row">
          <div className="col-sm-3">
            <CustomButton bsStyle="secondary" className="width50" onClick={ () => this.onSubmit(2) } id="draft" type="submit">Draft</CustomButton>
          </div>
          <div className="col-sm-3">
            <CustomButton bsStyle="primary" id="submit" onClick={ () => this.onSubmit(1) } className="width50" type="submit">Submit</CustomButton>
          </div>
        </div>
    }

    </div>

  );
}
}


export default Attedence;
