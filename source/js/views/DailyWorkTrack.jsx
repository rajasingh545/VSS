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
import { requestDetails, requestPost, workRequestPost, fileuploads} from 'actions/workArrangement.actions';
import {Modal} from 'react-bootstrap';
import * as API from "../config/api-config";
@connect(state => ({
    loading: state.request.get('loadingListing'),
    listingDetails: state.request.get('listingDetails'),
    workRequestPost: state.request.get('workRequestPost'),
    requestDet: state.request.get('requestDet'),
  }))
  @baseHOC
class DailyWorkTrack extends React.Component {

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
    diffSubDivition : [],
    images:[],
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
    ],
    images: [],
    imageUrls: [],
    message: '',
    uploads : [],
    uniqueId:Date.now(),
    desc:""
   };
  
   this.teamList = [];
   this.materialList = [];
  this.itemList = [];
  this.images=[];
  
  }
  componentWillMount(){
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
     dispatch(requestDetails(this.state));
    
  }
  componentWillReceiveProps(nextProps){
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
        // let subitem = nextProps.requestDet.items[nextProps.requestDet.workRequests.workRequestId];
        this.setState({items:nextProps.requestDet.items});
        
        // this.setState()
        if(nextProps.requestDet.workRequests.length == 0){
            toast.error("No work requests available for this project and client", { autoClose: 3000 });     
        }
    }

    if(nextProps.requestDet && nextProps.requestDet.supervisors){
        this.setState({supervisors:nextProps.requestDet.supervisors});
        this.setState({value_supervisors:"", text_supervisors:"Select Supervisor"});
    }
}
selectImages = (event) => {
   const {dispatch} = this.props;
    // this.images[event.target.name] = event.target.files[0];
    // this.setState({ images:this.images });
    let ext = event.target.files[0].name.split(".");
    
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

getSupervisor = (key, list, stateKey, title) =>{
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
     dispatch(requestDetails(this.state));
     this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  }
onFormChange = (e) =>{
      
    if(e){
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
}
callform = (key, list, stateKey, title) =>{
    // console.log("===", key, list, stateKey, title);
    this.resetThenSet(key, list, stateKey, title);
}
displayDesc = (key, list, stateKey, title, selectedArr) =>{
   
    this.setState({desc:selectedArr.desc});
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

    // console.log("==", textKey, valuekey);
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
    // this.uploadImages();
    // console.log("validatiing form===", formValidation);
    if(formValidation == true){

        this.itemAddition(2);
        this.teamAddition(2);
        this.materialAddition(2);
      
      this.state.requestCode = 17;
      this.state.listingstatus = status;
      dispatch(workRequestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
      toast.success("DWTR Created Successfully", { autoClose: 3000 });    
      
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
   return true;
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

      this.setState({show:true});
  }
  handleClose = () =>{
    this.setState({show:false});
  }
  /* Render */
  render() {
    const {headerTitle} = this.state;
    // console.log("==",this.state.scaffoldworktypetitle, this.state.scaffoldtypetitle,this.state.scaffoldcategorytitle);
    // console.log("images", this.state.images);
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
    
    {this.state.workRequests.length > 0 && this.state.cType == 1 &&
    <div className="orginalContract">

   
        <div className="row">
            <div className="col-xs-12">
            <label>WR #</label>
                <Dropdown
                    title="Select WR #"
                    name="workRequestId"
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
                    value={this.state.value_workstatus}
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
    
    <div className="hrline col-xs-12">
    &nbsp;
    </div>
    <br />
    <div className="workBasedOn" style={{paddingTop:"15px"}}>
        
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
    

    </div>
    
  {this.state.timing == 2 &&
    <div >
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
    <div className="row">
            <div className="col-xs-12 strong">Manpower </div>
        </div>

    <div className="manPowerSelection">

  <div className="pull-right " >
       <div className="col-xs-6 ">
        <button type="button" id="Add" onClick={()=>this.teamAddition(1)} className="btn btn-default btn-sm right">
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
    <div className="row ">
            <div className="col-xs-12 hrline"><label>&nbsp;  </label></div>
        </div>

    <div className="manPowerSelection">

        <div className="pull-right" >
       <div className="col-xs-6">
        <button type="button" id="Add" onClick={()=>this.materialAddition(1)} className="btn btn-default btn-sm right">
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
    <div className="hrline col-xs-12">
    &nbsp;
    </div>
<br />
<div className="row" style={{paddingTop:"15px"}}>
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
      <div className="col-sm-3"><CustomButton  id="draft" bsStyle="secondary" type="submit" onClick={()=>this.submitRequest(2)}>Draft</CustomButton> </div>
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit"onClick={this.setPreview}>Preview</CustomButton></div>
      <div className="col-sm-3"><CustomButton bsStyle="primary"  id="draft" type="submit" onClick={()=>this.submitRequest(1)}>Submit</CustomButton> </div>
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



export default DailyWorkTrack;
