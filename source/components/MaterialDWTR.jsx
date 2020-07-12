import React, { Component } from "react";
import { toast } from "react-toastify";
import TimePicker from "rc-time-picker";
import CustInput from "./CustInput";
import CustomButton from "./CustomButton";
import Dropdown1 from "./Dropdown1";

export default class ManpowerDWTR extends Component {
  constructor() {
    super();

    this.state = {};
  }

  onFormChange = (e) => {
    if (e) {
      this.setState({ [e.target.name]: e.target.value });

      if (e.target.selectedIndex) {
        this.setState({
          [`${e.target.name}_text`]: e.target[e.target.selectedIndex].text,
        });
      }
    }
  };

  onTimeChange = (val, name) => {
    const e = {
      target: {
        value: val.format("HH:mm"),
        name,
      },
    };
    this.onFormChange(e);
  };

  validateTeamForm = () => {
    if (
      typeof this.state.materials === "undefined" ||
      this.state.materials == ""
    ) {
      toast.error("Please select material", { autoClose: 3000 });
      return false;
    }
    if (
      typeof this.state.workerCount === "undefined" ||
      this.state.workerCount == ""
    ) {
      toast.error("Please enter worker count", { autoClose: 3000 });
      return false;
    }

    if (typeof this.state.inTime === "undefined") {
      toast.error("Please enter in time", { autoClose: 3000 });
      return false;
    }

    if (typeof this.state.outTime === "undefined") {
      toast.error("Please enter out time", { autoClose: 3000 });
      return false;
    }

    return true;
  };

  handleSubmit = () => {
    if (this.validateTeamForm() === true) {
      const manpowerList = {
        uniquieId: Date.now(),
        value_materials: this.state.materials,
        text_materials: this.state.materials_text,
        workerCount: this.state.workerCount,
        inTime: this.state.inTime,
        outTime: this.state.outTime,
        subdivision: this.props.workRequestId,
      };

      this.props.handleSubmit(manpowerList);
    }
  };

  render() {
    return (
      <div className="manPowerSelection">
        <div className="row">
          <div className="col-xs-6">Material</div>
          <div className="col-xs-6">
            <Dropdown1
              name="value"
              keyName="id"
              stateId="materials"
              list={this.props.materials}
              resetThenSet={this.onFormChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6">
            <label>No.of Workers</label>
          </div>
          <div className="col-xs-6">
            <CustInput
              type="number"
              size="4"
              name="workerCount"
              value={this.state.workerCount}
              onChange={this.onFormChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-6">Time IN</div>
          <div className="col-xs-6">
            <TimePicker
              format="hh:mm a"
              showSecond={false}
              onChange={(value) => this.onTimeChange(value, "inTime")}
              use12Hours
              name="inTime"
              className="width100"
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">Time OUT</div>
          <div className="col-xs-6">
            <TimePicker
              format="hh:mm a"
              showSecond={false}
              onChange={(value) => this.onTimeChange(value, "outTime")}
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
            <div className="col-sm-6">
              {" "}
              <CustomButton
                bsStyle="secondary"
                onClick={this.props.handleClose}
              >
                Cancel
              </CustomButton>
            </div>
            <div className="col-sm-6">
              {" "}
              <CustomButton bsStyle="primary" onClick={this.handleSubmit}>
                Submit
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
