/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/CustomButton";
import CustInput from "../components/CustInput";
import WorkRequestPreview from "../components/WorkRequestPreview";
import baseHOC from "./baseHoc";
import { ToastContainer, toast } from "react-toastify";
import {
  requestDetails,
  workRequestPost,
} from "actions/workArrangement.actions";
import { getDetailsWithMatchedKey2 } from "../common/utility";
import { Modal } from "react-bootstrap";

import SizeWorkRequest from "../components/SizeWorkRequest";
import Popup from "../components/Popup";
import SizePreview from "../components/SizePreview";
import ManPowerPreview from "../components/ManPowerPreview";
import ManPowerWorkRequest from "../components/ManPowerWorkRequest";
import { Grid, Image } from "semantic-ui-react";
import * as API from "../config/api-config";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class WorkRequestEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      clients: [],
      projectTitle: "Select Project",
      clientTitle: "Select Client",
      scaffoldtypetitle: "Select Type",
      scaffoldworktypetitle: "Select Work Type",
      workRequestTitle: "Select WR#",
      contracts: [],
      filteredArr: [],
      scaffoldWorkType: [],
      scaffoldType: [],
      itemList: [],
      sizeList: [],
      manpowerList: [],
      contractSize: 0,
      drawingImage: [],
    };
    this.itemList = [];
    this.sizeList = [];
    this.manpowerList = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
    if (this.props.match.params && this.props.match.params.id) {
      this.state.listingId = this.props.match.params.id;
      this.state.requestCode = 16;
      dispatch(workRequestPost(this.state));
    }
  }

  click = () => {
    console.log("working");
  };
  componentWillReceiveProps(nextProps) {
    if (nextProps.requestDet && nextProps.requestDet.projects) {
      this.state.projects = nextProps.requestDet.projects;
      this.state.clients = nextProps.requestDet.clients;
      this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
      this.state.scaffoldType = nextProps.requestDet.scaffoldType;
      this.state.subCategoryStore = nextProps.requestDet.subCategory;
      this.state.workRequestList = nextProps.requestDet.workRequestList;
    }
    if (nextProps.requestDet && nextProps.requestDet.contracts) {
     this.setState({ contracts: nextProps.requestDet.contracts });
      this.state.contracts = nextProps.requestDet.contracts;

      if (
        this.props.workRequestData &&
        this.props.workRequestData.requestDetails
      ) {
        const requestDet = this.props.workRequestData.requestDetails;
        const requestItemsArr = this.props.workRequestData.requestItems;
        const requestItems = requestItemsArr[requestItemsArr.length - 1];
        let itemTitle = "Select Item";
        let locationTitle = "Select Title";
        //  console.log("thisprops", requestDet, requestItems, this.state.contracts);
        if (requestDet.contractType == 1) {
          itemTitle = getDetailsWithMatchedKey2(
            requestItems.itemId,
            this.state.contracts,
            "id",
            "item"
          );
          locationTitle = getDetailsWithMatchedKey2(
            requestItems.itemId,
            this.state.contracts,
            "id",
            "location"
          );
        }

        this.setState({
          locationTitle,
          itemTitle,
          text_item: itemTitle,
          text_location: locationTitle,
        });
      }
    } else if (
      nextProps.workRequestData &&
      nextProps.workRequestData.requestDetails
    ) {
      const requestDet = nextProps.workRequestData.requestDetails;
      const requestItemsArr = nextProps.workRequestData.requestItems;
      const requestManlistArr = nextProps.workRequestData.requestManList
        ? nextProps.workRequestData.requestManList
        : [];
      const requestSizeListArr = nextProps.workRequestData.requestSizeList
        ? nextProps.workRequestData.requestSizeList
        : [];
      let requestItems = requestItemsArr;
      let requestManlist = [{ ...requestManlistArr }];
      let requestSizeList = requestSizeListArr;

      let workRequestTitle = "Select WR#";

      if (requestItemsArr) {
        requestItems = requestItemsArr.slice(-1).pop();

        if (requestItems.workBased == 2) {
          requestManlist = requestManlistArr.slice(-1).pop();
          // console.log("=x=>", requestManlist, requestManlistArr, requestManlistArr.length-1)
        }
        if (requestItems.workBased == 1) {
          requestSizeList = requestSizeListArr.slice(-1).pop();
          workRequestTitle = getDetailsWithMatchedKey2(
            requestItems.previousWR,
            this.state.workRequestList,
            "workRequestId",
            "workRequestIdStr"
          );
        }
      }
      const proTitle = getDetailsWithMatchedKey2(
        requestDet.projectId,
        this.state.projects,
        "projectId",
        "projectName"
      );
      const clientname = getDetailsWithMatchedKey2(
        requestDet.clientId,
        this.state.clients,
        "clientId",
        "clientName"
      );

      this.setState({
        projectTitle: proTitle,
        clientTitle: clientname,
        cType: requestDet.contractType,
        description: requestDet.description,
        status: requestDet.status,
        value_projects: requestDet.projectId,
        value_clients: requestDet.clientId,
        text_projects: proTitle,
        text_clients: clientname,
        requestBy: requestDet.requestedBy,
        value_item: requestItems.itemId,
        sizeType: requestItems.sizeType,
        workRequestTitle,
        workRequestId: requestItems.previousWR,
        workBased: requestItems.workBased,
        scaffoldRegister: requestDet.scaffoldRegister,
        remarks: requestDet.remarks,
        drawingAttached:requestDet.drawingAttach,
        drawingImage:requestDet.drawingImage,
        completionImages:requestDet.completionImages,
        location1:requestDet.location,
        basePath:requestDet.basePath,
      });
        if (requestDet.contractType == 1) {
        this.state.value_projects = requestDet.projectId;
        this.state.value_clients = requestDet.clientId;
        this.state.cType = requestDet.contractType;
        this.requestItems();
      }
      if (requestDet.contractType == 1) {
        setTimeout(() => {
          const itemList = this.getOrginalContDataPopulate(requestItemsArr);
          this.state.itemList = itemList;
          this.itemList = itemList;

          const sizeList = this.getSizeDataPopulated(requestSizeListArr);
          const manpowerList = this.getManPowerPopulated(requestManlistArr);
          this.manpowerList = manpowerList;
          this.sizeList = sizeList;
          this.setState({ sizeList });
          this.setState({ manpowerList });

          this.onItemChange(requestItems.itemId, this.state.contracts);
        }, 1000);
      }
      if (requestDet.contractType == 2) {
        const sizeList = this.getSizeDataPopulated(requestSizeListArr);
        const manpowerList = this.getManPowerPopulated(requestManlistArr);

        this.state.sizeList = sizeList;
        this.state.manpowerList = manpowerList;
        this.manpowerList = manpowerList;
        this.sizeList = sizeList;
      }
    }
  }

  filepload = (e) => {
    e.preventDefault();
    this.setState({isLoading:true})
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
          this.state.drawingImage = res.imageurl;
          this.setState({ drawingImage: imageURL });
        }else{
        }
      });
  };
  
  multiplefileupload = (e) => {
    this.setState({isLoading:true});
    e.preventDefault();
    let formData = new FormData();
    formData.append("uniqueId", this.state.userId);
    formData.append("requestCode", 25);
    formData.append("workrequestid", this.state.listingId);
    let images = [];
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("images[]", e.target.files[i]);
    }
    fetch(API.WORKREQUEST_URI, {
      method: "post",
      body: formData,
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.responsecode === 1) {
          this.setState({ completionImages: this.state.completionImages.concat(res.imageurl),isLoading:false });
        } else {
          this.setState({isLoading:false});
          //toast.error(res.response, { autoClose: 3000 });
        }
      });
  };

  getOrginalContDataPopulate = (requestItemsArr) => {
    // console.log("in pop===", this.state.contracts);
    const returnArr = [];
    let i = 0;

    requestItemsArr.map((items) => {
      const sizeArray = [];
      const manPowerArray = [];

      const itemTitle = getDetailsWithMatchedKey2(
        items.itemId,
        this.state.contracts,
        "id",
        "item"
      );
      const locationTitle = getDetailsWithMatchedKey2(
        items.itemId,
        this.state.contracts,
        "id",
        "location"
      );
      const workRequestTitle = getDetailsWithMatchedKey2(
        items.previousWR,
        this.state.workRequestList,
        "workRequestId",
        "workRequestIdStr"
      );
      if (items.workBased == 1) {
        sizeArray.push(items.sizeList);
      }

      if (items.workBased == 2) {
        manPowerArray.push(items.manpowerList);
      }
      const obj = {
        value_item: items.itemId,
        text_item: itemTitle,
        text_location: locationTitle,
        sizeType: items.sizeType,
        workRequestId: items.previousWR,
        workRequestId_Text: workRequestTitle,
        workBased: items.workBased,
        sizeList: this.getSizeDataPopulated(sizeArray),
        manpowerList: this.getManPowerPopulated(manPowerArray),
      };
      returnArr.push(obj);
      i++;
    });

    return returnArr;
  };
  getSizeDataPopulated = (requestSizeListArr) => {
    const returnArr = [];
    let i = 0;
    requestSizeListArr.map((items) => {
      const scaffoldTitle = getDetailsWithMatchedKey2(
        items.scaffoldType,
        this.state.scaffoldType,
        "id",
        "scaffoldName"
      );
      const scaffoldworkTitle = getDetailsWithMatchedKey2(
        items.scaffoldWorkType,
        this.state.scaffoldWorkType,
        "id",
        "scaffoldName"
      );
      let scaffoldworkSubCategory = "";
      if (this.state.subCategoryStore) {
        scaffoldworkSubCategory = getDetailsWithMatchedKey2(
          items.scaffoldSubCategory,
          this.state.subCategoryStore[items.scaffoldType],
          "scaffoldSubCateId",
          "scaffoldSubCatName"
        );
      }

      const obj = {
        value_scaffoldWorkType: items.scaffoldWorkType,
        text_scaffoldWorkType: scaffoldworkTitle,
        text_scaffoldType: scaffoldTitle,
        value_scaffoldType: items.scaffoldType,
        text_scaffoldSubcategory: scaffoldworkSubCategory,
        value_scaffoldSubcategory: items.scaffoldSubCategory,
        L: items.length,
        H: items.height,
        W: items.width,
        set: items.setcount,
      };

      returnArr.push(obj);
      i++;
    });

    return returnArr;
  };

  getManPowerPopulated = (requestManlistArr) => {
    const returnArr = [];
    let i = 0;
    requestManlistArr.map((items) => {
      const obj = {
        safety: items.safety,
        supervisor: items.supervisor,
        erectors: items.erectors,
        gworkers: items.generalWorker,
        inTime: items.timeIn,
        outTime: items.timeOut,
      };
      returnArr.push(obj);
      i++;
    });

    return returnArr;
  };
  onFormChange = (e) => {
    if (e) {
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  onCheckBoxChecked = (e) => {
    if (e.target.checked == true) {
      this.setState({ [e.target.name]: 1 });
    } else {
      this.setState({ [e.target.name]: 0 });
    }
  };
  callform = (key, list, stateKey) => {
    this.resetThenSet(key, list, stateKey);
  };
  onItemChange = (key, list, stateKey, title) => {
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
      itemTitle: this.state.text_item,
      locationTitle: this.state.text_location,
      desc,
      contractSize: total,
    });
  };

  resetThenSet(key, list, stateKey, title) {
    this.setState({
      [stateKey]: list,
    });

    const valuekey = `value_${stateKey}`;
    const textKey = `text_${stateKey}`;

    this.setState({
      [valuekey]: key.toString(),
      [textKey]: title,
    });
    this.state[valuekey] = key.toString();
    this.state[textKey] = title;
  }
  onChangeItem = (key, list, stateKey) => {
    this.resetThenSet(key, list, stateKey);
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
    // if(e.target.value == 1){
    //     // this.setState({
    //     //     L:this.state.filteredArr[0].length,
    //     //     W:this.state.filteredArr[0].width,
    //     //     H:this.state.filteredArr[0].height,
    //     // });
    // }
    // else{
    //     this.setState({
    //         L:"",
    //         W:"",
    //         H:"",
    //     });
    // }
    this.onFormChange(e);
  };

  onTimeChange = (el) => {
    this.setState({ [el.name]: el.value });
  };
  populateSubCat = (key, list, stateKey, title) => {
    this.setState({
      subCategory: this.state.subCategoryStore[key],
      scaffoldSubcategorytitle: "Select Category",
    });
    this.resetThenSet(key, list, stateKey, title);
  };

  submitRequest = (status) => {
    const { dispatch } = this.props;

    const formValidation = this.validateForm();
    if (formValidation == true) {
      this.addListToItem();

      this.state.requestCode = 21;
      this.state.status = status;
      dispatch(workRequestPost(this.state));
      toast.success("Work Request Updated Successfully", { autoClose: 3000 });

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
    return true;
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

  validateManpowerForm = () => {
    if (typeof this.state.safety === "undefined" || this.state.safety == "") {
      toast.error("Safety can't be empty", { autoClose: 3000 });
      return false;
    }
    if (
      typeof this.state.supervisor === "undefined" ||
      this.state.supervisor == ""
    ) {
      toast.error("Supervisor can't be empty", { autoClose: 3000 });
      return false;
    }
    if (
      typeof this.state.erectors === "undefined" ||
      this.state.erectors == ""
    ) {
      toast.error("Erectors can't be empty", { autoClose: 3000 });
      return false;
    }
    if (
      typeof this.state.gworkers === "undefined" ||
      this.state.gworkers == ""
    ) {
      toast.error("Go workers can't be empty", { autoClose: 3000 });
      return false;
    }
    return true;
  };

  goBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  addListToItem = () => {
    this.itemList = this.itemList.filter(
      (el) => el.value_item !== this.state.value_item
    );

    if (this.state.value_item != "") {
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
              resetThenSet={this.onChangeItem}
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
        
        {this.state.cType == 1 && (
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
        )}
        <br />
        <br />
        {this.state.contracts.length > 0 && (
          <div className="orginalContract">
            <div className="row">
              <div className="col-xs-6">
                <label>Items</label>
                <Dropdown
                  title={this.state.itemTitle}
                  name="item"
                  keyName="id"
                  stateId="item"
                  value={this.state.value_item}
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
              <span className="col-xs-3">Full Size</span>
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
              <span className="col-xs-3">Partial Size</span>
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
                  title={this.state.workRequestTitle}
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
              {this.state.drawingImage && (
                <div className="col-sm-12">
                 <Grid>
                  <Grid.Row columns={8}>
                      <Grid.Column >
                        <Image src={this.state.drawingImage} onClick={this.click} />
                      </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            )}
            </div>
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
            sizeList = {this.state.sizeList}
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
        <div className="row">
          <div className="col-xs-3">Scaffold Register</div>
          <div className="col-xs-6">
            {" "}
            <input
              type="checkbox"
              name="scaffoldRegister"
              checked={this.state.scaffoldRegister == 1}
              onClick={this.onCheckBoxChecked}
            />
          </div>
        </div>

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
        {this.state.completionImages && this.state.completionImages.length > 0 ? (
                  <div className="completionImage">
                            <div className="row">
                                              <div className="col-sm-6">
                                <label>Images:</label>
                              </div>
                              <div className="col-sm-6">
                                  <input
                                  type="file"
                                  id="completionImage"
                                  name="completionImage"
                                  multiple
                                  onChange={this.multiplefileupload}
                                />
                              </div>
                              {/* {this.state.completionImages && this.state.completionImages.length > 0 ? (
                            <div className="col-sm-12">
                                  {this.state.completionImages.map((_x,index) => (
                                      <div key={index} class="image" id="image2" style="background-image:url({_x});">
                                      <a href="#" class="delete">Delete</a>
                                    </div>
                                  ))}
                            </div>
                          ) : (
                            ""
                          )} */}

     {this.state.completionImages && this.state.completionImages.length > 0 ? (
              <div className="col-sm-12">
                <Grid>
                  <Grid.Row columns={8}>
                    {this.state.completionImages.map((_x) => (
                      <Grid.Column >
                        <Image src={_x} onClick={this.click} />
                      </Grid.Column>
                    ))}
                  </Grid.Row>
                </Grid>
              </div>
            ) : (
              ""
            )}
              </div>
              </div>
            ) : (
              ""
            )}
        <div className="row">
          <div className="col-12">
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

            {this.state.userType == "1" && (
              <div className="col-sm-3">
                <CustomButton
                  bsStyle="primary"
                  id="draft"
                  type="submit"
                  onClick={() => this.submitRequest(this.state.status)}
                >
                  Update
                </CustomButton>{" "}
              </div>
            )}

            {this.state.status == 2 && (
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
            )}
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
            <WorkRequestPreview curState={this.state} images={[]} submitBefore={0} />
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

export default WorkRequestEdit;
