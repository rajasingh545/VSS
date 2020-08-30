/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import WorkRequestPreview from "../components/WorkRequestPreview";
import CustInput from "../components/CustInput";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  workRequestPost,
} from "actions/workArrangement.actions";

import SizeWorkRequest from "../components/SizeWorkRequest";
import Popup from "../components/Popup";
import SizePreview from "../components/SizePreview";
import ManPowerPreview from "../components/ManPowerPreview";
import ManPowerWorkRequest from "../components/ManPowerWorkRequest";
import * as API from "../config/api-config";
@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestPost: state.request.get("workRequestPost"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class WorkRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      clients: [],
      projectTitle: "Select Project",
      clientTitle: "Select Client",
      locationTitle: "Select Location",
      itemtitle: "Select Item",
      scaffoldTypetitle: "Select Type",
      scaffoldWorkTypetitle: "Select Work Type",
      scaffoldSubcategorytitle: "Select Category",
      drawingAttachedFile: [],
      contracts: [],
      filteredArr: [],
      scaffoldWorkType: [],
      scaffoldType: [],
      itemList: [],
      sizeList: [],
      manpowerList: [],
      clientsStore: [],
      showSizePopup: false,
      drawingimage: "",
      contractSize:0
    };
    this.drawingAttachedFile = [];
    this.itemList = [];
    this.sizeList = [];
    this.manpowerList = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.requestDet && nextProps.requestDet.projects) {
      this.state.projects = nextProps.requestDet.projects;
      this.state.clients = nextProps.requestDet.clients;
      this.state.workRequestList = nextProps.requestDet.workRequestList;
      this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
      this.state.scaffoldType = nextProps.requestDet.scaffoldType;
      this.state.subCategoryStore = nextProps.requestDet.subCategory;
      this.state.clientsProjectMapping =
        nextProps.requestDet.clientsProjectMapping;
    }
    if (nextProps.requestDet && nextProps.requestDet.contracts) {
      this.setState({ contracts: nextProps.requestDet.contracts });
      // this.setState()
      if (nextProps.requestDet.contracts.length == 0) {
        toast.error(
          "No original contracts available for this project and client",
          { autoClose: 3000 }
        );
      }
    }
  }
  onFormChange = (e) => {
    if (e) {
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({ [e.target.name]: e.target.value });
      if (e.target.value == 2) {
        this.setState({ scaffoldRegister: "" });
      }
    }
  };
  onCheckBoxChecked = (e) => {
    if (e.target.checked == true) {
      this.setState({ [e.target.name]: 1 });
    } else {
      this.setState({ [e.target.name]: 0 });
    }
  };

  callform = (key, list, stateKey, title) => {
    this.resetThenSet(key, list, stateKey, title);
  };

  populateSubCat = (key, list, stateKey, title) => {
    this.setState({
      subCategory: this.state.subCategoryStore[key],
      scaffoldSubcategorytitle: "Select Category",
    });

    this.resetThenSet(key, list, stateKey, title);
  };
  onItemChange = (key, list, stateKey, title) => {
    console.log(key, list, stateKey, title);

    this.state.filteredArr = this.state.contracts.filter((list) => {
      return list.id == key;
    });
    let LocTitle = "";
    let itemTitle = "";
    let desc = "";
    let description = "";
    let total = 0;
    list.map((item) => {
      if (item.id == key) {
        LocTitle = item.location;
        itemTitle = item.item;
        description = item.description;
        desc =
          "Size: " +
          item["length"] +
          "mL x " +
          item["width"] +
          "mW x " +
          item["height"] +
          "mH, Set:" +
          item["sets"];
          total = item["length"]*item["width"]*item["height"]*item["sets"];
      }
    });
    this.resetThenSet(key, list, "location", LocTitle);
    this.resetThenSet(key, list, "item", itemTitle);
    this.setState({
      description,
      itemtitle: this.state.text_item,
      locationTitle: this.state.text_location,
      desc,
      contractSize: total,
    });

    
  };

  resetThenSet(key, list, stateKey, title) {
    // let temp = this.state[key];
    // temp.forEach(item => item.selected = false);
    // temp[id].selected = true;

    this.setState({
      [stateKey]: list,
    });

    const valuekey = `value_${stateKey}`;
    const textKey = `text_${stateKey}`;
    const titleKey = `${stateKey}title`;
    //  console.log("inside==", valuekey, key.toString())
    this.setState({
      [valuekey]: key.toString(),
      [textKey]: title,
    });
    this.state[valuekey] = key.toString();
    this.state[textKey] = title;

    this.state[titleKey] = title;
  }
  onChangeProject = (key, list, stateKey, title) => {
    const clientsList = this.state.clientsProjectMapping[key]
      ? this.state.clients[key]
      : [];
    //   console.log("clientsList",clientsList,this.state.clients[key] )
    // this.setState({clientsStore:[clientsList]});
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  };
  onChangeItem = (key, list, stateKey, title) => {
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  };
  requestItems = () => {
    const { dispatch } = this.props;

    if (
      this.state.value_projects &&
      this.state.value_clients &&
      this.state.cType == 1
    ) {
      this.state.requestCode = 5;
      dispatch(requestDetails(this.state));
    }
  };

  onctypeChange = (e) => {
    if (e.target.value == 1) {
      this.state.cType = 1;
      this.requestItems();
    } else {
      this.setState({ contracts: [] });
    }
    this.onFormChange(e);
  };
  onChangeSizeType = (e) => {
    if (e.target.value == 1) {
      // this.setState({
      //   L: this.state.filteredArr[0].length,
      //   W: this.state.filteredArr[0].width,
      //   H: this.state.filteredArr[0].height,
      //   set: this.state.filteredArr[0].sets,
      // });
    } else {
      // this.setState({
      //   L: '',
      //   W: '',
      //   H: '',
      //   set: '',
      // });
    }
    this.onFormChange(e);
  };

  onTimeChange = (el) => {
    this.setState({ [el.name]: el.value });
  };
  filepload = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("uniqueId", this.state.userId);
    formData.append("requestCode", 24);
    formData.append("drawingimage", e.target.files[0]);
    fetch(API.WORKREQUEST_URI, {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.responsecode === 1) {
          this.state.drawingimage = res.imageurl;
          this.setState({ drawingimage: res.imageurl });
        }
      });
  };
  submitRequest = (status) => {
    const { dispatch } = this.props;
    const formValidation = this.validateForm();

    if (formValidation == true) {
      if (this.state.cType == 1) {
        this.addListToItem();
      }
      this.state.requestCode = 14;
      this.state.status = status;

      dispatch(workRequestPost(Object.assign(this.state)));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});

      if (status == 1) {
        toast.success("Work Request Created Successfully", { autoClose: 3000 });
      }
      if (status == 2) {
        toast.success("Work Request Drafted Successfully", { autoClose: 3000 });
      }

      setTimeout(() => {
        this.props.history.push("/WorkRequestList");
      }, 3000);
    }
  };
  validateForm = () => {
    if (!this.state.value_projects) {
      toast.error("Project is required", { autoClose: 3000 });
      return false;
    }
    if (!this.state.value_clients) {
      toast.error("Client is required", { autoClose: 3000 });
      return false;
    }

    if (!this.state.requestBy || this.state.requestBy == "") {
      toast.error("Requested by is required", { autoClose: 3000 });
      return false;
    }

    if (!this.state.cType || this.state.cType == "") {
      toast.error("Contract Type is required", { autoClose: 3000 });
      return false;
    }

    if (this.state.workBased == 1) {
      console.log("===>", this.state.sizeList.length);
      if (this.state.sizeList.length === 0) {
        toast.error("Please add size", { autoClose: 3000 });
        return false;
      }
    }
    if (this.state.workBased == 2) {
      if (this.state.manpowerList.length === 0) {
        toast.error("Please add manpower", { autoClose: 3000 });
        return false;
      }
    }

    return true;
  };

  addListToItem = () => {
    const found = this.itemList.some(
      (el) => el.value_item === this.state.value_item
    );

    if (this.state.value_item != "") {
      if (!found) {
        const list = {
          value_item: this.state.value_item,
          text_item: this.state.text_item,
          sizeType: this.state.sizeType,
          workBased: this.state.workBased,
          workRequestId: this.state.value_workRequestId,
          sizeList: this.state.sizeList,
          manpowerList: this.state.manpowerList,
        };

        this.itemList.push(list);
        this.state.itemList = this.itemList;
      }
    }
  };

  itemAddition = () => {
    if (this.validateForm() == true) {
      this.addListToItem();
      this.setState({
        itemtitle: "Select Item",
        locationTitle: "Select Location",
        value_item: "",
        sizeType: "",
        workBased: "",
        sizeList: [],
        manpowerList: [],
      });

      toast.success("Item added successfully", { autoClose: 3000 });
    }
  };

  setPreview = () => {
    this.addListToItem();

    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };

  displaySizePopup = () => {
    this.setState({ showSizePopup: true });
  };

  handleSizePopupClose = () => {
    this.setState({ showSizePopup: false });
  };

  handleSizeSubmit = (data) => {
    this.sizeList.push(data);

    this.setState({ sizeList: this.sizeList });
    this.handleSizePopupClose();
  };

  deleteSizeItem = (index) => {
    if (this.sizeList.length === 1) {
      this.sizeList = [];
    } else {
      this.sizeList.splice(index, 1);
    }
    this.setState({ sizeList: this.sizeList });
  };

  deleteManPowerItem = (index) => {
    if (this.manpowerList.length === 1) {
      this.manpowerList = [];
    } else {
      this.manpowerList.splice(index, 1);
    }
    this.setState({ manpowerList: this.manpowerList });
  };
  displaySizeList = (itemList) => {
    return itemList.map((item, index) => {
      return (
        <SizePreview index={index} item={item} onClose={this.deleteSizeItem} />
      );
    });
  };
  displayManPowerList = (itemList) => {
    return itemList.map((item, index) => {
      return (
        <ManPowerPreview
          index={index}
          item={item}
          onClose={this.deleteManPowerItem}
        />
      );
    });
  };

  displayManPowerPopup = () => {
    this.setState({ showManPowerPopup: true });
  };

  handleManPowerPopupClose = () => {
    this.setState({ showManPowerPopup: false });
  };

  handleManPowerSubmit = (data) => {
    this.manpowerList.push(data);
    this.setState({ manpowerList: this.manpowerList });
    this.handleManPowerPopupClose();
  };

  /* Render */
  render() {
    const { itemtitle } = this.state;
    // console.log("==",this.state.scaffoldworktypetitle, this.state.scaffoldtypetitle,this.state.scaffoldcategorytitle);

    let showSizeAddButton = true;
    let showManPowerAddButton = true;
    if (this.state.cType == 1 && this.state.sizeList.length == 1) {
      showSizeAddButton = false;
    }

    if (this.state.cType == 1 && this.state.manpowerList.length == 1) {
      showManPowerAddButton = false;
    }

    return (
      <div className="container work-arr-container">
        <ToastContainer autoClose={8000} />
        <br />
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
              resetThenSet={this.onChangeProject}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Client</label>
          </div>
          <div className="col-sm-6">
            <Dropdown
              title={this.state.clientTitle}
              name="clientName"
              keyName="clientId"
              stateId="clients"
              list={this.state.clients}
              value={this.state.value_projects}
              resetThenSet={this.onChangeItem}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            <label>Work Request By</label>
          </div>
          <div className="col-xs-6">
            <CustInput
              type="text"
              name="requestBy"
              value={this.state.requestBy}
              onChange={this.onFormChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-1">
            <label>
              <input
                type="radio"
                name="cType"
                value="1"
                onChange={this.onctypeChange}
                checked={this.state.cType == "1"}
              />
            </label>
          </div>
          <div className="col-xs-6">
            <label>Original Contract</label>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-1">
            <label>
              <input
                type="radio"
                name="cType"
                value="2"
                onChange={this.onctypeChange}
                checked={this.state.cType == "2"}
              />
            </label>
          </div>
          <div className="col-xs-6">
            <label>Variation Works</label>
          </div>
        </div>
        {this.state.cType == 1 ? (
          <div className="pull-right">
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
        ) : (
          ""
        )}
        <br />
        <br />
        {this.state.contracts.length > 0 && (
          <div className="orginalContract">
            <div className="row">
              <div className="col-xs-6">
                <label>Items</label>
                <Dropdown
                  title={itemtitle}
                  name="item"
                  keyName="id"
                  stateId="item"
                  list={this.state.contracts}
                  resetThenSet={this.onItemChange}
                />
              </div>
              <div className="col-xs-6">
                <label>Locations</label>
                <Dropdown
                  title={this.state.locationTitle}
                  name="location"
                  keyName="id"
                  stateId="location"
                  list={this.state.contracts}
                  resetThenSet={this.onItemChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12 red"> {this.state.desc}</div>
            </div>
            <div className="row">
              <div className="col-xs-1">
                <label>
                  <input
                    type="radio"
                    name="sizeType"
                    value="1"
                    onChange={this.onChangeSizeType}
                    checked={this.state.sizeType == "1"}
                  />
                </label>
              </div>
              <span className="col-xs-6">Full Size</span>
            </div>

            <div className="row">
              <div className="col-xs-1">
                <label>
                  <input
                    type="radio"
                    name="sizeType"
                    value="2"
                    onChange={this.onChangeSizeType}
                    checked={this.state.sizeType == "2"}
                  />
                </label>
              </div>
              <span className="col-xs-6">Partial Size</span>
            </div>
          </div>
        )}
        {this.state.sizeType == 2 && (
          <div className="description">
            <div className="row">
              <div className="col-xs-6">
                <label>Previous WR#</label>
              </div>
              <div className="col-xs-6">
                <Dropdown
                  title="Select WR#"
                  name="workRequestIdStr"
                  keyName="workRequestId"
                  stateId="workRequestId"
                  list={this.state.workRequestList}
                  resetThenSet={this.callform}
                />
              </div>
            </div>
          </div>
        )}
        {this.state.cType == 2 ? (
          <div className="location">
            <div className="row">
              <div className="col-xs-2">
                <label>Location</label>
              </div>
              <div className="col-xs-4">
                <CustInput
                  type="textarea"
                  name="location1"
                  value={this.state.location1}
                  onChange={this.onFormChange}
                />
              </div>

              <div className="col-xs-3">
                <input
                  type="checkbox"
                  name="drawingAttached"
                  onClick={this.onCheckBoxChecked}
                  checked={this.state.drawingAttached == 1}
                  style={{
                    marginRight: "11px",
                  }}
                />
                <label>Drawing Attached</label>
              </div>
              {this.state.drawingAttached == 1 && (
                <div className="col-xs-3">
                  <input
                    type="file"
                    ref="file"
                    id="drawingAttachedFile"
                    name="drawingAttachedFile"
                    onChange={this.filepload}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
        {this.state.cType == 1 ? (
          <div>
            <div className="col-xs-6">
              <input
                type="checkbox"
                name="drawingAttached"
                onClick={this.onCheckBoxChecked}
                checked={this.state.drawingAttached == 1}
                style={{
                  marginRight: "11px",
                }}
              />
              <label>Drawing Attached</label>
            </div>
            {this.state.drawingAttached == 1 && (
              <div className="col-xs-6">
                <input
                  type="file"
                  ref="file"
                  id="drawingAttachedFile"
                  name="drawingAttachedFile"
                  onChange={this.filepload}
                />
              </div>
            )}
          </div>
        ) : (
          ""
        )}
        <div className="description">
          <div className="row">
            <div className="col-xs-6">
              <label>Description</label>
            </div>
            <div className="col-xs-6">
              <CustInput
                type="textarea"
                name="description"
                value={this.state.description}
                onChange={this.onFormChange}
                readOnly={this.state.cType == "1" ? "readOnly" : ""}
              />
            </div>
          </div>
        </div>
        <div className="workBasedOn">
          <div className="row">
            <div className="col-sm-12">Work Based On</div>
          </div>
          <div className="row">
            <div className="col-xs-1">
              <label>
                <input
                  type="radio"
                  name="workBased"
                  value="1"
                  onChange={this.onFormChange}
                  checked={this.state.workBased == "1"}
                />
              </label>
            </div>
            <div className="col-xs-3">Size</div>
          </div>
          <div className="row">
            <div className="col-xs-1">
              <label>
                <input
                  type="radio"
                  name="workBased"
                  value="2"
                  onChange={this.onFormChange}
                  checked={this.state.workBased == "2"}
                />
              </label>
            </div>
            <div className="col-xs-3">ManPower</div>
          </div>
        </div>
        <Popup
          show={this.state.showSizePopup}
          title="Add Size"
          handleClose={this.handleSizePopupClose}
        >
          <SizeWorkRequest
            scaffoldWorkType={this.state.scaffoldWorkType}
            scaffoldTypeList={this.state.scaffoldType}
            subCategory={this.state.subCategoryStore}
            handleClose={this.handleSizePopupClose}
            handleSubmit={this.handleSizeSubmit}
            contractId={this.state.value_item}
            contractSize = {this.state.contractSize}
            contractDesc = {this.state.desc}
          />
        </Popup>
        <Popup
          show={this.state.showManPowerPopup}
          title="Add Manpower"
          handleClose={this.handleManPowerPopupClose}
        >
          <ManPowerWorkRequest
            handleSubmit={this.handleManPowerSubmit}
            handleClose={this.handleManPowerPopupClose}
          />
        </Popup>
        {this.state.workBased == 1 && (
          <div>
            {this.state.sizeList.length > 0 && (
              <div>{this.displaySizeList(this.state.sizeList)} </div>
            )}
            {showSizeAddButton == true && (
              <CustomButton bsStyle="primary" onClick={this.displaySizePopup}>
                Add Size
              </CustomButton>
            )}

            <br />
            <br />
          </div>
        )}
        {this.state.workBased == 2 && (
          <div className="manPowerSelection">
            {this.state.manpowerList.length > 0 && (
              <div>{this.displayManPowerList(this.state.manpowerList)} </div>
            )}
            {showManPowerAddButton == true && (
              <CustomButton
                bsStyle="primary"
                onClick={this.displayManPowerPopup}
              >
                Add Manpower
              </CustomButton>
            )}

            <br />
            <br />
          </div>
        )}
        {this.state.workBased == "1" && (
          <div className="row">
            <div className="col-xs-3">Scaffold Register</div>
            <div className="col-xs-6">
              {" "}
              <input
                type="checkbox"
                name="scaffoldRegister"
                onClick={this.onCheckBoxChecked}
                checked={this.state.scaffoldRegister == 1}
              />
            </div>
          </div>
        )}
        <div className="row">
          <div className="col-xs-3">Remarks</div>
          <div className="col-xs-6">
            {" "}
            <CustInput
              type="textarea"
              name="remarks"
              value={this.state.remarks}
              onChange={this.onFormChange}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="col-sm-3">
              <CustomButton
                id="draft"
                bsStyle="secondary"
                type="submit"
                onClick={() => this.submitRequest(2)}
              >
                Draft
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
                onClick={() => this.submitRequest(1)}
              >
                Submit
              </CustomButton>{" "}
            </div>
          </div>
        </div>
        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          dialogClassName="modallg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Preview</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <WorkRequestPreview curState={this.state} images={[]} />
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

export default WorkRequest;
