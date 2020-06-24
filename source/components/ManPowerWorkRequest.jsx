
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import TimePicker from 'rc-time-picker';
import CustInput from './CustInput';
import CustomButton from './CustomButton';


export default class ManPowerWorkRequest extends Component {
  constructor() {
    super();

    this.state = {};
  }

  onFormChange = (e) => {
    if (e) {
      this.setState({ [e.target.name]: e.target.value });

      if (e.target.selectedIndex) {
        this.setState({ [`${ e.target.name }_text`]: e.target[e.target.selectedIndex].text });
      }
    }
  }

  onTimeChange = (val, name) => {
    const e = {
      target: {
        value: val.format('HH:mm'),
        name,
      },
    };
    this.onFormChange(e);
  }


  validateManpowerForm = () => {
    if (typeof this.state.safety === 'undefined' || this.state.safety == '') {
      toast.error("Safety can't be empty", { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.supervisor === 'undefined' || this.state.supervisor == '') {
      toast.error("Supervisor can't be empty", { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.erectors === 'undefined' || this.state.erectors == '') {
      toast.error("Erectors can't be empty", { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.gworkers === 'undefined' || this.state.gworkers == '') {
      toast.error("Go workers can't be empty", { autoClose: 3000 });
      return false;
    }
    return true;
  }

  handleSubmit = () => {
    if (this.validateManpowerForm() === true) {
      const manpowerList = {
        safety: this.state.safety,
        supervisor: this.state.supervisor,
        erectors: this.state.erectors,
        gworkers: this.state.gworkers,
        inTime: this.state.inTime,
        outTime: this.state.outTime,
      };
      console.log("=inpop", manpowerList)

      this.props.handleSubmit(manpowerList);
    }
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="safety" value={ this.state.safety } onChange={ this.onFormChange } /></div>
          <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="supervisor" value={ this.state.supervisor } onChange={ this.onFormChange } /></div>
        </div>

        <div className="row">
          <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="erectors" value={ this.state.erectors } onChange={ this.onFormChange } /></div>
          <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="gworkers" value={ this.state.gworkers } onChange={ this.onFormChange } /></div>
        </div>

        <div className="row">
          <div className="col-xs-12"><label>ManPower Time</label></div>
        </div>
        <div className="row">
          <div className="col-xs-3">Time IN</div>
          <div className="col-xs-3">
            <TimePicker
              format="hh:mm a"
              showSecond={ false }
              onChange={ (value) => this.onTimeChange(value, 'inTime') }
              use12Hours
              name="inTime"
              className="width100"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-3">Tim-e OUT</div>
          <div className="col-xs-3">

            <TimePicker
              format="hh:mm a"
              showSecond={ false }
              onChange={ (value) => this.onTimeChange(value, 'outTime') }
              use12Hours
              name="outTime"
              className="width100"
            />
          </div>
        </div>

        <br />
        <hr />
        <br />
        <div className="row">
          <div className="col-12">
            <div className="col-sm-6"> <CustomButton bsStyle="secondary" onClick={ this.props.handleClose }>Cancel</CustomButton></div>
            <div className="col-sm-6"> <CustomButton bsStyle="primary" onClick={ this.handleSubmit }>Submit</CustomButton></div>
          </div>
        </div>
      </div>
    );
  }
}

