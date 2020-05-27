/* Module dependencies */
import React from 'react';
import Dropdown from '../components/Dropdown';
import CustomButton from '../components/CustomButton';
import { connect } from 'react-redux';
import baseHOC from "./baseHoc";

import { requestDetails, fetchReport } from 'actions/report.actions';
import { ToastContainer, toast } from 'react-toastify';
import {DOMAIN_NAME} from "../config/api-config";
import DatePicker from 'react-datepicker';
import moment from "moment";
import ReactTable from "react-table";
import * as API from "../config/api-config";
import { CSVLink } from "react-csv";
@connect(state => ({
  reportdata: state.request.get('reportdata'),
  requestDet: state.request.get('requestDet'),
}))
@baseHOC
class DWTRReport extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption:"option1",
      projectTitle : "Select Project",
      showSubButton : false,
      team:[],
      startDate1: moment(),
      endDate1: moment(),
      columns : [],
      data : [],
      msg:"",
      loading : false
    };
    this.selectedIds = [];
    this.timeValuesArr = [];
    this.teamArr = [];
    this.WAId = "";


  }
  componentWillMount(){
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
     dispatch(requestDetails(this.state));
     
  }
  componentWillReceiveProps(nextProps) {

    if(nextProps.requestDet && nextProps.requestDet.supervisorsList){
        this.setState({supervisors:nextProps.requestDet.supervisorsList});
    }

  }
 
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }

  reportSuccess =(json)=>{
    let columns = [];
    let data = json.resultset;
    if(data.length > 0){
      json.column.map((col)=>{
        columns.push({
          Header: col,
          accessor: col,
          headerClassName:"gridcolHeader",
        })
      });
      
      this.setState({loading:false});
      this.setState({data,columns});
      this.setState({msg:""});
    }
    else{
      this.setState({loading:false});
      this.setState({data:[],columns:[]});
      this.setState({msg:" No Records Found"});
    }
  }
  onSubmit = (type) =>{
    const {dispatch} = this.props;
    let url = API.REPORT_URI;
    this.state.requestCode = 1;
    let obj = this.state;
    this.setState({msg:""});
    this.setState({loading:true});
    return fetch(url, {
      method: 'post',
      mode:'cors',
      headers: {'Content-Type':'text/plain'},
      body: JSON.stringify(obj)
    }).then(response => response.json())
        .then(json => this.reportSuccess(json));
    let columns =  [

        {
            Header: "Description",
            accessor: "desc",
            headerClassName:"gridcolHeader",
            
        },
    ];

    if(this.state.value_supervisorsel){

        columns.push({
            Header: this.state.text_supervisorsel,
            accessor: this.state.value_supervisorsel,
            headerClassName:"gridcolHeader",
        });

    }else{

        this.state.supervisors.map((value)=>{
            let column = {
                Header: value.Name,               
                headerClassName:"gridcolHeader",
                columns: [{
                    Header: 'Erection',
                    accessor: 'favorites.color'
                  },
                  {
                    Header: 'Dismantle',
                    accessor: 'favorites.color1'
                  }
                ]
               
              }
              columns.push(column);
        });

    }

    columns.push({
        Header: 'Remarks',
        accessor: 'favorites.color'   
    });
    
  }
 
  setReason = (key, list, stateKey) =>{
    this.timeValuesArr[stateKey] = key;
  }
  onTimeChange = (el)=>{
    // console.log("==$$==",el.value, el.name);

    this.timeValuesArr[el.name] = el.value;
  }
 
  /* developer: saravanan, date:27.5.2020, bug: For any size submission, Photo is mandatory. 
  photo is mandatory*/

  photoMandatory = (event) => {
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
  
  
  onStartDateChange = (e) =>{
    
    if(e != null){
        this.setState({
          startDate: e.format("YYYY/MM/DD"),
          startDate1: e
        });
      }else{
        this.setState({
          startDate: "",
          startDate1: ""
        });
      }
      this.state.startDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date
      
}

onEndDateChange = (e) =>{
  
    if(e != null){
        this.setState({
          endDate: e.format("YYYY/MM/DD"),
          endDate1: e
        });
      }else{
        this.setState({
          endDate: "",
          endDate1: ""
        });
      }
      this.state.endDate = e.format("YYYY/MM/DD"); //dont remove - to get immedaite value of date 
}
setRemarks = (e) => {
  // this.state.remarks = e.target.value;
  this.setState({remarks:e.target.value});
}
resetThenSet = (key, list, stateKey, title)=>{
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
callform = (key, list, stateKey, title) =>{
    // console.log("===", key, list, stateKey, title);
    this.resetThenSet(key, list, stateKey, title);
}
  /* Render */
  render() {
    const {columns, data} = this.state;
    // let data =[];
    let loadingurl = DOMAIN_NAME+"/assets/img/loading.gif";
    return (
    <div className="work-arr-container">
    <br/>
    <ToastContainer autoClose={8000} />
    <div className="row">
        <div className="col-sm-2"><label>From Date</label></div>
        
        <div className="col-sm-3"> <DatePicker
                      selected={this.state.startDate1}
                    
                      className=" form-control"
                      isClearable={false}
                      onChange={this.onStartDateChange}
                      name="startDate"
                      dateFormat="DD-MM-YYYY"
                      locale="UTC"
                     
                  /></div>
                  <div className="col-sm-2"><label>To Date</label></div>
        
        <div className="col-sm-3"> <DatePicker
                      selected={this.state.endDate1}
                    
                      className=" form-control"
                      isClearable={false}
                      onChange={this.onEndDateChange}
                      name="endtDate"
                      dateFormat="DD-MM-YYYY"
                      locale="UTC"
                     
                  /></div>

    </div>
    <div className="row">
        <div className="col-sm-3"><label>Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="All"
                  name="Name"
                  keyName="userId"
                  stateId="supervisorsel"
                  reset={this.state.supervisorResetFlag}
                  list={this.state.supervisors}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>


    <div className="row">
        <div className="col-sm-3"><label>Photo is mandatory.</label></div>
          <div className="col-sm-6">
            <input type="file" name="photo_1"  onChange={this.photoMandatory} required/>
          </div>
    </div>

    
    
    <br/>
   
    <div className="row">

      
      
      <div className="col-sm-3">
        <CustomButton bsStyle="primary" id="submit" onClick={()=>this.onSubmit(1)} className="width50" type="submit">Submit</CustomButton>
      </div>
    </div>
    <div className="col-sm-3" style={{color:'red', fontWeight:'bold'}}>{this.state.msg}</div>
    <br/>
    {this.state.loading == true &&
        <div className="center-div"><img src={loadingurl} /></div>
    }
    {this.state.loading == false && columns.length > 0 &&
        <div>
          <div className="col-sm-3">
          <CSVLink data={data}><CustomButton bsStyle="primary" className="width50" id="submit">Download As Excel</CustomButton></CSVLink>
            <br />
          </div>
          <div className="col-sm-12">
          
          <ReactTable
              data={data}
              columns={columns}
              showPagination={false}
              defaultPageSize={15}
          />
            
          
          </div>
        </div>
      }
        
    </div>
    
    );
  }
}



export default DWTRReport;