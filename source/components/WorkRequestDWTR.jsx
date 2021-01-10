import React, { Component } from "react";
import { toast } from "react-toastify";
import CustInput from "./CustInput";
import CustomButton from "./CustomButton";
import Dropdown1 from "./Dropdown1";
import * as API from "../config/api-config";

export default class WorkRequestDWTR extends Component {
  constructor() {
    super();

    this.state = {
      uniqueId: Date.now(),
      imagePush: [1],
      isLoading: false,      
    };
   // sessionStorage.setItem("deleteCount",0);

  }
  componentDidMount() {
    //sessionStorage.setItem("deleteCount",0);
  };
  selectImages = (event) => {
    this.setState({isLoading:true});
    const ext = event.target.files[0].name.split(".");
    const data = new FormData();
    data.append("image", event.target.files[0], event.target.files[0].name);
    data.append("uniqueId", this.state.uniqueId);
    data.append("requestCode", 20);
    data.append("imagefor", event.target.name);
    this.setState({
      [event.target
        .name]: `images/${this.state.uniqueId}/${event.target.name}.${ext[1]}`,
    });
    this.uploadImages(data,event.target.name);
  };

  uploadImages = (obj,imageAttr) => {
    fetch(API.WORKREQUEST_URI, {
      method: "post",
      mode: "cors",
      body: obj,
    })
      .then((response) => response.json())
      .then((json) => this.imageUploadSuccess(json));
  };
  imageUploadSuccess = (json) => {
    if (json.responsecode == 1) {
      this.setState({isLoading:false});
      toast.success("Image uploaded Successfully", { autoClose: 3000 });
    } else {
      this.setState({isLoading:false});
      toast.error(`Error: ${json.response}`, { autoClose: 3000 });
    }
  };

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

  itemAddition = () => {
    let arrayData = this.state.imagePush;
    const lastData = arrayData.slice(-1)[0];
    const newCount = lastData + 1;
    if (!arrayData.includes(newCount)) arrayData.push(newCount);
    this.setState({ imagePush: arrayData });
  };

  validateWorkRequestForm = () => {
    const { photo_1, photo_2, photo_3,photo_4,photo_5,photo_6,photo_7,photo_8,photo_9,photo_10 } = this.state;
    if (typeof this.state.wrno === "undefined" || this.state.wrno == "") {
      toast.error("Please select work request id", { autoClose: 3000 });
      return false;
    }
    if (
      typeof this.state.subdivision === "undefined" ||
      this.state.subdivision == ""
    ) {
      toast.error("Please select sub division", { autoClose: 3000 });
      return false;
    }
    if (this.state.workType == 1) {
      if (!this.state.L) {
        toast.error("Length is required", { autoClose: 3000 });
        return false;
      }
      if (!this.state.W) {
        toast.error("Width is required", { autoClose: 3000 });
        return false;
      }
      if (!this.state.H) {
        toast.error("Height is required", { autoClose: 3000 });
        return false;
      }
      if (!this.state.set) {
        toast.error("Set is required", { autoClose: 3000 });
        return false;
      }

      if (
        typeof this.state.workstatus === "undefined" || this.state.workstatus == ""
      ) {
        toast.error("Please select work status", { autoClose: 3000 });
        return false;
      }
       let totalTodayWork =
          Number(this.state.L) *
          Number(this.state.H) *
          Number(this.state.W) *
          Number(this.state.set),
          totalWork = this.state.selectedArr.totalset,
          workDone = this.state.selectedArr.workdonetotal,
          workRequestTotal=this.state.selectedArr.workRequstTotal,
          workDoneTotalForallSubset=this.state.selectedArr.workdonetotal,
          pendingWork = totalWork - workDone,
          msg = "",
          msg1 = "";    
          console.log("workRequestTotal"+workRequestTotal);
          console.log("workDoneTotalForallSubset"+workDoneTotalForallSubset);
        let h =0,l =0,w =0,set =0, todayPreWork=0;
        if(this.props.itemList != null && this.props.itemList != 'undefined')
        {
        for(let index=0;index<this.props.itemList.length;index++)
        {
          todayPreWork=todayPreWork+Number(this.props.itemList[index].H)*Number(this.props.itemList[index].L)*Number(this.props.itemList[index].W)*+Number(this.props.itemList[index].set);
        }
      }
        console.log(todayPreWork);
        if(todayPreWork > 0)
        {
          workDone=0;
            
        }
        workDone=workDone+todayPreWork;
        pendingWork = totalWork - workDone;
        if (totalWork-pendingWork < 0) {
        msg = "Available volume is " + pendingWork;
        toast.error(msg, { autoClose: 3000 });        
        return false;
        
      }
      console.log("workDone"+workDone);
      console.log("todayPreWork"+todayPreWork);
      if(totalTodayWork+todayPreWork > totalWork)
      {
        msg = "Available volume is " + pendingWork;
        toast.error(msg, { autoClose: 3000 });        
        return false;
      }
      if(Number(workRequestTotal) < (Number(workDoneTotalForallSubset)+totalTodayWork)) 
      {
        let remDisplay=Number(workRequestTotal)-Number(workDoneTotalForallSubset);
        if(remDisplay < 0)
        {
          remDisplay=0;
        }
        msg = "Available volume is " + remDisplay + ": Work request size defined is "+workRequestTotalq;
        toast.error(msg, { autoClose: 3000 });        
        return false;
      }
    }

    if(!photo_1 && !photo_2 && !photo_3 && !photo_4 && !photo_5 && !photo_6 && !photo_7 && !photo_8 && !photo_9 && !photo_10){
      toast.error("Required upload photos", { autoClose: 3000 });
        return false;
    }

    if (this.state.selectedArrWR.workRequestsizebased == "yes") {
      // if (
      //   typeof this.state.photo_1 === "undefined" ||
      //   typeof this.state.photo_2 === "undefined" ||
      //   typeof this.state.photo_3 === "undefined"
      // ) {
      //   // msg1 = "Required upload photos";
      //   toast.error("Required upload photos", { autoClose: 3000 });
      //   return false;
      // }
    }

    return true;
  };

  handleSubmit = () => {
    if (this.validateWorkRequestForm() === true) {
      const list = {
        uniqueId: this.state.uniqueId,
        wr_no: this.state.wrno,
        value_subdivision: this.state.subdivision,
       // text_subdivision: this.state.subdivision_text,
        L: this.state.L,
        H: this.state.H,
        W: this.state.W,
        set: this.state.set,
        value_workstatus: this.state.workstatus,
        text_workstatus: this.state.workstatus_text,
        cL: this.state.cL,
        cH: this.state.cH,
        cW: this.state.cW,
        cset: this.state.cset,
        desc: this.state.desc,
        photo_1: this.state.photo_1,
        photo_2: this.state.photo_2,
        photo_3: this.state.photo_3,
        photo_4: this.state.photo_4,
        photo_5: this.state.photo_5,
        photo_6: this.state.photo_6,
        photo_7: this.state.photo_7,
        photo_8: this.state.photo_8,
        photo_9: this.state.photo_9,
        photo_10: this.state.photo_10,
      };
      console.log("add work request images",list);
      this.props.handleSubmit(list);
    //  sessionStorage.removeItem("totalTodayWork");
    }
  };

  onItemChange = (e) => {
    const key = e.target.value;
    const selectedArrWR = this.props.workRequests.filter(
      (item) => key === item.workRequestId
    )[0];
    this.setState({ selectedArrWR: selectedArrWR });
    this.setState({ subItem: this.props.items[key] });
    this.onFormChange(e);
  };

  displayDesc = (e) => {
    const key = e.target.value;
    const selectedArr = this.state.subItem.filter(
      (item) => key === item.itemId
    )[0];
    this.setState({ desc: selectedArr.desc });
    this.setState({ selectedArr: selectedArr });
    this.setState({ requestByName: selectedArr.requestBy });
    this.setState({ workType: selectedArr.type });
    this.onFormChange(e);
  };

  render() {
    const { imagePush } = this.state;
    return (
      <div className="orginalContract">
        <div className="row">
          <div className="col-xs-12">
            <label>WR #</label>
            <Dropdown1
              title="Select WR #"
              name="workRequestStrId"
              keyName="workRequestId"
              stateId="wrno"
              value={this.state.value_item}
              list={this.props.workRequests}
              resetThenSet={this.onItemChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <label>WR Sub Division</label>
            <Dropdown1
              title={this.state.divisionTitle}
              name="itemName"
              keyName="itemId"
              stateId="subdivision"
              list={this.state.subItem}
              resetThenSet={this.displayDesc}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 red"> {this.state.desc}</div>
        </div>
        {this.state.requestByName != "" && (
          <div className="row">
            <div className="col-xs-3 ">Work Request By :</div>
            <div className="col-xs-6 "> {this.state.requestByName}</div>
          </div>
        )}

        {this.state.workType == 1 && (
          <div>
            <div className="row">
              <div className="col-sm-12">
                <label>&nbsp;</label>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-3">
                {" "}
                <CustInput
                  size="4"
                  type="float"
                  name="L"
                  value={this.state.L}
                  onChange={this.onFormChange}
                />{" "}
                L
              </div>
              <div className="col-xs-3">
                <CustInput
                  size="4"
                  type="float"
                  name="W"
                  value={this.state.W}
                  onChange={this.onFormChange}
                />
                W
              </div>
              <div className="col-xs-3">
                <CustInput
                  size="4"
                  type="float"
                  name="H"
                  value={this.state.H}
                  onChange={this.onFormChange}
                />
                H
              </div>

              <div className="col-xs-3">
                <CustInput
                  size="4"
                  type="number"
                  name="set"
                  value={this.state.set}
                  onChange={this.onFormChange}
                />
                Set
              </div>
            </div>

            <div className="col-xs-3">
              <label>Status</label>
            </div>
            <div className="col-xs-9">
              <Dropdown1
                title={this.state.statusTitle}
                name="value"
                keyName="id"
                stateId="workstatus"
                value={this.state.value_workstatus}
                list={this.props.workStatus}
                resetThenSet={this.onFormChange}
              />
              <br />
              <br />
            </div>
            {(this.state.workstatus == 2 || this.state.workstatus == 3) && (
              <div>
                <div className="row">
                  <div className="col-sm-12">
                    <label>Comp/Full Size</label>
                  </div>
                </div>
                <div className="col-xs-3">
                  {" "}
                  <CustInput
                    size="4"
                    type="float"
                    name="cL"
                    value={this.state.cL}
                    onChange={this.onFormChange}
                  />{" "}
                  L
                </div>
                <div className="col-xs-3">
                  <CustInput
                    size="4"
                    type="float"
                    name="cW"
                    value={this.state.cW}
                    onChange={this.onFormChange}
                  />
                  W
                </div>
                <div className="col-xs-3">
                  <CustInput
                    size="4"
                    type="float"
                    name="cH"
                    value={this.state.cH}
                    onChange={this.onFormChange}
                  />
                  H
                </div>

                <div className="col-xs-3">
                  <CustInput
                    size="4"
                    type="number"
                    name="cset"
                    value={this.state.cset}
                    onChange={this.onFormChange}
                  />
                  Set
                </div>
              </div>
            )}
          </div>
        )}
        <br />
        <br />
        {imagePush.length > 0 &&
              imagePush.map((data, index) => {
                return (
                  <div
                    className="row"
                    style={{ paddingTop: "15px" }}
                    key={index}
                  >
                    <div className="col-xs-3">Upload Photo {data}</div>
                    <div className="col-xs-6">
                      {" "}
                      <input
                        type="file"
                        name={"photo_" + data}
                        onChange={this.selectImages}
                      />
                    </div>
                  </div>
                );
              })}
            {imagePush.length <= 9 && (
              <div className="row pull-right">
                <div className="col-xs-6">
                  <button
                    type="button"
                    id="Add"
                    onClick={this.itemAddition}
                    className="btn btn-default btn-sm right"
                  >
                    <span className="glyphicon glyphicon-plus right" />
                  </button>
                </div>
              </div>
            )}
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
              {
                this.state.isLoading ? (
                  <CustomButton bsStyle="primary" disabled onClick={this.handleSubmit}>
                Submit
              </CustomButton>
                ) : (
                  <CustomButton bsStyle="primary" onClick={this.handleSubmit}>
                Submit
              </CustomButton>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
