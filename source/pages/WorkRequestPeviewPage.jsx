/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import WorkRequestPreview from "../components/WorkRequestPreview";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  workRequestPost,
} from "actions/workArrangement.actions";
import { getDetailsWithMatchedKey2 } from "../common/utility";
import CustomButton from "../components/CustomButton";
import { CONTEXT } from "../config/api-config";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class WorkRequestPreviewPage extends React.Component {
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
      images: [],
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
      this.state.listingno=sessionStorage.getItem("wrstr");
      this.state.requestCode = 16;
      dispatch(workRequestPost(this.state));
    }
  }
  componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
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
      // this.setState()
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
      let images = [];
      if (
        nextProps.workRequestData &&
        nextProps.workRequestData.requestDetails.completionImages &&
        typeof nextProps.workRequestData.requestDetails.completionImages !==
          "undefined"
      ) {
        images = nextProps.workRequestData.requestDetails.completionImages;
      }
      this.setState({
        images: images,
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
        drawingImage: requestDet.drawingImage
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
  edit = () => {
    this.props.history.push(`/WorkRequest/${this.props.match.params.id}`);
  };

  /* Render */
  render() {
    const { userType } = this.props;

    return (
      <div>
        <br />
        {userType == 1 ? (
          <div className="row">
            <div className="col-xs-6">
              <br />
              <CustomButton
                bsStyle="primary"
                id="draft"
                type="submit"
                onClick={() => this.edit(1)}
              >
                Edit
              </CustomButton>
            </div>
            <div className="col-xs-6"> &nbsp;</div>
          </div>
        ) : userType == 5 ? (
          <div className="row">
            <div className="col-xs-6">
              <br />
              <CustomButton
                bsStyle="primary"
                id="draft"
                type="submit"
                onClick={() => this.edit(1)}
              >
                Edit
              </CustomButton>
            </div>
            <div className="col-xs-6"> &nbsp;</div>
          </div>
        ) : ""}
        <div className="row">
          <div className="col-xs-6">
            <br />
            <CustomButton bsStyle="secondary">
              <a
                href={`${CONTEXT}/workrequestpdf.php?workrequestid=${this.state.listingId}&workrequstNumber=${this.state.listingno}`}
                target="_blank"
              >
                {" "}
                preview{" "}
              </a>
            </CustomButton>
          </div>
          <div className="col-xs-6"> &nbsp;</div>
        </div>

        <br />
        <WorkRequestPreview curState={this.state} images={this.state.images} submitBefore={1} />
        <br />
      </div>
    );
  }
}

export default WorkRequestPreviewPage;
