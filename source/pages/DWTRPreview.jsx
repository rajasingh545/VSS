/* Module dependencies */
import React from "react";
import { connect } from "react-redux";
import DailyWorkTrackPreview from "../components/DailyWorkTrackPreview";
import baseHOC from "./baseHoc";
import {
  requestDetails,
  workRequestPost,
} from "actions/workArrangement.actions";
import {
  getDetailsWithMatchedKey2,
  getDetailsWithMatchedKeyObject,
  getFieldSupervisorName,
} from "../common/utility";
import CustomButton from "../components/CustomButton";

@connect((state) => ({
  loading: state.request.get("loadingListing"),
  listingDetails: state.request.get("listingDetails"),
  workRequestData: state.request.get("workRequestData"),
  requestDet: state.request.get("requestDet"),
}))
@baseHOC
class DWTRPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      project: [],
      clients: [],
      team: [],

      workRequests: [],
      items: [],
      subItem: [],
      filteredArr: [],
      scaffoldWorkType: [],
      scaffoldType: [],
      itemList: [],
      teamList: [],
      materialList: [],
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
      let requestItems = requestItemsArr;
      let requestMatlist = requestMatlistArr;
      let requestSizeList = requestSizeListArr;

      if (requestItemsArr) {
        requestItems = requestItemsArr[requestItemsArr.length - 1];
        if (requestMatlistArr) {
          requestMatlist = requestMatlistArr[requestMatlistArr.length - 1];
        }
        if (requestSizeList) {
          requestSizeList = requestSizeListArr[requestSizeListArr.length - 1];
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
      const supervisorName = getFieldSupervisorName(
        requestDet.supervisor,
        this.state.supervisors,
        "userId",
        "Name"
      ).join(", ");
      const baseSupervisor = getDetailsWithMatchedKey2(
        requestDet.baseSupervisor,
        this.state.supervisors,
        "userId",
        "Name"
      );
      this.setState({
        cType: requestDet.type,
        text_projects: proTitle,
        text_clients: clientname,
        supervisorTitle: supervisorName,
        text_supervisor: supervisorName,
        text_basesupervisor: baseSupervisor,
        photo_1: requestDet.photo_1,
        photo_2: requestDet.photo_2,
        photo_3: requestDet.photo_3,
        photo_4: requestDet.photo_4,
        photo_5: requestDet.photo_5,
        photo_6: requestDet.photo_6,
        uniqueId: requestDet.uniqueId,
        remarks: requestDet.remarks,
        matMisuse:requestDet.matMisuse,
        matmisueremarks:requestDet.matRemarks,
        matPhotos:requestDet.matPhotos,
        safetyVio:requestDet.safetyVio,
        safetyvioremarks:requestDet.safetyRemarks,
        safetyPhoto:requestDet.safetyPhoto,

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
          ...item,
          text_wrno: item.WR_text,
          text_subdivision: subdivisionTitle,
          text_workstatus: statusTitle,
          H: item.height,
          W: item.width,
          L: item.length,
          set: item.setcount,
          photo_1: item.photo_1,
          photo_2: item.photo_2,
          photo_3: item.photo_3,
          photo_4: item.photo_4,
          photo_5: item.photo_5,
          photo_6: item.photo_6,
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

      const obj = {
        ...item,
        text_materials: materialTitle,
        minTime: item.inTime,
        moutTime: item.outTime,
        mWorkerCount: item.workerCount,
        value_materials: item.material,
        value_subdivision2: item.subDevisionId,
        text_subdivision: subdivisionTitle,
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

      const obj = {
        ...item,
        text_team: teamTitle,
        value_team: item.teamId,
        value_subdivision2: item.subDevisionId,
        text_subdivision: subdivisionTitle,
      };

      items.push(obj);
    });

    return items;
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

  edit = () => {
    this.props.history.push(`/DailyWorkTrack/${this.state.listingId}`);
  };

  /* Render */
  render() {
    const { userType } = this.props;
    return (
      <div className="container work-arr-container">
       {/* <br />
          <div className="col-sm-6">
            <CustomButton
              bsStyle="primary"
              id="draft"
              type="submit"
              onClick={() => this.edit(1)}
            >
              Edit
            </CustomButton>{" "}
          </div>
        <br />
       <br />*/}

        <DailyWorkTrackPreview
          curState={this.state}
          userType={this.props.userType}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default DWTRPreview;
