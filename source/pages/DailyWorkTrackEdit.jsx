/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import Dropdown from "../components/Dropdown";
import DropdownMultiple from "../components/DropdownMultiple";
import CustomButton from "../components/CustomButton";
import DailyWorkTrackPreview from "../components/DailyWorkTrackPreview";
import CustInput from "../components/CustInput";
import baseHOC from "./baseHoc";
import { ToastContainer, toast } from "react-toastify";
import {
  requestDetails,
  workRequestPost,
} from "actions/workArrangement.actions";
import { Modal } from "react-bootstrap";
import {
  getDetailsWithMatchedKey2,
  getDetailsWithMatchedKeyObject,
} from "../common/utility";
import * as API from "../config/api-config";
import ManpowerDWTR from "../components/ManpowerDWTR";
import MaterialDWTR from "../components/MaterialDWTR";
import WorkRequestDWTR from "../components/WorkRequestDWTR";
import Popup from "../components/Popup";
import TeamPreview from "../components/TeamPreview";
import MaterialPreview from "../components/MaterialPreview";
import WorkRequestDWTRPreview from "../components/WorkRequestDWTRPreview";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class DailyWorkTrackEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      clients: [],
      team: [],
      projectTitle: "Select Project",
      clientTitle: "Select Client",
      divisionTitle: "Select Sub Division",
      statusTitle: "Select Status",
      teamtitle: "Select Team",
      materialstitle: "Select Materials",
      supervisorTitle: "Select Supervisor",
      itemtitle: "Select Item",
      scaffoldTypetitle: "Select Type",
      scaffoldWorkTypetitle: "Select Work Type",
      scaffoldSubcategorytitle: "Select Category",
      WRNOTitle: "Select WR #",
      value_workstatus: 0,
      workRequests: [],
      supervisors: [],
      items: [],
      subItem: [],
      filteredArr: [],
      scaffoldWorkType: [],
      scaffoldType: [],
      itemList: [],
      teamList: [],
      materialList: [],
      uniqueId: Date.now(),
      workStatus: [
        {
          id: "1",
          value: "Ongoing",
        },
        {
          id: "2",
          value: "Completed",
        },
        {
          id: "3",
          value: "Full Size",
        },
      ],
      materials: [
        {
          id: "1",
          value: "H.Keeping",
        },
        {
          id: "2",
          value: "M.Shifting",
        },
        {
          id: "3",
          value: "Prod. Hrs",
        },
      ],
    };
    this.teamList = [];
    this.materialList = [];
    this.itemList = [];
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
    if (this.props.match.params && this.props.match.params.id) {
      this.state.listingId = this.props.match.params.id;
      this.state.requestCode = 19;
      dispatch(workRequestPost(this.state));
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.requestDet && nextProps.requestDet.supervisors) {
      this.setState({ supervisors: nextProps.requestDet.supervisors });
      this.setState({
        value_supervisors: "",
        text_supervisors: "Select Supervisor",
      });
      this.setState({
        value_basesupervisor: "",
        text_basesupervisor: "Select Supervisor",
      });
    } else if (nextProps.requestDet && nextProps.requestDet.supervisorsList) {
      this.state.supervisors = nextProps.requestDet.supervisorsList;
      this.setState({ supervisors: nextProps.requestDet.supervisorsList });
      this.setState({
        value_supervisors: "",
        text_supervisors: "Select Supervisor",
      });
      this.setState({
        value_basesupervisor: "",
        text_basesupervisor: "Select Supervisor",
      });
    }
    if (nextProps.requestDet && nextProps.requestDet.projects) {
      this.state.projects = nextProps.requestDet.projects;
      this.state.clients = nextProps.requestDet.clients;
      this.state.team = nextProps.requestDet.team;
      this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
      this.state.scaffoldType = nextProps.requestDet.scaffoldType;
      this.state.supervisors = nextProps.requestDet.supervisorsList;
    }
    if (nextProps.requestDet && nextProps.requestDet.workRequests) {
      this.setState({ workRequests: nextProps.requestDet.workRequests });
      this.setState({ items: nextProps.requestDet.items });
      // this.setState()

      const requestDet = this.props.workRequestData.requestDetails;
      let requestItemsArr = this.props.workRequestData.requestItems;
      const requestItems = requestItemsArr[requestItemsArr.length - 1];
      let itemTitle = "Select WR #";
      let subdivisionTitle = "Select Sub Division";
      let subdivisiontype = "";
      const subitem = nextProps.requestDet.items[requestDet.workRequestId];
      if (requestDet.type == 1) {
        itemTitle = getDetailsWithMatchedKey2(
          requestDet.workRequestId,
          this.state.workRequests,
          "workRequestId",
          "workRequestId"
        );
        subdivisionTitle = getDetailsWithMatchedKey2(
          requestItems.subDivisionId,
          subitem,
          "itemId",
          "itemName"
        );
        subdivisiontype = getDetailsWithMatchedKey2(
          requestItems.subDivisionId,
          subitem,
          "itemId",
          "type"
        );
      }
      this.setState({
        divisionTitle: subdivisionTitle,
        value_wrno: requestDet.workRequestId,
        WRNOTitle: requestDet.workRequestStrId,
        text_item: itemTitle,
        subItem: subitem,
        text_location: subdivisionTitle,
        workType: subdivisiontype,
      });
      requestItemsArr = this.populateItemText(requestItemsArr, requestDet);

      this.itemList = requestItemsArr;
      this.state.itemList = requestItemsArr;
    } else if (
      nextProps.workRequestData &&
      nextProps.workRequestData.requestDetails
    ) {
      const requestDet = nextProps.workRequestData.requestDetails;
      const requestItemsArr = nextProps.workRequestData.requestItems;
      let requestMatlistArr = nextProps.workRequestData.requestMatList
        ? nextProps.workRequestData.requestMatList
        : [];
      let requestSizeListArr = nextProps.workRequestData.requestSizeList
        ? nextProps.workRequestData.requestSizeList
        : [];

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
      const supervisorName = getDetailsWithMatchedKey2(
        requestDet.supervisor,
        this.state.supervisors,
        "userId",
        "Name"
      );
      const baseSupervisor = getDetailsWithMatchedKey2(
        requestDet.baseSupervisor,
        this.state.supervisors,
        "userId",
        "Name"
      );
      this.FSList(
        requestDet.supervisor,
        this.state.supervisors,
        "userId",
        "Name"
      );

      this.setState({
        projectTitle: proTitle,
        clientTitle: clientname,
        cType: requestDet.type,
        value_projects: requestDet.projectId,
        value_clients: requestDet.clientId,
        text_projects: proTitle,
        text_clients: clientname,
        requestBy: requestDet.requestedBy,
        // value_item: requestItems.itemId,
        // sizeType: requestItems.sizeType,
        value_supervisor: requestDet.supervisor,
        // value_wrno: requestDet.workRequestId,
        supervisorTitle: supervisorName,
        text_supervisor: supervisorName,
        text_basesupervisor: baseSupervisor,
        value_basesupervisor: requestDet.baseSupervisor,
        basesupervisorTitle: baseSupervisor,

        remarks: requestDet.remarks,
        matMisuse: requestDet.matMisuse,
        matmisueremarks: requestDet.matRemarks,
        safetyvio: requestDet.safetyVio,
        safetyvioremarks: requestDet.safetyRemarks,
        disphoto_1: requestDet.photo_1,
        disphoto_2: requestDet.photo_2,
        disphoto_3: requestDet.photo_3,
        disphoto_4: requestDet.photo_4,
        disphoto_5: requestDet.photo_5,
        disphoto_6: requestDet.photo_6,
        safetyPhoto: requestDet.safetyPhoto,
        matPhotos: requestDet.matPhotos,
        status: requestDet.status,
      });
      if (requestDet.type == 1) {
        this.state.value_projects = requestDet.projectId;
        this.state.value_clients = requestDet.clientId;
        this.state.cType = requestDet.type;

        this.requestItems();
      }
      // console.log("==",requestItemsArr);

      setTimeout(() => {
        requestMatlistArr = this.populateMaterialText(
          requestMatlistArr,
          this.state.items
        );
        requestSizeListArr = this.populateTeamText(
          requestSizeListArr,
          this.state.items
        );

        this.itemList = this.populateItemText(requestItemsArr, requestDet);
        this.materialList = requestMatlistArr;
        this.sizeList = requestSizeListArr;
        this.teamList = requestSizeListArr;
        //   this.state.itemList = requestItemsArr;
        this.state.manpowerList = requestMatlistArr;
        this.state.materialList = requestMatlistArr;
        this.state.sizeList = requestSizeListArr;
        this.state.teamList = requestSizeListArr;

        this.setState({ itemList: this.itemList });
        this.setState({ manpowerList: requestMatlistArr });
        this.setState({ teamList: requestSizeListArr });

        //   this.setState({ subItem: this.state.items[requestItemsArr.] });
      }, 1000);
    }
  }
  FSList = (selectedList, list, keyId, keyName) => {
    if (list.length > 0) {
      let selecterFS = [];
      for (let i = 0; i < selectedList.length; i++) {
        const element = selectedList[i];
        list.map((_x) => {
          if (_x.userId == element) {
            _x.selected = true;
            _x.isPartial = false;
            selecterFS.push(_x);
          }
        });
      }
      this.toggleSelected(list, "supervisors", selectedList, selecterFS);
    }
  };
  populateItemText = (requestItemsArr, requestDet) => {
    const items = [];
    if (this.props.requestDet && this.props.requestDet.items) {
      requestItemsArr.map((item) => {
        const subdivisionTitle = getDetailsWithMatchedKeyObject(
          item.subDivisionId,
          this.state.items,
          "itemId",
          "itemName"
        );
        const statusTitle = getDetailsWithMatchedKey2(
          item.status,
          this.state.workStatus,
          "id",
          "value"
        );
        // let subdivisiontype = getDetailsWithMatchedKey2(item.subDivisionId, subitem, "itemId", "type");

        const obj = {
          // ...item,
          text_wrno: item.WR_text,
          text_subdivision: subdivisionTitle,
          value_subdivision: item.subDivisionId,
          text_workstatus: statusTitle,
          H: item.height,
          W: item.width,
          L: item.length,
          set: item.setcount,
          disphoto_1: item.photo_1,
          disphoto_2: item.photo_2,
          disphoto_3: item.photo_3,
          disphoto_4: item.photo_4,
          disphoto_5: item.photo_5,
          disphoto_6: item.photo_6,
        };

        items.push(obj);
      });
    }

    return items;
  };

  populateMaterialText = (requestMatlistArr, subitem) => {
    const items = [];
    requestMatlistArr.map((item) => {
      const materialTitle = getDetailsWithMatchedKey2(
        item.material,
        this.state.materials,
        "id",
        "value"
      );
      const subdivisionTitle = getDetailsWithMatchedKeyObject(
        item.subDevisionId,
        subitem,
        "itemId",
        "itemName"
      );
      const uniqId = Date.now() + Math.random();
      const obj = {
        ...item,
        text_materials: materialTitle,
        minTime: item.inTime,
        moutTime: item.outTime,
        mWorkerCount: item.workerCount,
        value_materials: item.material,
        subdivision: item.subDevisionId,
        text_subdivision: subdivisionTitle,
        uniqueId: uniqId,
      };
      items.push(obj);
    });
    // console.log("matitems", items);

    return items;
  };
  populateTeamText = (requestSizeListArr, subitem) => {
    const items = [];
    requestSizeListArr.map((item) => {
      const teamTitle = getDetailsWithMatchedKey2(
        item.teamId,
        this.state.team,
        "teamid",
        "teamName"
      );
      const subdivisionTitle = getDetailsWithMatchedKeyObject(
        item.subDevisionId,
        subitem,
        "itemId",
        "itemName"
      );
      const uniqId = Date.now() + Math.random();
      const obj = {
        ...item,
        text_team: teamTitle,
        value_team: item.teamId,
        subdivision: item.subDevisionId,
        text_subdivision: subdivisionTitle,
        uniqueId: uniqId,
      };

      items.push(obj);
    });

    return items;
  };

  selectImages = (event) => {
    const { dispatch } = this.props;
    // this.images[event.target.name] = event.target.files[0];
    // this.setState({ images:this.images });
    const ext = event.target.files[0].name.split(".");
    //  console.log("ext", ext);
    const data = new FormData();
    data.append("image", event.target.files[0], event.target.files[0].name);
    data.append("uniqueId", this.state.uniqueId);
    data.append("requestCode", 20);
    data.append("imagefor", event.target.name);
    this.setState({
      [event.target
        .name]: `images/${this.state.uniqueId}/${event.target.name}.${ext[1]}`,
    });

    this.uploadImages(data);
  };

  uploadImages = (obj) => {
    fetch(API.WORKREQUEST_URI, {
      method: "post",
      mode: "cors",
      body: obj,
    })
      .then((response) => response.json())
      .then((json) => this.imageUploadSuccess(json));
  };
  imageUploadSuccess = (json) => {
    // console.log("success", json);
    if (json.responsecode == 1) {
      toast.success("Image uploaded Successfully", { autoClose: 3000 });
    } else {
      toast.error(`Error: ${json.response}`, { autoClose: 3000 });
    }
  };
  onFormChange = (e) => {
    if (e) {
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({ [e.target.name]: e.target.value });
    }
  };
  getSupervisor = (key, list, stateKey, title) => {
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
    dispatch(requestDetails(this.state));
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  };
  callform = (key, list, stateKey, title) => {
    this.resetThenSet(key, list, stateKey, title);
  };
  displayDesc = (key, list, stateKey, title, selectedArr) => {
    this.setState({ desc: selectedArr.desc });

    this.setState({ requestByName: selectedArr.requestBy });
    this.setState({ workType: selectedArr.type });
    this.resetThenSet(key, list, stateKey, title);
  };
  onItemChange = (key, list, stateKey, title) => {
    // console.log(this.state.items, this.state.items[key]);
    this.setState({ subItem: this.state.items[key] });
    this.resetThenSet(key, list, stateKey, title);
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
      this.state.requestCode = 6;
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
      this.setState({
        L: this.state.filteredArr[0].length,
        W: this.state.filteredArr[0].width,
        H: this.state.filteredArr[0].height,
      });
    } else {
      this.setState({
        L: "",
        W: "",
        H: "",
      });
    }
    this.onFormChange(e);
  };

  onTimeChange = (el) => {
    this.setState({ [el.name]: el.value });
  };

  submitRequest = (status) => {
    const { dispatch } = this.props;

    const formValidation = this.validateForm();
    // console.log("validatiing form===", formValidation);
    if (formValidation == true) {
      this.state.itemList.map((_x) => {
        _x.wr_no = this.state.value_wrno;
      });
      this.state.requestCode = 22;
      this.state.listingstatus = status;
      dispatch(workRequestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
      toast.success("DWTR updated Successfully", { autoClose: 3000 });

      setTimeout(() => {
        this.props.history.push("/DailyWorkTrackList");
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
    if (!this.state.cType) {
      toast.error("Please select work type", { autoClose: 3000 });
      return false;
    }

    if (this.state.cType == 1) {
      if (this.itemList.length === 0) {
        toast.error("Please add work request", { autoClose: 3000 });
        return false;
      }
    }

    if (this.state.matMisuse == 1 && !this.state.matPhotos) {
      toast.error("Material misuse photo is required", { autoClose: 3000 });
      return false;
    }
    if (this.state.safetyvio == 1 && !this.state.safetyPhoto) {
      toast.error("Safety photo is required", { autoClose: 3000 });
      return false;
    }

    return true;
  };

  validateTeamForm = () => {
    if (
      (typeof this.state.value_team === "undefined" ||
        this.state.value_team == "") &&
      this.state.teamList.length == 0
    ) {
      toast.error("Please select team", { autoClose: 3000 });
      return false;
    }
    if (
      (typeof this.state.workerCount === "undefined" ||
        this.state.value_scaffoldType == "") &&
      this.state.teamList.length == 0
    ) {
      toast.error("Please enter worker count", { autoClose: 3000 });
      return false;
    }

    return true;
  };

  setPreview = () => {
    this.setState({ show: true });
  };

  handleClose = () => {
    this.setState({ show: false });
  };

  displayManpowerPopup = (workRequestId = 0) => {
    this.setState({ showManpowerPopup: !this.state.showManpowerPopup });
    this.setState({ selectedWRId: workRequestId });
  };

  displayMaterialPopup = (workRequestId = 0) => {
    this.setState({ showMaterialPopup: !this.state.showMaterialPopup });
    this.setState({ selectedWRId: workRequestId });
  };

  addTeam = (teamList) => {
    this.teamList.push(teamList);
    this.setState({ teamList: this.teamList });
    this.displayManpowerPopup();
  };

  addMaterial = (list) => {
    this.materialList.push(list);
    this.setState({ materialList: this.materialList });
    this.displayMaterialPopup();
  };

  deleteTeamItem = (index) => {
    if (this.teamList.length === 1) {
      this.teamList = [];
    } else {
      this.teamList = this.teamList.filter((item) => item.uniqueId !== index);
    }
    this.setState({ teamList: this.teamList });
  };

  deleteMaterialItem = (index) => {
    if (this.materialList.length === 1) {
      this.materialList = [];
    } else {
      this.materialList = this.materialList.filter(
        (item) => item.uniqueId !== index
      );
    }
    this.setState({ materialList: this.materialList });
  };

  displayManpowerList = (teamList) => {
    return teamList.map((item, index) => {
      return (
        <TeamPreview index={index} item={item} onClose={this.deleteTeamItem} />
      );
    });
  };

  displayMaterialList = (data) => {
    return data.map((item, index) => {
      return (
        <MaterialPreview
          index={index}
          item={item}
          onClose={this.deleteMaterialItem}
        />
      );
    });
  };

  displayWorkRequestPopup = () => {
    this.setState({ showWorkRequestPopup: !this.state.showWorkRequestPopup });
  };

  addWorkRequest = (list) => {
    console.log("list======>>>>>", list);

    this.itemList.push(list);
    this.setState({ itemList: this.itemList });
    this.displayWorkRequestPopup();
  };

  deleteWorkRequest = (index, subdivision) => {
    if (this.itemList.length === 1) {
      this.itemList = [];
    } else {
      this.itemList.splice(index, 1);
    }

    this.teamList = this.teamList.filter(
      (item) => item.subdivision !== subdivision
    );
    this.materialList = this.materialList.filter(
      (item) => item.subdivision !== subdivision
    );

    this.setState({ itemList: this.itemList });
    this.setState({ teamList: this.teamList });
    this.setState({ materialList: this.materialList });
  };

  displayWorkRequestList = (data) => {
    return data.map((item, index) => {
      return (
        <WorkRequestDWTRPreview
          index={index}
          item={item}
          onClose={this.deleteWorkRequest}
          teamList={this.state.teamList}
          materialList={this.state.materialList}
          displayManpowerPopup={this.displayManpowerPopup}
          displayMaterialPopup={this.displayMaterialPopup}
          deleteTeamItem={this.deleteTeamItem}
          deleteMaterialItem={this.deleteMaterialItem}
        />
      );
    });
  };
  toggleSelected(list, stateKey, selectedIds, selectedList) {
    // console.log(list, stateKey, selectedIds, selectedList);
    this.setState({
      [stateKey]: list,
    });
  }

  delelteImageAction = (name) => {
    const data = new FormData();
    data.append("requestCode", 26);
    data.append("dwtrId", this.state.listingId);
    data.append("imagefor", name);
    fetch(API.WORKREQUEST_URI, {
        method: "post",
        mode: "cors",
        body: data,
      })
        .then((response) => response.json())
        .then((json) => this.imageDeleteSuccess(json));
  }

  imageDeleteSuccess = (json) => {
    if (json.responsecode == 1) {
     const { dispatch } = this.props;
      this.state.listingId = this.props.match.params.id;
      this.state.requestCode = 19;
      console.log("state",this.state);
      dispatch(workRequestPost(this.state));
      toast.success("Image deleted Successfully", { autoClose: 3000 });
    } else {
      toast.error(`Error: ${json.response}`, { autoClose: 3000 });
    }
  };

  /* Render */
  render() {
    const imgURL = API.CONTEXT;
    let { headerTitle } = this.state;

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
              resetThenSet={this.getSupervisor}
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
            <label>Work Request</label>
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
            <label>Others</label>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <label>Base Supervisor</label>
          </div>
          <div className="col-sm-6">
            <Dropdown
              title={this.state.basesupervisorTitle}
              name="Name"
              keyName="userId"
              stateId="basesupervisor"
              reset={this.state.supervisorResetFlag}
              list={this.state.supervisors}
              resetThenSet={this.callform}
              disabled={true}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label>Field Supervisor</label>
          </div>
          <div className="col-sm-6">
            {/* <Dropdown
              title={ this.state.supervisorTitle }
              name="Name"
              keyName="userId"
              stateId="supervisors"
              reset={ this.state.supervisorResetFlag }
              list={ this.state.supervisors }
              resetThenSet={ this.callform }
            /> */}
            <DropdownMultiple
              titleHelper="Field Supervisor"
              title="Select Field Supervisor"
              name="Name"
              keyName="userId"
              reset={this.state.supervisorResetFlag}
              stateKey="supervisors"
              headerTitle={headerTitle}
              list={this.state.supervisors}
              toggleItem={this.toggleSelected}
            />
          </div>
        </div>

        <br />
        <br />
        <Popup
          show={this.state.showWorkRequestPopup}
          title="Add Work Request"
          handleClose={this.displayWorkRequestPopup}
        >
          <WorkRequestDWTR
            workRequests={this.state.workRequests}
            items={this.state.items}
            workStatus={this.state.workStatus}
            handleClose={this.displayWorkRequestPopup}
            handleSubmit={this.addWorkRequest}
          />
        </Popup>
        {this.state.workRequests.length > 0 && this.state.cType == 1 && (
          <div>
            <div className="row">
              <div className="col-xs-6 strong">Work Request </div>
              <div className="col-xs-6 strong">
                <CustomButton
                  bsStyle="primary"
                  onClick={this.displayWorkRequestPopup}
                >
                  Add Work Request
                </CustomButton>
              </div>
            </div>

            <div className="row ">
              <div className="col-xs-12">
                {this.state.itemList.length > 0 &&
                  this.displayWorkRequestList(this.state.itemList)}
              </div>
            </div>
          </div>
        )}

        <div className=" col-xs-12">&nbsp;</div>
        <br />
        <Popup
          show={this.state.showManpowerPopup}
          title="Add Manpower"
          handleClose={this.displayManpowerPopup}
        >
          <ManpowerDWTR
            team={this.state.team}
            workRequestId={this.state.selectedWRId}
            handleClose={this.displayManpowerPopup}
            handleSubmit={this.addTeam}
          />
        </Popup>

        <Popup
          show={this.state.showMaterialPopup}
          title="Add Material"
          handleClose={this.displayMaterialPopup}
        >
          <MaterialDWTR
            materials={this.state.materials}
            workRequestId={this.state.selectedWRId}
            handleClose={this.displayMaterialPopup}
            handleSubmit={this.addMaterial}
          />
        </Popup>

        {this.state.cType == 2 && (
          <div>
            <div className="row">
              <div className="col-xs-6 strong">Manpower </div>
              <div className="col-xs-6 strong">
                <CustomButton
                  bsStyle="primary"
                  onClick={() => this.displayManpowerPopup(0)}
                >
                  Add Manpower
                </CustomButton>
              </div>
            </div>

            <div className="row ">
              <div className="col-xs-12">
                {this.state.teamList.length > 0 &&
                  this.displayManpowerList(this.state.teamList)}
              </div>
            </div>
            <div className="manPowerSelection">
              <br />
              <br />
              <div className="row">
                <div className="col-xs-6 strong">Material</div>
                <div className="col-xs-6">
                  <CustomButton
                    bsStyle="primary"
                    onClick={() => this.displayMaterialPopup(0)}
                  >
                    Add Material
                  </CustomButton>
                </div>
              </div>
            </div>
            <div className="row ">
              <div className="col-xs-12">
                {this.state.materialList.length > 0 &&
                  this.displayMaterialList(this.state.materialList)}
              </div>
            </div>

            <br />
            {this.state.disphoto_1 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 1:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_1')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_1}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_1}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_1 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 1</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_1"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
            {this.state.disphoto_2 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 2:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_2')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_2}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_2}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_2 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 2</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_2"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
            {this.state.disphoto_3 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 3:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_3')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_3}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_3}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_3 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 3</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_3"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
            {this.state.disphoto_4 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 4:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_4')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_4}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_4}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_4 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 4</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_4"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
            {this.state.disphoto_5 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 5:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_5')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_5}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_5}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_5 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 5</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_5"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
            {this.state.disphoto_6 && (
              <div className="row">
                <div className="col-sm-3">
                  <label>Photo 6:</label>
                </div>
                <div className="col-sm-3">
                  <button onClick={() => this.delelteImageAction('photo_6')}>Remove</button>
                </div>
                <div className="col-sm-6 strong">
                  <a
                    target="_blank"
                    href={`${imgURL}/${this.state.disphoto_6}`}
                  >
                    <img
                      src={`${imgURL}/${this.state.disphoto_6}`}
                      height="100px"
                      width="200px"
                    />
                  </a>
                </div>
              </div>
            )}
            {!this.state.disphoto_6 && (
              <div className="row" style={{ paddingTop: "15px" }}>
                <div className="col-xs-3">Upload Photo 6</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="photo_6"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            )}
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

        <div className="workBasedOn">
          <div className="col-sm-3">Mat.Misuse</div>

          <div className="row">
            <div className="col-xs-1    ">
              <input
                type="radio"
                name="matMisuse"
                value="1"
                onChange={this.onFormChange}
                checked={this.state.matMisuse == "1"}
              />
            </div>
            <div className="col-xs-3">Yes</div>

            <div className="col-xs-1">
              <input
                type="radio"
                name="matMisuse"
                value="2"
                onChange={this.onFormChange}
                checked={this.state.matMisuse == "2"}
              />
            </div>
            <div className="col-xs-3">No</div>
          </div>
          {this.state.matMisuse == 1 && (
            <div>
              <div className="row">
                <div className="col-xs-3">Remarks</div>
                <div className="col-xs-6">
                  {" "}
                  <CustInput
                    type="textarea"
                    name="matmisueremarks"
                    value={this.state.matmisueremarks}
                    onChange={this.onFormChange}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-xs-3">Upload Photo</div>
                <div className="col-xs-6">
                  {" "}
                  <input
                    type="file"
                    name="matPhotos"
                    onChange={this.selectImages}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="workBasedOn">
            <div className="col-sm-3">Safty Vio.</div>

            <div className="row">
              <div className="col-xs-1    ">
                <input
                  type="radio"
                  name="safetyvio"
                  value="1"
                  onChange={this.onFormChange}
                  checked={this.state.safetyvio == "1"}
                />
              </div>
              <div className="col-xs-3">Yes</div>

              <div className="col-xs-1">
                <input
                  type="radio"
                  name="safetyvio"
                  value="2"
                  onChange={this.onFormChange}
                  checked={this.state.safetyvio == "2"}
                />
              </div>
              <div className="col-xs-3">No</div>
            </div>
            {this.state.safetyvio == 1 && (
              <div>
                <div className="row">
                  <div className="col-xs-3">Remarks</div>
                  <div className="col-xs-6">
                    {" "}
                    <CustInput
                      type="textarea"
                      name="safetyvioremarks"
                      value={this.state.safetyvioremarks}
                      onChange={this.onFormChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-3">Upload Photo</div>
                  <div className="col-xs-6">
                    {" "}
                    <input
                      type="file"
                      name="safetyPhoto"
                      onChange={this.selectImages}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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
                onClick={() => this.submitRequest(this.state.status)}
              >
                Update
              </CustomButton>{" "}
            </div>
            {this.state.status == 2 && (
              <div className="col-sm-3">
                <CustomButton
                  bsStyle="primary"
                  id="submit"
                  type="submit"
                  onClick={() => this.submitRequest(1)}
                >
                  Submit
                </CustomButton>{" "}
              </div>
            )}
          </div>
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Preview</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <DailyWorkTrackPreview curState={this.state} />
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

export default DailyWorkTrackEdit;
