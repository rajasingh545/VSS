/* Module dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import WorkRequestPreview from "../common/workRequestPreview";
import CustInput from '../common/CustInput';
import baseHOC from "./baseHoc";
import TimeField from '../common/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
import { requestDetails, requestPost, workRequestPost, listigDetails, clearListing } from 'actions/workArrangement.actions';
import {Modal} from 'react-bootstrap';

@connect(state => ({
    loading: state.request.get('loadingListing'),
    listingDetails: state.request.get('listingDetails'),
    workRequestPost: state.request.get('workRequestPost'),
    requestDet: state.request.get('requestDet'),
  }))
  @baseHOC
class WorkRequest extends React.Component {

  constructor(props) {
    super(props);
   this.state ={
    project: [],
    clients:[],
    projectTitle : "Select Project",
    clientTitle : "Select Client",
    locationTitle : "Select Location",
    itemtitle:"Select Item",
    scaffoldTypetitle : "Select Type",
    scaffoldWorkTypetitle : "Select Work Type",
    scaffoldSubcategorytitle : "Select Category",

    
    contracts : [],
    filteredArr : [],
    scaffoldWorkType : [],
    scaffoldType:[],
    itemList:[],
    sizeList:[],
    manpowerList:[],
    clientsStore:[],
    
   };
   this.itemList = [];
   this.sizeList = [];
   this.manpowerList = [];
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
        this.state.workRequestList = nextProps.requestDet.workRequestList;
        this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
        this.state.scaffoldType = nextProps.requestDet.scaffoldType;
        this.state.subCategoryStore = nextProps.requestDet.subCategory;
        this.state.clientsProjectMapping = nextProps.requestDet.clientsProjectMapping;
    }
    if(nextProps.requestDet && nextProps.requestDet.contracts){
        this.setState({contracts:nextProps.requestDet.contracts});
        // this.setState()
        if(nextProps.requestDet.contracts.length == 0){
            toast.error("No original contracts available for this project and client", { autoClose: 3000 });     
        }
    }
}
onFormChange = (e) =>{
      
    if(e){
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
}
onCheckBoxChecked = (e)=>{
    if(e.target.checked == true){
        this.setState({[e.target.name]:1});
    }
    else{
        this.setState({[e.target.name]:0});
    }
}
callform = (key, list, stateKey, title) =>{
    this.resetThenSet(key, list, stateKey, title);
}
populateSubCat = (key, list, stateKey, title) =>{
    
    this.setState({subCategory:this.state.subCategoryStore[key], scaffoldSubcategorytitle: "Select Category"});

    this.resetThenSet(key, list, stateKey, title);
}
onItemChange = (key, list, stateKey, title) =>{

    this.state.filteredArr = this.state.contracts.filter((list)=>{
        return list.id == key;
    });
    let LocTitle = "";
    let itemTitle = "";
    let desc ="";
    list.map((item)=>{

        if(item.id == key){
            LocTitle = item.location;
            itemTitle = item.item;
            desc = item.desc;
        }

    })
    this.resetThenSet(key, list, "location", LocTitle);
    this.resetThenSet(key, list, "item", itemTitle);
    this.setState({itemtitle:this.state.text_item, locationTitle:this.state.text_location, desc:desc});
   
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
  onChangeProject = (key, list, stateKey, title)=>{
    let clientsList = (this.state.clientsProjectMapping[key])? this.state.clients[key] : [];
//   console.log("clientsList",clientsList,this.state.clients[key] )
    // this.setState({clientsStore:[clientsList]});
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  }
  onChangeItem = (key, list, stateKey, title)=>{
    this.resetThenSet(key, list, stateKey, title);
    this.requestItems();
  }
  requestItems = ()=>{
    const { dispatch } = this.props;
   
       if(this.state.value_projects && this.state.value_clients && this.state.cType == 1){        
        this.state.requestCode = 5;
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
            set:this.state.filteredArr[0].sets
            
        });
       
    }
    else{
        this.setState({
            L:"",
            W:"",
            H:"",
            set:""
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
    
    if(formValidation == true){

        if(this.state.cType == 1){

            const found = this.itemList.some(el => el.value_item === this.state.value_item);
            if (!found){
                this.itemList.push({
                    value_item: this.state.value_item,
                    sizeType: this.state.sizeType,
                    workBased: this.state.workBased,
                    workRequestId: this.state.value_workRequestId,
                    value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType,
                    value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    set:this.state.set,
                    safety:this.state.safety,
                    supervisor:this.state.supervisor,
                    erectors:this.state.erectors,
                    gworkers:this.state.gworkers,
                    inTime : this.state.inTime,
                    outTime: this.state.outTime

                });
                this.state.itemList = this.itemList;
            }
        } else if(this.state.cType == 2){
            if(this.state.workBased == 1){ //size
                const found = this.sizeList.some(el => el.value_scaffoldWorkType === this.state.value_scaffoldWorkType);
                if (!found){
                    this.sizeList.push({
                        value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                        value_scaffoldType : this.state.value_scaffoldType,
                        value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,
                        L:this.state.L,
                        H:this.state.H,
                        W:this.state.W,
                        set:this.state.set
                    });
                    this.state.sizeList = this.sizeList;
                }
            }
            if(this.state.workBased == 2){ //manpower

                const found = this.manpowerList.some(el => (el.safety === this.state.safety && el.supervisor === this.state.supervisor && el.erectors === this.state.erectors && el.gworkers === this.state.gworkers));
            
                 if (!found){
                    this.manpowerList.push({
                        safety:this.state.safety,
                        supervisor:this.state.supervisor,
                        erectors:this.state.erectors,
                        gworkers:this.state.gworkers,
                        inTime : this.state.inTime,
                        outTime: this.state.outTime
                    });
                    this.state.manpowerList = this.manpowerList;
                }
            }
        }
      
      this.state.requestCode = 14;
      this.state.status = status;
     
      if(this.state.workBased == 1){
        if(this.validateSizeForm() == false){
            return false;
        }
      }
      if(this.state.workBased == 2){
        if(this.validateManpowerForm() == false){
            return false;
        }
      }
    
      dispatch(workRequestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
     
     if(status == 1){
      toast.success("Work Request Created Successfully", { autoClose: 3000 });   
     }
     if(status == 2) {
        toast.success("Work Request Drafted Successfully", { autoClose: 3000 });   
     }
      
            setTimeout(()=>{
                this.props.history.push('/WorkRequestList');
            }, 3000);
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
    
    if(!this.state.cType || this.state.cType == ""){
        toast.error("Contract Type is required", { autoClose: 3000 });       
        return false;
    }

    if(this.state.workBased == 1){
       
        if(!this.state.value_scaffoldWorkType || this.state.value_scaffoldWorkType == ""){
            toast.error("Scaffold Work Type is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.value_scaffoldType || this.state.value_scaffoldType == ""){
            toast.error("Scaffold Type is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.value_scaffoldSubcategory || this.state.value_scaffoldSubcategory == ""){
            toast.error("Scaffold Subcategory is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.L || this.state.L == ""){
            toast.error("Length is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.W || this.state.W == ""){
            toast.error("Width is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.H || this.state.H == ""){
            toast.error("Height is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.set || this.state.set == ""){
            toast.error("Set is required", { autoClose: 3000 });       
            return false;
        }
        
        if(this.state.filteredArr[0] && this.state.L > parseInt(this.state.filteredArr[0].length)){
            toast.error("Length should not be greater than "+this.state.filteredArr[0].length, { autoClose: 3000 });       
            return false;
        }
        if(this.state.filteredArr[0] && this.state.W >  parseInt(this.state.filteredArr[0].width)){
            toast.error("Width should not be greater than "+this.state.filteredArr[0].width, { autoClose: 3000 });       
            return false;
        }
        
        if(this.state.filteredArr[0] && this.state.H >  parseInt(this.state.filteredArr[0].height)){
            toast.error("Height should not be greater than "+this.state.filteredArr[0].height, { autoClose: 3000 });       
            return false;
        }
        if(this.state.filteredArr[0] && this.state.set >  parseInt(this.state.filteredArr[0].sets)){
            toast.error("Set should not be greater than "+this.state.filteredArr[0].sets, { autoClose: 3000 });       
            return false;
        }
       
        
    }
    if(this.state.workBased == 2){
      
        if(!this.state.safety || this.state.safety == ""){
            toast.error("Safety is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.supervisor || this.state.supervisor == ""){
            toast.error("Supervisor is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.erectors || this.state.erectors == ""){
            toast.error("Erectors is required", { autoClose: 3000 });       
            return false;
        }
        if(!this.state.gworkers || this.state.gworkers == ""){
            toast.error("General Workers is required", { autoClose: 3000 });       
            return false;
        }
    }

    return true;
  }

  itemAddition = () =>{
    if(this.validateForm() == true){
        const found = this.itemList.some(el => el.value_item === this.state.value_item);
        if(this.state.value_item != ""){
            if (!found){
                let list = {
                    value_item: this.state.value_item,
                    text_item: this.state.text_item,
                    sizeType: this.state.sizeType,
                    workBased: this.state.workBased,
                    workRequestId: this.state.value_workRequestId,
                    value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                    text_scaffoldWorkType : this.state.text_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType,
                    text_scaffoldType : this.state.text_scaffoldType,
                    value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,
                    text_scaffoldSubcategory : this.state.text_scaffoldSubcategory,
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    Set:this.state.Set,
                    safety:this.state.safety,
                    supervisor:this.state.supervisor,
                    erectors:this.state.erectors,
                    gworkers:this.state.gworkers,
                    inTime : this.state.inTime,
                    outTime: this.state.outTime
                }
            

                this.itemList.push(list);
            }
        }

        this.setState({
            itemtitle: "Select Item",
            locationTitle: "Select Location",
            value_item: "",
            sizeType: "",
            workBased: "",
            value_scaffoldWorkType : "",
            value_scaffoldType : "",
            L:"",
            H:"",
            W:"",
            Set:"",
            safety:"",
            supervisor:"",
            erectors:"",
            gworkers:"",
            inTime : "",
            outTime: ""
        });
        
        toast.success("Item added successfully", { autoClose: 3000 }); 
    }
  }
  sizeAddition = () =>{
        
    if(this.validateSizeForm() == true){

        const found = this.sizeList.some(el => el.value_scaffoldWorkType === this.state.value_scaffoldWorkType);
        if(this.state.value_scaffoldWorkType != ""){
            if (!found){
                let sizeList = {
                    value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType, 
                    value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,              
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    Set:this.state.Set
                }
                this.sizeList.push(sizeList);
            }
        }
      toast.success("Size list added successfully", { autoClose: 3000 }); 
      this.setState({
        value_scaffoldWorkType : "",
        value_scaffoldType : "",
        scaffoldWorkTypetitle:"Select Work Type",
        scaffoldTypetitle:"select Type",
        scaffoldSubcategorytitle:"Select Category",
        L:"",
        H:"",
        W:"",
        set:""

    });
    }
  }
  manpowerAddition = () =>{
    if(this.validateManpowerForm() == true){

        const found = this.manpowerList.some(el => (el.safety === this.state.safety && el.supervisor === this.state.supervisor && el.erectors === this.state.erectors && el.gworkers === this.state.gworkers));
        if(this.state.safety != ""){
            if (!found){
                let manpowerList = {
                    safety:this.state.safety,
                    supervisor:this.state.supervisor,
                    erectors:this.state.erectors,
                    gworkers:this.state.gworkers,
                    inTime : this.state.inTime,
                    outTime: this.state.outTime
                }
                this.manpowerList.push(manpowerList);
                this.state.manpowerList = this.manpowerList;
            }
        }
        toast.success("Manpower list added successfully", { autoClose: 3000 }); 

        this.setState({
            safety:"",
            supervisor:"",
            erectors:"",
            gworkers:"",
            inTime : "",
            outTime: ""

        });


    }
  }
  validateManpowerForm = () =>{
    if(typeof this.state.safety == "undefined" || this.state.safety == ""){
        toast.error("Safety can't be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.supervisor == "undefined" || this.state.supervisor == ""){
        toast.error("Supervisor can't be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.erectors == "undefined" || this.state.erectors == ""){
        toast.error("Erectors can't be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.gworkers == "undefined" || this.state.gworkers == ""){
        toast.error("Go workers can't be empty", { autoClose: 3000 });       
        return false;
    }
    return true;
  }
  validateSizeForm =()=>{
    if(typeof this.state.value_scaffoldWorkType == "undefined" || this.state.value_scaffoldWorkType == ""){
        toast.error("Please select scaffold work type", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.value_scaffoldType == "undefined" || this.state.value_scaffoldType == ""){
        toast.error("Please select scaffold type", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.L == "undefined" || this.state.L == "" || this.state.L == 0){
        toast.error("Length cant be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.H == "undefined" || this.state.H == "" || this.state.H == 0){
        toast.error("Height cant be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.W == "undefined" || this.state.W == "" || this.state.W == 0){
        toast.error("Width cant be empty", { autoClose: 3000 });       
        return false;
    }
    if(typeof this.state.set == "undefined" || this.state.set == "" || this.state.set == 0){
        toast.error("Set cant be empty", { autoClose: 3000 });       
        return false;
    }
    return true;
  }

  setPreview = ()=>{

    if(this.state.cType == 1){
        const found = this.itemList.some(el => el.value_item === this.state.value_item);
        if(this.state.value_item != ""){
            if (!found){
                this.itemList.push({
                    value_item: this.state.value_item,
                    text_item: this.state.text_item,
                    sizeType: this.state.sizeType,
                    workBased: this.state.workBased,
                    workRequestId: this.state.value_workRequestId,
                    workRequestId_Text: this.state.text_workRequestId,
                    value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                    text_scaffoldWorkType : this.state.text_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType,
                    text_scaffoldType : this.state.text_scaffoldType,
                    value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,
                    text_scaffoldSubcategory : this.state.text_scaffoldSubcategory,
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    set:this.state.set,
                    safety:this.state.safety,
                    supervisor:this.state.supervisor,
                    erectors:this.state.erectors,
                    gworkers:this.state.gworkers,
                    inTime : this.state.inTime,
                    outTime: this.state.outTime

                });
                this.state.itemList = this.itemList;
            }
        }
    } else if(this.state.cType == 2){
        if(this.state.workBased == 1){ //size

            const found = this.sizeList.some(el => el.value_scaffoldWorkType === this.state.value_scaffoldWorkType);
            if(this.state.value_scaffoldWorkType != ""){
                if (!found){
                    this.sizeList.push({
                        value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                        text_scaffoldWorkType : this.state.text_scaffoldWorkType,
                        value_scaffoldType : this.state.value_scaffoldType,
                        text_scaffoldType : this.state.text_scaffoldType,
                        value_scaffoldSubcategory: this.state.value_scaffoldSubcategory,
                        text_scaffoldSubcategory: this.state.text_scaffoldSubcategory,
                        L:this.state.L,
                        H:this.state.H,
                        W:this.state.W,
                        set:this.state.set
                    });
                    this.state.sizeList = this.sizeList;
                }
            }
        }
        if(this.state.workBased == 2){ //manpower

            const found = this.manpowerList.some(el => (el.safety === this.state.safety && el.supervisor === this.state.supervisor && el.erectors === this.state.erectors && el.gworkers === this.state.gworkers));
            if(this.state.safety != ""){
                if (!found){
                    this.manpowerList.push({
                        safety:this.state.safety,
                        supervisor:this.state.supervisor,
                        erectors:this.state.erectors,
                        gworkers:this.state.gworkers,
                        inTime : this.state.inTime,
                        outTime: this.state.outTime
                    });
                    this.state.manpowerList = this.manpowerList;
                }
            }
        }
    }


      this.setState({show:true});
  }
  handleClose = () =>{
    this.setState({show:false});
  }
  /* Render */
  render() {
    const {headerTitle, itemtitle} = this.state;
    // console.log("==",this.state.scaffoldworktypetitle, this.state.scaffoldtypetitle,this.state.scaffoldcategorytitle);
    
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
                  resetThenSet={this.onChangeProject}
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
        <div className="col-xs-6"><label>Work Request By</label></div>
          <div className="col-xs-6">
          <CustInput type="text" name="requestBy" value={this.state.requestBy} onChange={this.onFormChange} />
          </div>
    </div>

    <div className="row">
        <div className="col-xs-1">
            <label>
             
                        <input  type="radio"  name="cType" value="1"  onChange={this.onctypeChange} checked={this.state.cType == "1"} />
            </label>
        </div>
        <div className="col-xs-6">
            <label>Original Contract</label>
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
                Variation Works
            
            </label>
        </div>
    </div>
    
    {this.state.cType == 1 &&
    <div className="pull-right" >
       <div className="col-xs-6">
        <button type="button" id="Add" onClick={this.itemAddition} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
     
        </div>
    }
       <br />
    <br />
    {this.state.contracts.length > 0 &&
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
            <div className="col-xs-1"><label><input  type="radio"  name="sizeType" value="1"  onChange={this.onChangeSizeType} checked={this.state.sizeType == "1"}/></label></div>
            <span className="col-xs-6">
                Full Size
            </span>
        </div>
        
        <div className="row">
            <div className="col-xs-1"><label><input  type="radio"  name="sizeType" value="2"  onChange={this.onChangeSizeType} checked={this.state.sizeType == "2"}/></label></div>
            <span className="col-xs-6">
                Partial Size
            </span>
        </div>
    </div>
    }
    {this.state.sizeType == 2 && 
     <div className="description">
        <div className="row">
            <div className="col-xs-6"><label>Previous WR#</label></div>
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
    }
    <div className="description">
        <div className="row">
            <div className="col-xs-6"><label>Description</label></div>
            <div className="col-xs-6">
            <CustInput type="textarea" name="description" value={this.state.description} onChange={this.onFormChange} />
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
                <input  type="radio"  name="workBased" value="1"  onChange={this.onFormChange} checked={this.state.workBased == "1"}/>
                </label>
            </div>
            <div className="col-xs-3">
                Size
            </div>
        
        </div>
        <div className="row">
            <div className="col-xs-1">
                <label>
                <input  type="radio"  name="workBased" value="2"  onChange={this.onFormChange} checked={this.state.workBased == "2"}/>
                </label>
            </div>
            <div className="col-xs-3">
                ManPower
            </div>
        </div>
    </div>
  
{this.state.workBased == 1 && 
    <div>
  {this.state.cType == 2 &&
        <div className="pull-right" >
        <div className="col-xs-6">
        <button type="button" id="Add" onClick={this.sizeAddition} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
        </div>

    }
    <br></br>
    <br></br>
    <div className="row">
        <div className="col-xs-6"><label>Type of Scaffolding Works</label></div>
          <div className="col-xs-6">
            <Dropdown
                  title={this.state.scaffoldWorkTypetitle}
                  name="scaffoldName"
                  keyName="id"
                  stateId="scaffoldWorkType"
                  list={this.state.scaffoldWorkType}
                  resetThenSet={this.callform}
                  key="1"
            />
          </div>
    </div>

   

        <div className="sizeSelection">
        
            <div className="row">
                <div className="col-xs-6"><label>Scaffold Type</label></div>
                <div className="col-xs-6">
               
                    <Dropdown
                        title={this.state.scaffoldTypetitle}
                        name="scaffoldName"
                        keyName="id"
                        stateId="scaffoldType"
                        list={this.state.scaffoldType}
                        resetThenSet={this.populateSubCat}
                        key="2"
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-xs-6"><label>Scaffold Sub Category</label></div>
                <div className="col-xs-6">
                    <Dropdown
                        title={this.state.scaffoldSubcategorytitle}
                        name="scaffoldSubCatName"
                        keyName="scaffoldSubCateId"
                        stateId="scaffoldSubcategory"
                        list={this.state.subCategory}
                        resetThenSet={this.callform}
                        key="3"
                    />
                </div>
</div>

            <div className="row">
                <div className="col-sm-12"><label>Size</label></div>
            </div>
            <div className="row">
                <div className="col-xs-3"> <CustInput  size="4" type="number" name="L" value={this.state.L} onChange={this.onFormChange} /> L</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="W" value={this.state.W} onChange={this.onFormChange} />W</div>
                <div className="col-xs-3"><CustInput size="4" type="number" name="H" value={this.state.H} onChange={this.onFormChange} />H</div>
            
                <div className="col-xs-3"><CustInput size="4" type="number" name="set" value={this.state.set} onChange={this.onFormChange} />Set</div>
            </div>
        </div>
    </div>
}
{this.state.workBased == 2 &&
    <div className="manPowerSelection">
        {this.state.cType == 2 &&
        <div className="pull-right" >
        <div className="col-xs-6">
        <button type="button" id="Add" onClick={this.manpowerAddition} className="btn btn-default btn-sm right">
            <span className="glyphicon glyphicon-plus right"></span>
        </button>
        </div>
        </div>

        }
        <br></br>
        <br></br>
        
        <div className="row">
            <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="safety" value={this.state.safety} onChange={this.onFormChange}/></div>
            <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="supervisor" value={this.state.supervisor} onChange={this.onFormChange}/></div>
        </div>

        <div className="row">
            <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="erectors" value={this.state.erectors} onChange={this.onFormChange}/></div>
            <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3"><CustInput type="number" size="4" name="gworkers" value={this.state.gworkers} onChange={this.onFormChange}/></div>
        </div>

        <div className="row">
            <div className="col-xs-12"><label>ManPower Time</label></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3"><TimeField  name="inTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3"><TimeField  name="outTime" className="width100" onChange={this.onTimeChange}/></div>
        </div>
    </div>
}
<div className="row">
            <div className="col-xs-3">Scaffold Register</div>
            <div className="col-xs-6"> <input type="checkbox" name="scaffoldRegister" onClick={this.onCheckBoxChecked} checked={this.state.scaffoldRegister == 1} /></div>
        </div>

<div className="row">
            <div className="col-xs-3">Remarks</div>
            <div className="col-xs-6"> <CustInput type="textarea" name="remarks" value={this.state.remarks} onChange={this.onFormChange} /></div>
        </div>
    <div className="row">
      <div className="col-12">
      <div className="col-sm-3"><CustomButton  id="draft" bsStyle="secondary" type="submit" onClick={()=>this.submitRequest(2)}>Draft</CustomButton> </div>
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit"onClick={this.setPreview}>Preview</CustomButton></div>
      <div className="col-sm-3"><CustomButton bsStyle="primary"  id="draft" type="submit" onClick={()=>this.submitRequest(1)}>Submit</CustomButton> </div>
      </div>
    </div>



    <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="modallg">
          <Modal.Header closeButton>
            <Modal.Title><strong>Preview</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <WorkRequestPreview curState={this.state} />
           
          </Modal.Body>
          <Modal.Footer>
            <CustomButton bsStyle="secondary" onClick={this.handleClose}>Close</CustomButton>
          </Modal.Footer>
        </Modal>
        
    </div>
    
    );
  }
}



export default WorkRequest;
