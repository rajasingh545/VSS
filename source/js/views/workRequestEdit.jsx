/* Module dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import CustInput from '../common/CustInput';
import WorkRequestPreview from "../common/workRequestPreview";
import baseHOC from "./baseHoc";
import TimeField from '../common/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
import { requestDetails,  workRequestPost} from 'actions/workArrangement.actions';
import { getDetailsWithMatchedKey2} from '../common/utility';
import {Modal} from 'react-bootstrap';
@connect(state => ({
    loading: state.request.get('loadingListing'),
    listingDetails: state.request.get('listingDetails'),
    workRequestData: state.request.get('workRequestData'),
    requestDet: state.request.get('requestDet'),
  }))
  @baseHOC
class WorkRequestEdit extends React.Component {

  constructor(props) {
    super(props);
   this.state ={
    project: [],
    clients:[],
    projectTitle : "Select Project",
    clientTitle : "Select Client",
    scaffoldtypetitle : "Select Type",
    scaffoldworktypetitle : "Select Work Type",
    contracts : [],
    filteredArr : [],
    scaffoldWorkType : [],
    scaffoldType:[],
    itemList:[],
    sizeList:[],
    manpowerList:[]
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
     if(this.props.match.params && this.props.match.params.id){
        this.state.listingId = this.props.match.params.id;     
        this.state.requestCode = 16;
        dispatch(workRequestPost(this.state));
       }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.requestDet && nextProps.requestDet.projects){
        this.state.projects = nextProps.requestDet.projects;
        this.state.clients = nextProps.requestDet.clients;
        this.state.scaffoldWorkType = nextProps.requestDet.scaffoldWorkType;
        this.state.scaffoldType = nextProps.requestDet.scaffoldType;
        this.state.subCategoryStore = nextProps.requestDet.subCategory;
        
    }
    if(nextProps.requestDet && nextProps.requestDet.contracts){
        this.setState({contracts:nextProps.requestDet.contracts});
        // this.setState()
        this.state.contracts = nextProps.requestDet.contracts;

        if(this.props.workRequestData && this.props.workRequestData.requestDetails){

            let requestDet = this.props.workRequestData.requestDetails;
            let requestItemsArr = this.props.workRequestData.requestItems;
            let requestItems = requestItemsArr[requestItemsArr.length-1];
            let itemTitle = "Select Item";
             let locationTitle = "Select Title";
            //  console.log("thisprops", requestDet, requestItems, this.state.contracts);
            if(requestDet.contractType == 1){
                itemTitle = getDetailsWithMatchedKey2(requestItems.itemId, this.state.contracts, "id", "item");
                locationTitle = getDetailsWithMatchedKey2(requestItems.itemId, this.state.contracts, "id", "location");
                }

                this.setState({
                    locationTitle : locationTitle,
                    itemTitle : itemTitle,
                    text_item:itemTitle,
                    text_location:locationTitle
                });

        }
    }else if(nextProps.workRequestData && nextProps.workRequestData.requestDetails){
       
        let requestDet = nextProps.workRequestData.requestDetails;
        let requestItemsArr = nextProps.workRequestData.requestItems;
        let requestManlistArr = (nextProps.workRequestData.requestManList) ? nextProps.workRequestData.requestManList : [];
        let requestSizeListArr = (nextProps.workRequestData.requestSizeList) ? nextProps.workRequestData.requestSizeList : [];
        let requestItems = requestItemsArr;
        let requestManlist = requestManlistArr;
        let requestSizeList = requestSizeListArr;
        let scaffoldTitle = "Select Type";
        let scaffoldworkTitle ="Select Work Type";
        let scaffoldSubCategory ="Select Sub Category";
        
        if(requestItemsArr){           
            requestItems = requestItemsArr[requestItemsArr.length-1];
           
            
            if(requestItems.workBased == 2){
                requestManlist = requestManlistArr[requestManlistArr.length-1]
            }
            if(requestItems.workBased == 1){
                requestSizeList = requestSizeListArr[requestSizeListArr.length-1];
                
                scaffoldTitle = getDetailsWithMatchedKey2(requestSizeList.scaffoldType, this.state.scaffoldType, "id", "scaffoldName");
       scaffoldworkTitle = getDetailsWithMatchedKey2(requestSizeList.scaffoldWorkType, this.state.scaffoldWorkType, "id", "scaffoldName");
                if(this.state.subCategoryStore){
                    scaffoldSubCategory = getDetailsWithMatchedKey2(requestSizeList.scaffoldSubCategory, this.state.subCategoryStore[requestSizeList.scaffoldType], "scaffoldSubCateId", "scaffoldSubCatName");
                    
                }
            }
        }
        let proTitle = getDetailsWithMatchedKey2(requestDet.projectId, this.state.projects, "projectId", "projectName");
        let clientname = getDetailsWithMatchedKey2(requestDet.clientId, this.state.clients, "clientId", "clientName");
        let subCate = ""
        if(this.state.subCategoryStore){
            subCate = this.state.subCategoryStore[requestSizeList.scaffoldType];
        }

        this.setState({
            projectTitle:proTitle,
            clientTitle:clientname,           
            cType:requestDet.contractType,
            description : requestDet.description,
            value_projects:requestDet.projectId,
            value_clients:requestDet.clientId,
            text_projects:proTitle,
            text_clients:clientname,
            requestBy:requestDet.requestedBy,
            value_item: requestItems.itemId,
            sizeType: requestItems.sizeType,
            workBased: requestItems.workBased,
            value_scaffoldWorkType : requestSizeList.scaffoldWorkType,
            value_scaffoldType : requestSizeList.scaffoldType,
            text_scaffoldType : this.state.text_scaffoldType,
            value_scaffoldSubcategory : this.state.value_scaffoldSubcategory,
            text_scaffoldSubCategory : scaffoldSubCategory,
            scaffoldSubcategorytitle : scaffoldSubCategory,
            subCategory : subCate,
            L:requestSizeList.length,
            H:requestSizeList.height,
            W:requestSizeList.width,
            set:requestSizeList.setcount,
            safety:requestManlist.safety,
            supervisor:requestManlist.supervisor,
            erectors:requestManlist.erectors,
            gworkers:requestManlist.generalWorker,
            inTime : requestManlist.timeIn,
            outTime: requestManlist.timeOut,
            scaffoldRegister: requestDet.scaffoldRegister,
            remarks:requestDet.remarks,
            scaffoldtypetitle : scaffoldTitle,
        scaffoldworktypetitle : scaffoldworkTitle,
        text_scaffoldWorkType : scaffoldworkTitle,
            text_scaffoldType : scaffoldTitle,
        });
        if(requestDet.contractType == 1){
            this.state.value_projects = requestDet.projectId;
            this.state.value_clients = requestDet.clientId;
            this.state.cType = requestDet.contractType;
           
            this.requestItems();
        }
        if(requestDet.contractType == 1){
            setTimeout(()=>{
                let itemList = this.getOrginalContDataPopulate(requestItemsArr, requestManlistArr, requestSizeListArr);
                this.state.itemList = itemList;
                this.itemList=itemList;
            }, 1000);
           
          
        }
        if(requestDet.contractType ==2 ){
            let sizeList = this.getSizeDataPopulated(requestSizeListArr);
            let manpowerList = this.getManPowerPopulated(requestManlistArr);
            this.state.sizeList = sizeList; 
            this.state.manpowerList = manpowerList;          
            this.manpowerList = manpowerList;
            this.sizeList = sizeList;
        }
    }
}

getOrginalContDataPopulate = (requestItemsArr,requestManlistArr,requestSizeListArr) =>{

    // console.log("in pop===", this.state.contracts);
    let returnArr = [];
    let i =0;
    requestItemsArr.map((items) =>{
        let sizeItem = (requestSizeListArr[i])?requestSizeListArr[i]:[];
        let materialItem = (requestManlistArr[i])?requestManlistArr[i]:[];
        
        let scaffoldTitle = getDetailsWithMatchedKey2(sizeItem.scaffoldType, this.state.scaffoldType, "id", "scaffoldName");
        let scaffoldworkTitle = getDetailsWithMatchedKey2(sizeItem.scaffoldWorkType, this.state.scaffoldWorkType, "id", "scaffoldName"); 
        let scaffoldworkSubCategory = getDetailsWithMatchedKey2(sizeItem.scaffoldSubCategory, this.state.subCategoryStore[sizeItem.scaffoldType],  "scaffoldSubCateId", "scaffoldSubCatName");   
        let itemTitle = getDetailsWithMatchedKey2(items.itemId, this.state.contracts, "id", "item");
        let locationTitle = getDetailsWithMatchedKey2(items.itemId, this.state.contracts, "id", "location");
    let obj ={        
        value_item: items.itemId,
        text_item:itemTitle,
        text_location :locationTitle,
        sizeType: items.sizeType,
        workBased: items.workBased,
        text_scaffoldWorkType : scaffoldworkTitle,
        text_scaffoldType : scaffoldTitle,
        text_scaffoldSubcategory : scaffoldworkSubCategory,
        L:sizeItem.length,
        H:sizeItem.height,
        W:sizeItem.width,
        set:sizeItem.setcount,
        safety:materialItem.safety,
        supervisor:materialItem.supervisor,
        erectors:materialItem.erectors,
        gworkers:materialItem.generalWorker,
        inTime : materialItem.timeIn,
        outTime: materialItem.timeOut         

      }
      returnArr.push(obj);
      i++;
    });

    return returnArr;

}
getSizeDataPopulated = (requestSizeListArr) =>{
    let returnArr = [];
    let i =0;
    requestSizeListArr.map((items) =>{
        
        let scaffoldTitle = getDetailsWithMatchedKey2(items.scaffoldType, this.state.scaffoldType, "id", "scaffoldName");
        let scaffoldworkTitle = getDetailsWithMatchedKey2(items.scaffoldWorkType, this.state.scaffoldWorkType, "id", "scaffoldName"); 
        let scaffoldworkSubCategory = "";
        if(this.state.subCategoryStore){
            scaffoldworkSubCategory = getDetailsWithMatchedKey2(items.scaffoldSubCategory, this.state.subCategoryStore[items.scaffoldType], "scaffoldSubCateId", "scaffoldSubCatName");
        }   
       
    let obj ={        
        value_scaffoldWorkType : items.scaffoldWorkType,
        text_scaffoldWorkType : scaffoldworkTitle,
        text_scaffoldType : scaffoldTitle,
        value_scaffoldType : items.scaffoldType,
        text_scaffoldSubcategory : scaffoldworkSubCategory,
        L:items.length,
        H:items.height,
        W:items.width,
        set:items.setcount

      }
      returnArr.push(obj);
      i++;
    });

    return returnArr;
}

getManPowerPopulated = (requestManlistArr) =>{
    let returnArr = [];
    let i =0;
    requestManlistArr.map((items) =>{
 
    let obj ={        
        safety:items.safety,
        supervisor:items.supervisor,
        erectors:items.erectors,
        gworkers:items.generalWorker,
        inTime : items.timeIn,
        outTime: items.timeOut

      }
      returnArr.push(obj);
      i++;
    });

    return returnArr;
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
callform = (key, list, stateKey) =>{
    this.resetThenSet(key, list, stateKey);
}
onItemChange = (key, list, stateKey, title) =>{

    this.state.filteredArr = this.state.contracts.filter((list)=>{
        return list.id == key;
    });
    let LocTitle = "";
    let itemTitle = "";
    list.map((item)=>{

        if(item.id == key){
            LocTitle = item.location;
            itemTitle = item.item;
        }

    })
    this.resetThenSet(key, list, "location", LocTitle);
    this.resetThenSet(key, list, "item", itemTitle);
    this.setState({itemTitle:this.state.text_item, locationTitle:this.state.text_location});
   
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
    //  console.log("inside==", valuekey, key.toString())
    this.setState({
      [valuekey]:key.toString(),
      [textKey]:title
    });
    this.state[valuekey] = key.toString();
    this.state[textKey] = title;
  }
  onChangeItem = (key, list, stateKey)=>{
    this.resetThenSet(key, list, stateKey);
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
  populateSubCat = (key, list, stateKey, title) =>{
    
     this.setState({subCategory:this.state.subCategoryStore[key], scaffoldSubcategorytitle: "Select Category"});

        this.resetThenSet(key, list, stateKey, title);
    }

  submitRequest = (status) =>{
    const { dispatch } = this.props;
    
    let formValidation = this.validateForm();
    // console.log("validatiing form===", formValidation);
    if(formValidation == true){

        if(this.state.cType == 1){
            this.itemList.push({
                value_item: this.state.value_item,
                sizeType: this.state.sizeType,
                workBased: this.state.workBased,
                value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                value_scaffoldType : this.state.value_scaffoldType,
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
        } else if(this.state.cType == 2){
            if(this.state.workBased == 1){ //size
                this.sizeList.push({
                    value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType,
                    L:this.state.L,
                    H:this.state.H,
                    W:this.state.W,
                    set:this.state.set
                });
                this.state.sizeList = this.sizeList;
            }
            if(this.state.workBased == 2){ //manpower
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
      
      this.state.requestCode = 17;
      this.state.status = status;
      dispatch(workRequestPost(this.state));
      // this.setState({show:true, modalTitle:"Request Confirmation", modalMsg:"Work Arrangement Created Successfully"});
      toast.success("Work Request Updated Successfully", { autoClose: 3000 });    
      
        setTimeout(()=>{
            this.props.history.push('/WorkRequestList');
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

  itemAddition = () =>{
    if(this.validateForm() == true){

        let list = {
            value_item: this.state.value_item,
            sizeType: this.state.sizeType,
            workBased: this.state.workBased,
            value_scaffoldWorkType : this.state.value_scaffoldWorkType,
            value_scaffoldType : this.state.value_scaffoldType,
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
        }

        this.itemList.push(list);

        this.setState({
            value_item: "",
            sizeType: "",
            workBased: "",
            value_scaffoldWorkType : "",
            value_scaffoldType : "",
            L:"",
            H:"",
            W:"",
            set:"",
            safety:"",
            supervisor:"",
            erectors:"",
            gworkers:"",
            inTime : "",
            outTime: ""
        })
        toast.success("Item sdded successfully", { autoClose: 3000 }); 
    }
  }
  sizeAddition = () =>{
        
    if(this.validateSizeForm() == true){
      let sizeList = {
        value_scaffoldWorkType : this.state.value_scaffoldWorkType,
        value_scaffoldType : this.state.value_scaffoldType,
        L:this.state.L,
        H:this.state.H,
        W:this.state.W,
        set:this.state.set
      }
      this.sizeList.push(sizeList);
      toast.success("Size list added successfully", { autoClose: 3000 }); 
      this.setState({
        value_scaffoldWorkType : "",
        value_scaffoldType : "",
        L:"",
        H:"",
        W:"",
        set:""

    });
    }
  }
  manpowerAddition = () =>{
    if(this.validateManpowerForm() == true){
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

  goBack = (e) =>{
    e.preventDefault();
    this.props.history.goBack();
  }

  setPreview = ()=>{

    if(this.state.cType == 1){
        const found = this.itemList.some(el => el.value_item === this.state.value_item);
        if (!found){
            this.itemList.push({
                value_item: this.state.value_item,
                text_item: this.state.text_item,
                sizeType: this.state.sizeType,
                workBased: this.state.workBased,
                value_scaffoldWorkType : this.state.value_scaffoldWorkType,
                text_scaffoldWorkType : this.state.text_scaffoldWorkType,
                value_scaffoldType : this.state.value_scaffoldType,
                text_scaffoldType : this.state.text_scaffoldType,
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
                    text_scaffoldWorkType : this.state.text_scaffoldWorkType,
                    value_scaffoldType : this.state.value_scaffoldType,
                    text_scaffoldType : this.state.text_scaffoldType,
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


      this.setState({show:true});
  }
  handleClose = () =>{
    this.setState({show:false});
  }
  /* Render */
  render() {
    const {headerTitle} = this.state;
   
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
                  resetThenSet={this.onChangeItem}
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
            <div className="col-xs-1"><label><input  type="radio"  name="sizeType" value="1"  onChange={this.onChangeSizeType} checked={this.state.sizeType == "1"}/></label></div>
            <span className="col-xs-3">
                Full Size
            </span>
        </div>
        
        <div className="row">
            <div className="col-xs-1"><label><input  type="radio"  name="sizeType" value="2"  onChange={this.onChangeSizeType} checked={this.state.sizeType == "2"}/></label></div>
            <span className="col-xs-3">
                Partial Size
            </span>
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
                  title={this.state.scaffoldworktypetitle}
                  name="scaffoldName"
                  keyName="id"
                  stateId="scaffoldWorkType"
                  list={this.state.scaffoldWorkType}
                  resetThenSet={this.callform}
            />
          </div>
    </div>
    
    {/*<div className="row">
        <div className="col-xs-6"><label>Ref# WR</label></div>
          <div className="col-xs-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.reasons}
                  resetThenSet={this.resetThenSet}
            />
          </div>
</div>*/}

        <div className="sizeSelection">
        
            <div className="row">
                <div className="col-xs-6"><label>Scaffold Type</label></div>
                <div className="col-xs-6">
                    <Dropdown
                        title={this.state.scaffoldtypetitle}
                        name="scaffoldName"
                        keyName="id"
                        stateId="scaffoldType"
                        list={this.state.scaffoldType}
                        resetThenSet={this.populateSubCat}
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
                <div className="col-xs-3"> <CustInput  size="4" type="text" name="L" value={this.state.L} onChange={this.onFormChange} /> L</div>
                <div className="col-xs-3"><CustInput size="4" type="text" name="W" value={this.state.W} onChange={this.onFormChange} />W</div>
                <div className="col-xs-3"><CustInput size="4" type="text" name="H" value={this.state.H} onChange={this.onFormChange} />H</div>
            
                <div className="col-xs-3"><CustInput size="4" type="text" name="set" value={this.state.set} onChange={this.onFormChange} />Set</div>
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
            <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3"><CustInput type="text" size="4" name="safety" value={this.state.safety} onChange={this.onFormChange}/></div>
            <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3"><CustInput type="text" size="4" name="supervisor" value={this.state.supervisor} onChange={this.onFormChange}/></div>
        </div>

        <div className="row">
            <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3"><CustInput type="text" size="4" name="erectors" value={this.state.erectors} onChange={this.onFormChange}/></div>
            <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3"><CustInput type="text" size="4" name="gworkers" value={this.state.gworkers} onChange={this.onFormChange}/></div>
        </div>

        <div className="row">
            <div className="col-xs-12"><label>ManPower Time</label></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3"><TimeField  name="inTime" value={this.state.inTime} className="width100" onChange={this.onTimeChange}/></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3"><TimeField  name="outTime" value={this.state.outTime} className="width100" onChange={this.onTimeChange}/></div>
        </div>
    </div>
}
<div className="row">
            <div className="col-xs-3">Scaffold Register</div>
            <div className="col-xs-6"> <input type="checkbox" name="scaffoldRegister" checked={this.state.scaffoldRegister == 1} onClick={this.onCheckBoxChecked}/></div>
        </div>

<div className="row">
            <div className="col-xs-3">Remarks</div>
            <div className="col-xs-6"> <CustInput type="textarea" name="remarks" value={this.state.remarks} onChange={this.onFormChange} /></div>
        </div>
    <div className="row">
      <div className="col-12">
      <div className="col-sm-3"><CustomButton  id="draft" bsStyle="secondary" type="submit" onClick={this.goBack}>Back</CustomButton> </div>
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit"onClick={this.setPreview}>Preview</CustomButton></div>
      <div className="col-sm-3"><CustomButton bsStyle="primary"  id="draft" type="submit" onClick={()=>this.submitRequest(1)}>Update</CustomButton> </div>
      </div>
    </div>
        

        <Modal show={this.state.show} onHide={this.handleClose}>
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



export default WorkRequestEdit;
