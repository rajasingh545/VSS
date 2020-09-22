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
import * as API from "../config/api-config";
import ManpowerDWTR from "../components/ManpowerDWTR";
import MaterialDWTR from "../components/MaterialDWTR";
import WorkRequestDWTR from "../components/WorkRequestDWTR";
import Popup from "../components/Popup";
import TeamPreview from "../components/TeamPreview";
import MaterialPreview from "../components/MaterialPreview";
import WorkRequestDWTRPreview from "../components/WorkRequestDWTRPreview";
import { useColumnOrder } from "react-table";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestPost: state.request.get("workRequestPost"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class DailyWorkTrack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      clients: [],
      team: [],
      projectTitle: "Select Project",
      basesupervisorTitle: "Select Supervisor",
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
      value_workstatus: 0,
      workRequests: [],
      items: [],
      subItem: [],
      filteredArr: [],
      scaffoldWorkType: [],
      scaffoldType: [],
      itemList: [],
      teamList: [],
      materialList: [],
      diffSubDivition: [],
      images: [],
      fieldSupervisors: [],
      basesupervisor: [],
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
      images: [],
      imageUrls: [],
      message: "",
      uploads: [],
      uniqueId: Date.now(),
      desc: "",
      requestByName: "",
      showManpowerPopup: false,
      selectedWRId: 0,
      imagePush: [1],
      isLoading: false,
    };

    this.teamList = [];
    this.materialList = [];
    this.itemList = [];
    this.images = [];
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  componentWillMount() {
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    dispatch(requestDetails(this.state));
  }
  componentWillReceiveProps(nextProps) {
    // if (
    //   nextProps.requestDet &&
    //   nextProps.requestDet.assignedbasesupervisors == "yes"
    // ) {
    //   this.setState({ show1: true });
    // }
    if (nextProps.requestDet && nextProps.requestDet.projects) {
      this.state.projects = nextProps.requestDet.projects;
      this.state.clients = nextProps.requestDet.clients;
      this.state.team = nextProps.requestDet.team;
      this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
      this.state.scaffoldType = nextProps.requestDet.scaffoldType;
      this.state.supervisors = nextProps.requestDet.supervisorsList;
      this.state.fieldSupervisors = nextProps.requestDet.supervisorsList;
    }
    if (nextProps.requestDet && nextProps.requestDet.workRequests) {
      this.setState({ workRequests: nextProps.requestDet.workRequests });
      this.setState({ basesupervisor: nextProps.requestDet.basesupervisor });
      // let subitem = nextProps.requestDet.items[nextProps.requestDet.workRequests.workRequestId];
      this.setState({ items: nextProps.requestDet.items });

      // this.setState()
      if (nextProps.requestDet.workRequests.length == 0) {
        toast.error("No work requests available for this project and client", {
          autoClose: 3000,
        });
      }
    }

    if (nextProps.requestDet && nextProps.requestDet.supervisors) {
      this.setState({ supervisors: nextProps.requestDet.supervisors });
      this.setState({ basesupervisor: nextProps.requestDet.basesupervisor });
      this.setState({ fieldSupervisors: nextProps.requestDet.supervisors });
      this.setState({
        value_supervisor: "",
        text_supervisor: "Select Supervisor",
      });
      this.setState({
        basesupervisorTitle: nextProps.requestDet.basesupervisor[0].Name,
      });
      this.callform(
        nextProps.requestDet.basesupervisor[0].userId,
        nextProps.requestDet.basesupervisor,
        "basesupervisor",
        nextProps.requestDet.basesupervisor[0].Name
      );
    }
  }
  selectImages = (event) => {
    const { dispatch } = this.props;
    this.setState({
      isLoading: true,
    });
    this.images[event.target.name] = event.target.files[0];
    this.setState({ images:this.images });
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
    if (json.responsecode == 1) {
      this.setState({ isLoading: false });
      toast.success("Image uploaded Successfully", { autoClose: 3000 });
    } else {
      this.setState({ isLoading: false });
      toast.error(`Error: ${json.response}`, { autoClose: 3000 });
    }
  };

  getSupervisor = (key, list, stateKey, title) => {
    const { dispatch } = this.props;
    this.state.requestCode = 7;
    this.state.projectId = key;
    dispatch(requestDetails(this.state));
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  };
  onFormChange = (e) => {
    if (e) {
      this.setState({ [e.target.name]: e.target.value });
    }
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
    this.setState({
      [stateKey]: list,
    });

    const valuekey = `value_${stateKey}`;
    const textKey = `text_${stateKey}`;
    const titleKey = `${stateKey}title`;

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

    if (formValidation == true) {
      this.state.requestCode = 17;
      this.state.listingstatus = status;

      dispatch(workRequestPost(this.state));

      toast.success("DWTR Created Successfully", { autoClose: 3000 });

      setTimeout(() => {
        this.props.history.push("/DailyWorkTrackList");
      }, 3000);
    }
  };

  validateForm = () => {
    const { photo_1, photo_2, photo_3,photo_4,photo_5,photo_6,photo_7,photo_8,photo_9,photo_10 } = this.state;
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

    if (this.state.cType == 2) {
      if(!photo_1 && !photo_2 && !photo_3 && !photo_4 && !photo_5 && !photo_6 && !photo_7 && !photo_8 && !photo_9 && !photo_10){
        toast.error("upload photo atleast one is required", { autoClose: 3000 });
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

  setPreview = () => {
    console.log("state data",this.state);
    this.setState({ show: true });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handleClose1 = () => {
    this.setState({ show1: false });
  };
  handleClose2 = () => {
    window.location.reload();
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
    this.itemList.push(list);
    this.setState({
      itemList: this.itemList,
      value_wrno: this.itemList[0].wr_no,
    });
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

  itemAddition = () => {
    let arrayData = this.state.imagePush;
    const lastData = arrayData.slice(-1)[0];
    const newCount = lastData + 1;
    if (!arrayData.includes(newCount)) arrayData.push(newCount);
    this.setState({ imagePush: arrayData });
  };

  /* Render */
  render() {
    let { headerTitle, imagePush, isLoading } = this.state;
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
        {/* <div className="row">
        <div className="col-xs-6"><label>Work Request By</label></div>
          <div className="col-xs-6">
          <CustInput type="text" name="requestBy" value={this.state.requestBy} onChange={this.onFormChange} />
          </div>
    </div> */}
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
              list={this.state.basesupervisor}
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
              title={this.state.supervisorTitle}
              name="Name"
              keyName="userId"
              stateId="supervisor"
              reset={this.state.supervisorResetFlag}
              list={this.state.fieldSupervisors}
              resetThenSet={this.callform}
            /> */}
            <DropdownMultiple
              titleHelper="Field Supervisor"
              title="Select Field Supervisor"
              name="Name"
              keyName="userId"
              reset={this.state.supervisorResetFlag}
              stateKey="supervisor"
              headerTitle={headerTitle}
              list={this.state.fieldSupervisors}
              toggleItem={this.toggleSelected}
            />
          </div>
        </div>

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
            {isLoading && (
              <div>
                <p style={{ color: "red", paddingLeft: "15px" }}>
                  Image Loading...
                </p>
              </div>
            )}

            <br />
            {imagePush.length > 0 &&
              this.state.imagePush.map((data, index) => {
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
            {this.state.imagePush.length <= 9 && (
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
        <Modal show={this.state.show1} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Assigned Base Supervisor</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure want to continue?
            {/* <DailyWorkTrackPreview curState={this.state} /> */}
          </Modal.Body>
          <Modal.Footer>
            <CustomButton bsStyle="secondary" onClick={this.handleClose2}>
              No
            </CustomButton>
            <CustomButton bsStyle="primary" onClick={this.handleClose1}>
              Yes
            </CustomButton>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DailyWorkTrack;
