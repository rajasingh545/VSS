import React from "react";
import { connect } from "react-redux";
import PreviewTemplate from "../components/PreviewTemplate";
import Dropdown from "../components/Dropdown";
import { DOMAIN_NAME } from "../config/api-config";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  requestPost,
  requestPostClear,
  listigDetails,
  clearListing,
} from "actions/workArrangement.actions";
import CustomButton from "../components/CustomButton";
import { getDetailsWithLib2, addDays } from "../common/utility";

import DatePicker from "react-datepicker";
import moment from "moment";
import { Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
export default class WorkArrangementList extends React.Component {
  constructor(props) {
    super(props);
    let arr = [];
    arr[0] = { id: "1", name: "Submitted" };
    arr[1] = { id: "2", name: "Draft" };

    this.state = {
      requestCode: 2,
      requestStatus: 2,
      projectId: "",
      options: arr,
      startDate1: moment(),
      show: false,
      modalCont: "",
      requestTypeTitle: "Select Status",
      selectAll: false,
    };

    this.selectedIds = [];
  }
  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(requestPostClear());
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
    //  if(!this.props.requestDet){
    dispatch(requestDetails(this.state));
    //  }
  }
  componentWillReceiveProps(nextProps) {
    const { requestDet } = nextProps;
    this.setState({ listingDetails: nextProps.listingDetails });
    this.setState({ requestDet: requestDet });
  }
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(clearListing());
  }
  componentDidMount() {
    this.getlist();
  }
  getlist = () => {
    let requestType = sessionStorage.getItem("requestType");
    let requestTypeTitle = sessionStorage.getItem("requestTypeTitle");
    let selectedDate = moment();
    if (sessionStorage.getItem("dateSelected")) {
      selectedDate = sessionStorage.getItem("dateSelected");
    }

    let dateSelected = moment(selectedDate);
    let actualDate = dateSelected.format("YYYY/MM/DD");
    if (requestType) {
      // console.log("dateSelected",dateSelected.format("YYYY/MM/DD"));
      this.setState({
        requestType,
        requestTypeTitle,
        startDate1: dateSelected,
      });
      this.state.startDate = actualDate;
      this.handleRequestType(requestType, [], "", requestTypeTitle);
    }
  };
  redirectView = (requestId) => {
    if (this.props.userType == 1) {
      // this.props.history.push("/WorkArrangment/" + requestId);
      this.props.history.push({
        pathname: "/WorkArrangment/" + requestId,
        state: {
          ["requestType_Title"]:
            this.state.requestType == 1 ? "Submitted" : "Draft",
        },
      });
    }
  };

  Listings = (listings) => {
    let { listingDetails, requestDet } = this.props;
    let response = "";
    let requestDetails = {};
    // console.log("requestDet ==>", listings);
    if (listingDetails && listingDetails.length > 0) {
      response = listings.map((data, index) => {
        if (this.state.requestDet)
          requestDetails = getDetailsWithLib2(data, this.state.requestDet);
        // console.log(requestDetails);

        let checkBox = true;
        // if (this.state.requestType == 1 || this.props.userType == 5) {
        //   checkBox = false;
        // }

        let elmId = "elm_" + requestDetails.workArrangementId;
        // console.log(requestDetails);

        return (
          <div
            className="row Listing1 hrline hoverColor"
            style={{ cursor: "pointer" }}
            key={data.workArrangementId}
          >
            <PreviewTemplate
              detailsArr={requestDetails}
              list={checkBox}
              checkBoxChecked={this.state.selectAll}
              onCheckBoxClickCallBack={this.onCheckBoxClickCallBack}
              elementId={elmId}
              onClickList={() => this.redirectView(data.workArrangementId)}
              userType={this.props.userType}
            />
          </div>
        );
      });
    } else {
      response = (
        <div
          style={{
            color: "red",
            width: "80%",
            textAlign: "center",
            textWeight: "bold",
            paddingTop: "100px",
          }}
        >
          No Listings Found
        </div>
      );
    }
    return response;
  };
  onCheckBoxClickCallBack = (id, checked) => {
    if (checked === true) {
      this.selectedIds.push(id);
    } else {
      this.setState({ selectAll: false });
      let index = this.selectedIds.indexOf(id);
      this.selectedIds.splice(index, 1);
    }

    if (this.selectedIds.length > 0) {
      this.setState({ showSubButton: true });
    } else {
      this.setState({ showSubButton: false });
    }
  };
  onStartDateChange = (e) => {
    const { dispatch, userType } = this.props;
    if (e != null) {
      this.setState({
        startDate: e.format("YYYY/MM/DD"),
        startDate1: e,
      });
      sessionStorage.setItem("dateSelected", e.format("YYYY/MM/DD"));
    } else {
      this.setState({
        startDate: "",
        startDate1: "",
      });
    }
    this.state.startDate = e.format("YYYY/MM/DD");

    if (userType != 1) {
      this.handleRequestType(1, [], {}, "Submitted");
    } else {
      if (this.state.requestType) {
        dispatch(listigDetails(this.state));
      }
    }
  };
  setPreview = () => {
    let contArr = [];
    this.selectedIds.map((ind) => {
      contArr.push(document.getElementById("elm_" + ind).innerHTML + "<br />");
    });
    this.setState({ show: true, modalCont: contArr.join("") });
  };
  onDelete = (Ids) => {
    const { dispatch } = this.props;
    if (this.state.requestType == 2) {
      this.setState(
        {
          requestCode: 16,
          deleteWorkArrangementIds: Ids,
        },
        () => {
          dispatch(requestPost(this.state));
        }
      );
    } else if (this.state.requestType == 1) {
      this.setState(
        {
          requestCode: 17,
          deleteWorkArrangementIds: Ids,
        },
        () => {
          dispatch(requestPost(this.state));
        }
      );
    }
  };

  handleRequestType = (key, list, stateKey, title) => {
    const { dispatch, userType, userId } = this.props;

    this.state.requestType = key;
    this.state.requestCode = 2;
    this.state.userType = userType;
    this.state.userId = userId;
    sessionStorage.setItem("requestType", key);
    sessionStorage.setItem("requestTypeTitle", title);
    this.setState({
      showSubButton: false,
    });
    this.selectedIds = [];
    // console.log("this.state", this.state)
    dispatch(listigDetails(this.state));
  };

  setProjectId = (e) => {
    this.state.projectId = e.target.value;
    this.setState({ cboProjects: "0", listingDetails: {} });
  };
  handleClose = () => {
    this.setState({ show: false });
    //this.setState({show:false, value_projects:"", value_supervisors:"", value_supervisors2:""});
  };
  handleSubmit = () => {
    const { dispatch } = this.props;
    this.handleClose();
    let param = {};
    param.requestCode = 4;
    param.ids = this.selectedIds;
    dispatch(requestPost(param));
    toast.success("Updated Successfully", { autoClose: 2000 });
    this.setState({ showSubButton: false });
    setTimeout(() => {
      this.getlist();
    }, 2000);
  };

  handleSelectAll = (e) => {
    if (e.target.checked) {
      this.setState({ selectAll: true });
      this.state.listingDetails.map((item) => {
        this.onCheckBoxClickCallBack(item.workArrangementId, true);
      });
    } else {
      this.setState({ selectAll: false });
      this.state.listingDetails.map((item) => {
        this.onCheckBoxClickCallBack(item.workArrangementId, false);
      });
    }
  };
  render() {
    const { userType, requestDet } = this.props;
    const { listingDetails, requestType } = this.state;
    // console.log("options", options);
    const { loading } = this.props;
    let loadingurl = DOMAIN_NAME + "/assets/img/loading.gif";
    // console.log(this.state.requestType);

    return (
      <div>
        <ToastContainer autoClose={8000} />
        <br />
        {this.props.userType != 1 && (
          <div className="row">
            <div className="col-xs-8">
              <DatePicker
                selected={this.state.startDate1}
                className=" form-control"
                isClearable={false}
                minDate={new Date()}
                maxDate={userType != "1" ? addDays(new Date(), 1) : ""}
                onChange={this.onStartDateChange}
                name="startDate"
                dateFormat="DD-MM-YYYY"
                locale="UTC"
              />
            </div>
            <div className="col-xs-2">&nbsp;</div>
          </div>
        )}
        {this.props.userType == 1 && (
          <div className="row">
            <div className="col-xs-8">
              <DatePicker
                selected={this.state.startDate1}
                className=" form-control"
                isClearable={false}
                minDate={new Date()}
                maxDate={userType != "1" ? addDays(new Date(), 1) : ""}
                onChange={this.onStartDateChange}
                name="startDate"
                dateFormat="DD-MM-YYYY"
                locale="UTC"
              />
            </div>
            <div className="col-xs-2">&nbsp;</div>
          </div>
        )}
        {this.props.userType == 1 && (
          <div className="row">
            <div className="col-xs-8">
              <Dropdown
                title={this.state.requestTypeTitle}
                name="name"
                keyName="id"
                stateId="status"
                list={this.state.options}
                value={requestType}
                resetThenSet={this.handleRequestType}
              />
            </div>
            <div className="col-xs-2">&nbsp;</div>
          </div>
        )}

        <div className="padding15" id="divRequestListing">
          {
            //this.state.requestType == 2 &&
            this.props.userType == 1 &&
              listingDetails &&
              listingDetails.length > 0 && (
                <div className="row" style={{ paddingLeft: "17px" }}>
                  <input
                    type="checkbox"
                    checked={this.state.selectAll}
                    name="select"
                    onClick={this.handleSelectAll}
                  />{" "}
                  <strong>Select All</strong>
                </div>
              )
          }

          {loading == true && (
            <div className="center-div">
              <img src={loadingurl} />
            </div>
          )}
          {listingDetails && loading == false && this.Listings(listingDetails)}
        </div>
        <div>
          {this.state.showSubButton && (
            <div className="col-sm-3">
              <br />{" "}
              <CustomButton
                bsStyle="warning"
                id="submit"
                type="submit"
                onClick={() => this.setPreview()}
              >
                Preview
              </CustomButton>
            </div>
          )}
          {this.state.showSubButton && (
            <div className="col-sm-3">
              <br />{" "}
              <CustomButton
                bsStyle="danger"
                id="delete"
                type="delete"
                onClick={() => this.onDelete(this.selectedIds)}
              >
                Delete
              </CustomButton>
            </div>
          )}
        </div>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <strong>Preview</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div
              id="showContent"
              dangerouslySetInnerHTML={{ __html: this.state.modalCont }}
            ></div>
          </Modal.Body>
          <Modal.Footer>
            <div className="col-sm-3">
              {" "}
              <CustomButton bsStyle="primary" onClick={this.handleSubmit}>
                Submit
              </CustomButton>
            </div>
            <div className="col-sm-3">
              {" "}
              <CustomButton bsStyle="secondary" onClick={this.handleClose}>
                Close
              </CustomButton>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
