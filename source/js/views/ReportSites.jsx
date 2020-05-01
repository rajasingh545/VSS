/* Module dependencies */
import React from 'react';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import { connect } from 'react-redux';
import baseHOC from "./baseHoc";
import CustInput from '../common/CustInput';
import TimeField from '../common/TimePicker';
import {getCurrentDate, getReasons} from '../common/utility';
import { requestDetails, requestPost, listigDetails } from 'actions/workArrangement.actions';
import {getDetailsWithMatchedKey2} from '../common/utility';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from 'react-datepicker';
import moment from "moment";
import ReactTable from "react-table";
import { CSVLink } from "react-csv";

@connect(state => ({
  listingDetails: state.request.get('listingDetails'),
  requestDet: state.request.get('requestDet'),
}))
@baseHOC
class ReportSites extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption:"option1",
      projectTitle : "Select Project",
      showSubButton : false,
      team:[],
      startDate1: moment(),
      columns : [],
      data : [],
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
      console.log("==", nextProps);
    if(nextProps.requestDet && nextProps.requestDet.supervisorsList){
        this.setState({supervisors:nextProps.requestDet.supervisorsList});
        this.setState({projects:nextProps.requestDet.projects});
      
    }
   
  }
 
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  onSubmit = (type) =>{
    const {dispatch} = this.props;
    
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
    const data = [{
        desc:""
    },
    {
        desc:""
    },
    {
        desc:""
    },
    {
        desc:""
    },
    {
        desc:"Without deduct any hours"
    },
    {
        desc:"No.of efective hours used"
    },
    {
        desc:"Total manpower used"
    },
    {
        desc:"No.of Pax - Productive manpower used"
    },
    {
        desc:"Percentage"
    },
    {
        desc:"Site Name"
    },
    {
        desc:"Grade"
    }
];
      this.setState({data,columns});
  }
  onCheckBoxClick = (e)=>{
    e.stopPropagation();
    let id = e.target.value;
    let checked = e.target.checked;
  
    if(checked === true){
      this.selectedIds.push(id);
     }
     else{
       let index = this.selectedIds.indexOf(id);
       this.selectedIds.splice(index, 1);
     }
    //  console.log("selected ids", this.selectedIds)
     if(this.selectedIds.length > 0){
       this.setState({showSubButton:true});
     }else{
       this.setState({showSubButton:false});
     }

  }
  setReason = (key, list, stateKey) =>{
    this.timeValuesArr[stateKey] = key;
  }
  onTimeChange = (el)=>{
    // console.log("==$$==",el.value, el.name);

    this.timeValuesArr[el.name] = el.value;
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
                      selected={this.state.startDate1}
                    
                      className=" form-control"
                      isClearable={false}
                      onChange={this.onStartDateChange}
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
        <div className="col-sm-3"><label>Projects</label></div>
          <div className="col-sm-6">
          <Dropdown
                  title={this.state.projectTitle}
                  name="projectName"
                  keyName="projectId"
                  stateId="projects"
                  list={this.state.projects}
                  value={this.state.value_projects}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>
    
    
    <br/>
   
    <div className="row">
      
      <div className="col-sm-3">
        <CustomButton bsStyle="primary" id="submit" onClick={()=>this.onSubmit(1)} className="width50" type="submit">Submit</CustomButton>
      </div>
    </div>
    <br/>
    {columns.length > 0 && 
              <div>
                  <div className="col-sm-3">
                  <CSVLink data={data}><CustomButton bsStyle="primary" className="width50" id="submit">Download As Excel</CustomButton></CSVLink>
                    <br />
                  </div>
                <ReactTable
                    data={data}
                    columns={columns}
                    showPagination={false}
                    defaultPageSize={15}
                />
                </div>
              }
        
    </div>
    
    );
  }
}



export default ReportSites;