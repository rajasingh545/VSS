/* Module dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import DailyWorkTrackPreview from "../common/DailyWorkTrackPreview";
import CustInput from '../common/CustInput';
import baseHOC from "./baseHoc";
import TimeField from '../common/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
import { requestDetails, requestPost, workRequestPost, listigDetails, clearListing } from 'actions/workArrangement.actions';
import {Modal} from 'react-bootstrap';
import { getDetailsWithMatchedKey2} from '../common/utility';
import * as API from "../config/api-config";
@connect(state => ({
    loading: state.request.get('loadingListing'),
    listingDetails: state.request.get('listingDetails'),
    workRequestData: state.request.get('workRequestData'),
    requestDet: state.request.get('requestDet'),
  }))
  @baseHOC
class DWTRPreview extends React.Component {

  constructor(props) {
    super(props);
   this.state ={
    project: [],
    clients:[],
    team:[],
    projectTitle : "Select Project",
    clientTitle : "Select Client",
    divisionTitle : "Select Sub Division",
    statusTitle : "Select Status",
    teamtitle : "Select Team",
    materialstitle : "Select Materials",
    supervisorTitle : "Select Supervisor",
    itemtitle:"Select Item",
    scaffoldTypetitle : "Select Type",
    scaffoldWorkTypetitle : "Select Work Type",
    scaffoldSubcategorytitle : "Select Category",
    WRNOTitle : "Select WR #",
    value_workstatus: 0,
    workRequests : [],
    items : [],
    subItem:[],
    filteredArr : [],
    scaffoldWorkType : [],
    scaffoldType:[],
    itemList:[],
    teamList:[],
    materialList:[],
    workStatus:[{
        id:"1",
        value:"Ongoing"
    },
    {
        id:"2",
        value:"Completed"
    },
    {
        id:"3",
        value:"Full Size"
    }
    ],
    materials:[{
        id:"1",
        value:"H.Keeping"
    },
    {
        id:"2",
        value:"M.Shifting"
    },
    {
        id:"3",
        value:"Prod. Hrs"
    }
    ]
   };
   this.teamList = [];
   this.materialList = [];
  this.itemList = [];
  }
  componentWillMount(){
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
     dispatch(requestDetails(this.state));
     if(this.props.match.params && this.props.match.params.id){
        this.state.listingId = this.props.match.params.id;     
        this.state.requestCode = 19;
        dispatch(workRequestPost(this.state));
       }
    
  }
  componentWillReceiveProps(nextProps){
  
    if(nextProps.requestDet && nextProps.requestDet.supervisors){
        this.setState({supervisors:nextProps.requestDet.supervisors});
        this.setState({value_supervisors:"", text_supervisors:"Select Supervisor"});

    }
    if(nextProps.requestDet && nextProps.requestDet.projects){
        this.state.projects = nextProps.requestDet.projects;
        this.state.clients = nextProps.requestDet.clients;
        this.state.team = nextProps.requestDet.team;
        this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
        this.state.scaffoldType = nextProps.requestDet.scaffoldType;
        this.state.supervisors= nextProps.requestDet.supervisorsList;
        
    }
    if(nextProps.requestDet && nextProps.requestDet.workRequests){
        this.setState({workRequests:nextProps.requestDet.workRequests});
        this.setState({items:nextProps.requestDet.items});
        // this.setState()

        let requestDet = this.props.workRequestData.requestDetails;
        let requestItemsArr = this.props.workRequestData.requestItems;
        let requestItems = requestItemsArr[requestItemsArr.length-1];
        let itemTitle = "Select WR #";
        let subdivisionTitle = "Select Sub Division";
        let  subdivisiontype = "";
        let subitem = nextProps.requestDet.items[requestDet.workRequestId];
        if(requestDet.type == 1){
            
            itemTitle = getDetailsWithMatchedKey2(requestDet.workRequestId, this.state.workRequests, "workRequestId", "workRequestId");
            subdivisionTitle = getDetailsWithMatchedKey2(requestItems.subDivisionId, subitem, "itemId", "itemName");
            subdivisiontype = getDetailsWithMatchedKey2(requestItems.subDivisionId, subitem, "itemId", "type");
            }
           
            
            this.setState({
                divisionTitle : subdivisionTitle,
                value_wrno:requestDet.workRequestId,
                WRNOTitle :  requestDet.workRequestStrId,
                text_item:itemTitle,
                subItem:subitem,
                text_location:subdivisionTitle,
                workType:subdivisiontype
            });
            requestItemsArr = this.populateItemText(requestItemsArr, requestDet);
            this.itemList = requestItemsArr;
            this.state.itemList = requestItemsArr;
    }else if(nextProps.workRequestData && nextProps.workRequestData.requestDetails){
       
        let requestDet = nextProps.workRequestData.requestDetails;
        let requestItemsArr = nextProps.workRequestData.requestItems;
        let requestMatlistArr = (nextProps.workRequestData.requestMatList) ? nextProps.workRequestData.requestMatList : [];
        let requestSizeListArr = (nextProps.workRequestData.requestSizeList) ? nextProps.workRequestData.requestSizeList : [];
        let requestItems = requestItemsArr;
        let requestMatlist = requestMatlistArr;
        let requestSizeList = requestSizeListArr;
       
       
        if(requestItemsArr){           
            requestItems = requestItemsArr[requestItemsArr.length-1];
            if(requestMatlistArr){
                requestMatlist = requestMatlistArr[requestMatlistArr.length-1];
            }
            if(requestSizeList){
                requestSizeList = requestSizeListArr[requestSizeListArr.length-1];
            }
            
        }      
      
        let proTitle = getDetailsWithMatchedKey2(requestDet.projectId, this.state.projects, "projectId", "projectName");
        let clientname = getDetailsWithMatchedKey2(requestDet.clientId, this.state.clients, "clientId", "clientName");
        let supervisorName = getDetailsWithMatchedKey2(requestDet.supervisor, this.state.supervisors, "userId", "Name");
        let baseSupervisor = getDetailsWithMatchedKey2(requestDet.baseSupervisor, this.state.supervisors, "userId", "Name");
        let statusTitle =  getDetailsWithMatchedKey2(requestItems.status, this.state.workStatus, "id", "value");
        let teamTitle =  getDetailsWithMatchedKey2(requestSizeList.teamId, this.state.team, "teamid", "teamName");
        let materialTitle =  getDetailsWithMatchedKey2(requestMatlist.material, this.state.materials, "id", "value");
        this.setState({
            projectTitle:proTitle,
            clientTitle:clientname,           
            cType:requestDet.type,
            value_projects:requestDet.projectId,
            value_clients:requestDet.clientId,
            text_projects:proTitle,
            text_clients:clientname,
            requestBy:requestDet.requestedBy,
            value_item: requestItems.itemId,
            sizeType: requestItems.sizeType,
            value_supervisor:requestDet.supervisor,
            value_wrno:requestDet.workRequestId,
            supervisorTitle : supervisorName,
            text_supervisor : supervisorName,
            text_basesupervisor : baseSupervisor,
            text_wrno:requestDet.workRequestId,
            L:requestItems.length,
            H:requestItems.height,
            W:requestItems.width,
            set:requestItems.setcount,
            cL:requestItems.cLength,
            cH:requestItems.cHeight,
            cW:requestItems.cWidth,
            cset:requestItems.cSetcount,
            value_workstatus:requestItems.status,
            timing:requestItems.timing,
            inTime : requestSizeList.inTime,
            outTime: requestSizeList.outTime,
            statusTitle : statusTitle,
            teamtitle:teamTitle,
            materialstitle:materialTitle,
            value_materials:requestMatlist.material,
            workerCount : requestSizeList.workerCount,
            mWorkerCount : requestMatlist.workerCount,
            value_team : requestSizeList.teamId,
            minTime : requestMatlist.inTime,
            moutTime: requestMatlist.outTime,
            remarks:requestDet.remarks,
            matMisuse:requestDet.matMisuse,
            matmisueremarks:requestDet.matRemarks,
            safetyvio:requestDet.safetyVio,
            safetyvioremarks:requestDet.safetyRemarks,
            photo_1:requestDet.photo_1,
            photo_2:requestDet.photo_2,
            photo_3:requestDet.photo_3,
            safetyPhoto:requestDet.safetyPhoto,
            matPhotos:requestDet.matPhotos,
            uniqueId:requestDet.uniqueId           

        });
        if(requestDet.type == 1){
            this.state.value_projects = requestDet.projectId;
            this.state.value_clients = requestDet.clientId;
            this.state.cType = requestDet.type;
           
            this.requestItems();
        }
        // console.log("==",requestItemsArr);

       
       requestMatlistArr = this.populateMaterialText(requestMatlistArr);
        requestSizeListArr = this.populateTeamText(requestSizeListArr);
        
        this.itemList = requestItemsArr;
        this.materialList = requestMatlistArr;
        this.sizeList = requestSizeListArr;
        this.teamList = requestSizeListArr;
        this.state.itemList = requestItemsArr;
        this.state.manpowerList = requestMatlistArr;
        this.state.materialList = requestMatlistArr;
        this.state.sizeList = requestSizeListArr;
        this.state.teamList = requestSizeListArr;

      
    }
}
populateItemText = (requestItemsArr, requestDet) =>{
    

    let items =[];
    if(this.props.requestDet && this.props.requestDet.items){
        
        requestItemsArr.map((item)=>{
            let subitem = this.props.requestDet.items[requestDet.workRequestId];
            let subdivisionTitle = getDetailsWithMatchedKey2(item.subDivisionId, subitem, "itemId", "itemName");
            let statusTitle =  getDetailsWithMatchedKey2(item.status, this.state.workStatus, "id", "value");
            // let subdivisiontype = getDetailsWithMatchedKey2(item.subDivisionId, subitem, "itemId", "type");

            let obj = {
                ...item,
                text_subdivision:subdivisionTitle, 
                text_workstatus:statusTitle,
                H:item.height,
                W:item.width,
                L:item.length,
                set:item.setcount
            }
            items.push(obj);
            
        });
    }
    
    return items;
}

populateMaterialText = (requestMatlistArr, subitem) =>{
    let items =[];
    requestMatlistArr.map((item)=>{
        let materialTitle =  getDetailsWithMatchedKey2(item.material, this.state.materials, "id", "value");
        // subdivisionTitle = getDetailsWithMatchedKey2(item.subDevisionId, subitem, "itemId", "itemName");
        let obj = {
            ...item,
            text_materials:materialTitle,
            minTime:item.inTime,
            moutTime:item.outTime,
            mWorkerCount:item.workerCount,
            value_materials:item.material,
            value_subdivision2 : item.subDevisionId,
            // text_subdivision2 : subdivisionTitle
        }
        items.push(obj);
        
    });
// console.log("matitems", items);
    
    return items;
    

}
populateTeamText= (requestSizeListArr) =>{
    let items =[];
        requestSizeListArr.map((item)=>{
            let teamTitle =  getDetailsWithMatchedKey2(item.teamId, this.state.team, "teamid", "teamName");
            // subdivisionTitle = getDetailsWithMatchedKey2(item.subDevisionId, subitem, "itemId", "itemName");
            let obj = {
                ...item,
                text_team:teamTitle,
                value_team :item.teamId,
                value_subdivision2 : item.subDevisionId,
                // text_subdivision2 : subdivisionTitle
            }
           
            items.push(obj);
            
        });
        
    
    return items;
}

requestItems = ()=>{
    const { dispatch } = this.props;
   
       if(this.state.value_projects && this.state.value_clients && this.state.cType == 1){        
        this.state.requestCode = 6;
        dispatch(requestDetails(this.state));
      }
   
  }



  
  /* Render */
  render() {
    const {headerTitle} = this.state;
    
    // console.log("==",this.state.scaffoldworktypetitle, this.state.scaffoldtypetitle,this.state.scaffoldcategorytitle);
    console.log("state==",this.state);
    
    return (
    <div className="container work-arr-container">
    
   
          <DailyWorkTrackPreview curState={this.state} userType={this.props.userType} history={this.props.history} />
           
          
        
    </div>
    
    );
  }
}



export default DWTRPreview;
