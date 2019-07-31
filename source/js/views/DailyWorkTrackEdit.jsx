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
class DailyWorkTrackEdit extends React.Component {

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
        this.setState({value_basesupervisors:"", text_basesupervisors:"Select Supervisor"});
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
                WRNOTitle : requestDet.workRequestStrId,
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
        let baseSupervisor = getDetailsWithMatchedKey2(requestDet.supervisor, this.state.baseSupervisor, "userId", "Name");
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
            basesupervisorTitle : baseSupervisor,
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

selectImages = (event) => {
    const {dispatch} = this.props;
     // this.images[event.target.name] = event.target.files[0];
     // this.setState({ images:this.images });
     let ext = event.target.files[0].name.split(".");
    //  console.log("ext", ext);
     const data = new FormData();
     data.append("image", event.target.files[0], event.target.files[0].name);
     data.append("uniqueId", this.state.uniqueId);
     data.append("requestCode", 20);
     data.append("imagefor", event.target.name);
     this.setState({[event.target.name]:"images/"+this.state.uniqueId+"/"+event.target.name+"."+ext[1]});
 
     this.uploadImages(data);
 }
   
 uploadImages = (obj) => {
     fetch(API.WORKREQUEST_URI, {
         method: 'post',
         mode:'cors',
         body: obj,
       }).then(response =>response.json())
           .then(json => this.imageUploadSuccess(json));
 }
 imageUploadSuccess = (json) =>{
     // console.log("success", json);
     if(json.responsecode == 1){
      toast.success("Image uploaded Successfully", { autoClose: 3000 });  
     }
     else {
         toast.error("Error: "+json.response, { autoClose: 3000 });  
         
     } 
 }
onFormChange = (e) =>{
      
    if(e){
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
}
getSupervisor = (key, list, stateKey, title) =>{
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
     dispatch(requestDetails(this.state));
     this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  }
callform = (key, list, stateKey, title) =>{
    this.resetThenSet(key, list, stateKey, title);
}
displayDesc = (key, list, stateKey, title, selectedArr) =>{
   this.setState({desc:selectedArr.desc});
    
    this.setState({requestByName:selectedArr.requestBy});
     this.setState({workType:selectedArr.type});
    this.resetThenSet(key, list, stateKey, title);
}
onItemChange = (key, list, stateKey, title) =>{
    // console.log(this.state.items, this.state.items[key]);
    this.setState({subItem : this.state.items[key]});
    this.resetThenSet(key, list, stateKey, title);
   
}

resetThenSet(key, list, stateKey, title){
    // let temp = this.state[key];
    // temp.forEach(item => item.selected = false);
    // temp[id].selected = true;
    
    this.setState({
      [stateKey]: list
    });
    
    let valuekey= `value_${stateKey}`;
    let textKey = `text_${stateKey}`;
    let titleKey = `${stateKey}title`;
    //  console.log("inside==", valuekey, key.toString())
    this.setState({
      [valuekey]:key.toString(),
      [textKey]:title
    });
    this.state[valuekey] = key.toString();
    this.state[textKey] = title;

    this.state[titleKey] = title;
  }
  onChangeItem = (key, list, stateKey, title)=>{
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  }
  requestItems = ()=>{
    const { dispatch } = this.props;
   
       if(this.state.value_projects && this.state.value_clients && this.state.cType == 1){        
        this.state.requestCode = 6;
        dispatch(requestDetails(this.state));
      }
   
  }

  onctypeChange = (e) =>{
   
        if(e.target.value == 1){
            this.state.cType = 1;
            this.requestItems();
        }
        else{
            this.setState({contracts:[]});
        }
        this.onFormChange(e);
  }
  onChangeSizeType = (e) => {
    if(e.target.value == 1){
        this.setState({
            L:this.state.filteredArr[0].length,
            W:this.state.filteredArr[0].width,
            H:this.state.filteredArr[0].height,
        });
    }
    else{
        this.setState({
            L:"",
            W:"",
            H:"",
        });
    }
    this.onFormChange(e);
  }

  onTimeChange = (el)=>{  

    this.setState({[el.name] : el.value});
  }

  submitRequest = (status) =>{
    const { dispatch } = this.props;
    
    let formValidation = this.validateForm();
    // console.log("validatiing form===", formValidation);
    if(formValidation == true){

        this.itemAddition(2);
      
      this.state.requestCode = 20;
      this.state.listingstatus = status;
      dispatch(workRequestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
      toast.success("DWTR updated Successfully", { autoClose: 3000 });    
      
        setTimeout(()=>{
            this.props.history.push('/DailyWorkTrackList');
        }, 3000)
    }
  }
  validateForm = () =>{
    
    
    if(!this.state.value_projects){
      toast.error("Project is required", { autoClose: 3000 });       
      return false;
    }
    if(!this.state.value_clients){
      toast.error("Client is required", { autoClose: 3000 });       
      return false;
    }
    
    if(!this.state.requestBy || this.state.requestBy == ""){
      toast.error("Requested by is required", { autoClose: 3000 });       
      return false;
    }
    return true;
  }

  itemAddition = (from=1) =>{
     
    if(this.validateForm() == true){

        //  this.teamAddition(from);
            // this.materialAddition(from);
        const found = this.itemList.some(el => el.value_subdivision === this.state.value_subdivision);
        if (!found){
           
            if(this.state.value_subdivision != ""){
                let list = {
                    value_subdivision: this.state.value_subdivision,
                    text_subdivision: this.state.text_subdivision,                
                    timing: this.state.timing,
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    set:this.state.set,
                    value_workstatus: this.state.value_workstatus,
                    text_workstatus: this.state.text_workstatus,
                    cL:this.state.cL,
                    cH:this.state.cH,
                    cW:this.state.cW,
                    cset:this.state.cset,
                    value_subdivision2: this.state.value_subdivision2,
                    text_subdivision2: this.state.text_subdivision2,
                    // teamList : this.teamList,
                    // materialList : this.materialList
                }

                this.itemList.push(list);
                this.state.itemList = this.itemList;
        }

            // this.state.diffSubDivition.push( {"id": this.state.value_subdivision, "value": this.state.text_subdivision}); 
        }
       
        
        if(from == 1){
            this.setState({
                divisionTitle : "Select Sub Division",
                statusTitle : "Select Status",
                teamtitle : "Select Team",               
                supervisorTitle : "Select Supervisor",
                value_subdivision: "",
                text_subdivision2: "",
                materialstitle : "Select Materials",
                timing: "",
                L:"",
                H:"",
                W:"",
                set:"",
                value_workstatus: "",
                cL:"",
                cH:"",
                cW:"",
                cSet:"",
                value_subdivision2: "",
                // teamList : [],
                // materialList : []
              
            });
            // this.teamList = [];
            // this.materialList = [];
            this.setState({divisionTitle:" Select Sub Division"});
            this.setState({statusTitle :"Select Status"});
            
            toast.success("Work item added successfully", { autoClose: 3000 }); 
        }
    }
  }
  teamAddition = (from=1) =>{
        
    if(this.validateTeamForm() == true){
        console.log("=s=", this.teamList, this.state.value_team);
        const found = this.teamList.some(el => el.value_team === this.state.value_team);
        if (!found){

            if(this.state.value_team != ""){
                let teamList = {
                    value_team: this.state.value_team,
                    text_team: this.state.text_team,
                    workerCount : this.state.workerCount,
                    inTime : this.state.inTime,
                    outTime: this.state.outTime,
                    value_subdivision2: this.state.value_subdivision2,
                    text_subdivision2: this.state.text_subdivision2
                }
                this.teamList.push(teamList);
                this.state.teamList = this.teamList;
            }
        }
        // console.log("teamList", this.teamList)
        if(from == 1){
             toast.success("Team added successfully", { autoClose: 3000 });
            }
            if(from != 3){
             this.setState({
                value_team: "",
                text_team: "",
                workerCount : "",
                inTime : "",
                outTime: "",
                teamtitle : "Select Team"
        
            }); 
            this.setState({workerCount:""});
        }
        
      
    }
  }
  materialAddition = (from=1) =>{

        const found = this.materialList.some(el => (el.value_materials === this.state.value_materials));
            
        if (!found){
            if(this.state.value_materials !=""){
                let manpowerList = {
                    value_materials :this.state.value_materials,
                    text_materials :this.state.text_materials,
                    mWorkerCount : this.state.mWorkerCount,
                    minTime : this.state.minTime,
                    moutTime: this.state.moutTime,
                    value_subdivision2: this.state.value_subdivision2,
                    text_subdivision2: this.state.text_subdivision2,
                }
                this.materialList.push(manpowerList);
                this.state.materialList = this.materialList;
            }
        }
        // console.log("materialList", this.materialList)
        if(from == 1){
            toast.success("Material list added successfully", { autoClose: 3000 }); 
        }

        if(from != 3){
            this.setState({
                value_materials :"",
                mWorkerCount : "",
                minTime : "",
                moutTime: "",
                materialstitle : "Select Materials"
            });
        }
           
        
  }
  
  validateTeamForm =()=>{
   
    if((typeof this.state.value_team == "undefined" || this.state.value_team == "") && this.state.teamList.length == 0 ){
        toast.error("Please select team", { autoClose: 3000 });       
        return false;
    }
    if((typeof this.state.workerCount == "undefined" || this.state.value_scaffoldType == "") && this.state.teamList.length == 0){
        toast.error("Please enter worker count", { autoClose: 3000 });       
        return false;
    }
   
    return true;
  }

  setPreview = ()=>{

    this.itemAddition(3);
    this.teamAddition(3);
    this.materialAddition(3);
    // console.log("state==", this.state.teamList);
      this.setState({show:true});
  }
  handleClose = () =>{
    this.setState({show:false});
  }
  /* Render */
  render() {
    const {headerTitle} = this.state;
    // console.log("==",this.state.scaffoldworktypetitle, this.state.scaffoldtypetitle,this.state.scaffoldcategorytitle);
    console.log("state==",this.state);
    
    return (
    <div className="container work-arr-container">
    <ToastContainer autoClose={8000} />
    <br />
    <div className="row">
        <div className="col-sm-6"><label>Project</label></div>
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
        <div className="col-sm-6"><label>Client</label></div>
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
                <input  type="radio"  name="cType" value="1"  onChange={this.onctypeChange} checked={this.state.cType == "1"} />
            </label>
        </div>
        <div className="col-xs-6">
            <label>Work Request</label>
        </div>
    </div>

    <div className="row">
        <div className="col-xs-1">
            <label>
            
                <input  type="radio"  name="cType" value="2"  onChange={this.onctypeChange} checked={this.state.cType == "2"} />
            </label>
        </div>
        <div className="col-xs-6">
            <label>
                Others
            
            </label>
        </div>
    </div>
     <div className="row">
        <div className="col-xs-6"><label>Work Request By</label></div>
          <div className="col-xs-6">
          <CustInput type="text" name="requestBy" value={this.state.requestBy} onChange={this.onFormChange} />
          </div>
    </div>
    <div className="row">
        <div className="col-sm-6"><label>Base Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title={this.state.basesupervisorTitle}
                  name="Name"
                  keyName="userId"
                  stateId="basesupervisors"
                  reset={this.state.supervisorResetFlag}
                  list={this.state.supervisors}
                  resetThenSet={this.callform}
            />
          </div>
    </div>
    <div className="row">
        <div className="col-sm-6"><label>Field Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title={this.state.supervisorTitle}
                  name="Name"
                  keyName="userId"
                  stateId="supervisors"
                  reset={this.state.supervisorResetFlag}
                  list={this.state.supervisors}
                  resetThenSet={this.callform}
            />
          </div>
    </div>
    {this.state.cType == 1 &&
    <div className="pull-right" >
       <div className="col-xs-6">
        <button type="button" id="Add" onClick={()=>this.itemAddition(1)} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
     
        </div>
    }
       <br />
    <br />
    {this.state.workRequests.length > 0 &&
    <div className="orginalContract">
        <div className="row">
            <div className="col-xs-12">
            <label>WR #</label>
                <Dropdown
                    title={this.state.WRNOTitle}
                    name="workRequestStrId"
                    keyName="workRequestId"
                    stateId="wrno"
                    value={this.state.value_item}
                    list={this.state.workRequests}
                    resetThenSet={this.onItemChange}
                />
            </div>
            </div>
            <div className="row">
            <div className="col-xs-12">
            <label>WR Sub Division</label>
                <Dropdown
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
        {this.state.requestByName != "" &&
        <div className="row">
            <div className="col-xs-3 ">Work Request By :</div>
            <div className="col-xs-6 "> {this.state.requestByName}</div>
        </div>
        }
        {this.state.workType == 1 && 
        <div>
        <div className="row">
                <div className="col-sm-12"><label>&nbsp;</label></div>
            </div>
            <div className="row">
                <div className="col-xs-3"> <CustInput  size="4" type="number" name="L" value={this.state.L} onChange={this.onFormChange} /> L</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="W" value={this.state.W} onChange={this.onFormChange} />W</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="H" value={this.state.H} onChange={this.onFormChange} />H</div>
            
                <div className="col-xs-3"><CustInput size="4" type="number" name="set" value={this.state.set} onChange={this.onFormChange} />Set</div>
            </div>

            <div className="col-xs-3">
            <label>Status</label>
               
            </div>
            <div className="col-xs-9">
                <Dropdown
                    title={this.state.statusTitle}
                    name="value"
                    keyName="id"
                    stateId="workstatus"
                    value={this.state.value_item}
                    list={this.state.workStatus}
                    resetThenSet={this.callform}
                />
                <br /><br />
            </div>
            {(this.state.value_workstatus == 2 || this.state.value_workstatus == 3 ) &&
             <div >
                 <div className="row">
                <div className="col-sm-12"><label>Comp/Full Size</label></div>
            </div>
                <div className="col-xs-3"> <CustInput  size="4" type="number" name="cL" value={this.state.cL} onChange={this.onFormChange} /> L</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="cW" value={this.state.cW} onChange={this.onFormChange} />W</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="cH" value={this.state.cH} onChange={this.onFormChange} />H</div>
            
                <div className="col-xs-3"><CustInput size="4" type="number" name="cset" value={this.state.cset} onChange={this.onFormChange} />Set</div>
            </div>
            }
            </div>
        }
    </div>
    }
    

    <div className="workBasedOn">
        
        <div className="col-sm-3">Timing</div>
        
        <div className="row">
            <div className="col-xs-1    ">
                
                <input  type="radio"  name="timing" value="1"  onChange={this.onFormChange} checked={this.state.timing == "1"}/>
                
            </div>
            <div className="col-xs-3">
                Same
            </div>
        
       
            <div className="col-xs-1">
               
                <input  type="radio"  name="timing" value="2"  onChange={this.onFormChange} checked={this.state.timing == "2"}/>
                
            </div>
            <div className="col-xs-3">
                Different
            </div>
        </div>
    {this.state.timing == 2 &&
    <div>
        <div className="col-xs-6">
            Diff.Timing
            </div>
             <div className="col-xs-6">
             <Dropdown
                    title={this.state.divisionTitle}
                    name="itemName"
                    keyName="itemId"
                    stateId="subdivision2"
                    list={this.state.subItem}
                    resetThenSet={this.callform}
                />
             </div>
        <br /><br />
        </div>

    }

    </div>
  
    <div className="row">
            <div className="col-xs-12 strong">Manpower </div>
        </div>

    <div className="manPowerSelection">

  <div className="pull-right" >
       <div className="col-xs-6">
        <button type="button" id="Add" onClick={this.teamAddition} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
     
    </div>
        <br />
        <br />
       <div className="row"> 
        <div className="col-xs-6">
            Team/Type Worker
            </div>
             <div className="col-xs-6">
             <Dropdown
                    title={this.state.teamtitle}
                    name="teamName"
                    keyName="teamid"
                    stateId="team"
                    list={this.state.team}
                    resetThenSet={this.callform}
                />
             </div>
        </div>
      
        <div className="row">
            <div className="col-xs-6"><label>No.of Workers</label></div><div className="col-xs-6"><CustInput type="number" size="4" name="workerCount" value={this.state.workerCount} onChange={this.onFormChange}/></div>
            
        </div>

        

       
        <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3"><TimeField value={this.state.inTime}  name="inTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3"><TimeField value={this.state.outTime}  name="outTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
    </div>
    <div className="row">
            <div className="col-xs-12"><label>&nbsp;  </label></div>
        </div>

    <div className="manPowerSelection">

        <div className="pull-right" >
       <div className="col-xs-6">
        <button type="button" id="Add" onClick={this.materialAddition} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
     
    </div>
        <br />
        <br />
       <div className="row"> 
        <div className="col-xs-6">
            Materlial
            </div>
             <div className="col-xs-6">
             <Dropdown
                    title={this.state.materialstitle}
                    name="value"
                    keyName="id"
                    stateId="materials"
                    list={this.state.materials}
                    resetThenSet={this.callform}
                />
             </div>
        </div>
      
        <div className="row">
            <div className="col-xs-6"><label>No.of Workers</label></div><div className="col-xs-6"><CustInput type="number" size="4" name="mWorkerCount" value={this.state.mWorkerCount} onChange={this.onFormChange}/></div>
            
        </div>

        

       
        <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3"><TimeField  value={this.state.minTime} name="minTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3"><TimeField   value={this.state.moutTime} name="moutTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
    </div>
<br /><div className="row" style={{paddingTop:"15px"}}>
            <div className="col-xs-3">Upload Photo 1</div>
            <div className="col-xs-6"> <input type="file" name="photo_1" onChange={this.selectImages}/></div>
        </div>
        <div className="row" style={{paddingTop:"15px"}}>
            <div className="col-xs-3">Upload Photo 2</div>
            <div className="col-xs-6"> <input type="file" name="photo_2" onChange={this.selectImages}/></div>
        </div>
        <div className="row" style={{paddingTop:"15px"}}>
            <div className="col-xs-3">Upload Photo 2</div>
            <div className="col-xs-6"> <input type="file" name="photo_3" onChange={this.selectImages}/></div>
        </div>
<div className="row">
            <div className="col-xs-3">Remarks</div>
            <div className="col-xs-6"> <CustInput type="textarea" name="remarks" value={this.state.remarks} onChange={this.onFormChange} /></div>
        </div>




        <div className="workBasedOn">
        
        <div className="col-sm-3">Mat.Misuse</div>
        
        <div className="row">
            <div className="col-xs-1    ">
                
                <input  type="radio"  name="matMisuse" value="1"  onChange={this.onFormChange} checked={this.state.matMisuse == "1"}/>
                
            </div>
            <div className="col-xs-3">
                Yes
            </div>
        
       
            <div className="col-xs-1">
               
                <input  type="radio"  name="matMisuse" value="2"  onChange={this.onFormChange} checked={this.state.matMisuse == "2"}/>
                
            </div>
            <div className="col-xs-3">
                No
            </div>
        </div>
        {this.state.matMisuse == 1 &&
        <div>
            <div className="row">
                <div className="col-xs-3">Remarks</div>
                <div className="col-xs-6"> <CustInput type="textarea" name="matmisueremarks" value={this.state.matmisueremarks} onChange={this.onFormChange} /></div>
            </div>
            <div className="row">
                <div className="col-xs-3">Upload Photo</div>
                <div className="col-xs-6" > <input type="file" name="matPhotos" onChange={this.selectImages}/></div>
            </div>
        </div>
        }
    <div className="workBasedOn">
        
        <div className="col-sm-3">Safty Vio.</div>
        
        <div className="row">
            <div className="col-xs-1    ">
                
                <input  type="radio"  name="safetyvio" value="1"  onChange={this.onFormChange} checked={this.state.safetyvio == "1"}/>
                
            </div>
            <div className="col-xs-3">
                Yes
            </div>
        
       
            <div className="col-xs-1">
               
                <input  type="radio"  name="safetyvio" value="2"  onChange={this.onFormChange} checked={this.state.safetyvio == "2"}/>
                
            </div>
            <div className="col-xs-3">
                No
            </div>
        </div>
        {this.state.safetyvio == 1 &&
        <div>
            <div className="row">
                <div className="col-xs-3">Remarks</div>
                <div className="col-xs-6"> <CustInput type="textarea" name="safetyvioremarks" value={this.state.safetyvioremarks} onChange={this.onFormChange} /></div>
            </div>
            <div className="row">
                <div className="col-xs-3">Upload Photo</div>
                <div className="col-xs-6"> <input type="file" name="safetyPhoto" onChange={this.selectImages} /></div>
            </div>
        </div>
        }
    </div>
    </div>
    <div className="row">
      <div className="col-12">
      
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit"onClick={this.setPreview}>Preview</CustomButton></div>
      <div className="col-sm-3"><CustomButton bsStyle="primary"  id="draft" type="submit" onClick={()=>this.submitRequest(1)}>Update</CustomButton> </div>
      </div>
    </div>



    <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><strong>Preview</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <DailyWorkTrackPreview curState={this.state} />
           
          </Modal.Body>
          <Modal.Footer>
            <CustomButton bsStyle="secondary" onClick={this.handleClose}>Close</CustomButton>
          </Modal.Footer>
        </Modal>
        
    </div>
    
    );
  }
}



export default DailyWorkTrackEdit;
