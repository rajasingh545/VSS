import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reportPost, requestDetails, requestPost } from 'actions/request.actions';
import {getDetailsWithMatchedKey} from "../config/utility";
import { Route } from 'react-router-dom';

// import {getDetailsWithLib, validateLoggedUser} from "config/utility";
import baseHOC from "./baseHoc";

import ReactTable from "react-table";
import { ToastContainer, toast } from 'react-toastify';

// const wrapLink = (id, txt)=>{
//   return(<a onClick={(id)=>redirectEdit(id,txt)} style={{cursor:"pointer"}}>{id}</a>)
// }

const wrapLink = (id,txt, doNumber) =>{
  return(
  <Route render={({ history}) => (
    <a
      type='button'
      onClick={() => { history.push('/DOEdit/REQ'+txt+"/"+doNumber) }}
    >
     {id}
    </a>
  )} />);
}
@connect(state => ({

  requestDet: state.request.get('requestDet'),
  requestPost: state.request.get('requestPost'),
}))
@baseHOC
export default class Alerts extends Component {
  static propTypes = {
    counter: PropTypes.number,
    // from react-redux connect
    dispatch: PropTypes.func,
  }
  constructor(props) {
    super(props);
    this.state = {
        requestCode:2,
        requestStatus:2,
        reportType:0,
        subCategory:[],
        data:[],
        columns:[],
        subCategorySel: "",
        materialName:"",
        projects:""
        
    };
    }
  componentDidMount(){
    const { dispatch, requestDet } = this.props;

    
    if(!requestDet){
     dispatch(requestDetails());
    }
    
    this.state.requestCode=11;
    dispatch(requestPost(this.state));
   
  }
  componentWillReceiveProps(nextProps){
    const {requestDet} = this.props;
    // console.log("nextProps",nextProps);

    if(nextProps.requestPost){
      let data = [];
      let columns = [];
      for (var key in nextProps.requestPost) {
        let item = {
          ...nextProps.requestPost[key],
          link: wrapLink(nextProps.requestPost[key].doId, nextProps.requestPost[key].requestId,nextProps.requestPost[key].doNumber)
        }
        data.push(item)
      }
      
        this.setState({data});


        columns =  [ 
          {
            Header: 'DO Number',
            accessor: 'link',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Request Id',
            accessor: 'formattedId',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Date Requested',
            accessor: 'dateRequested',
            headerClassName:"gridcolHeader"
           
          }
          ];
          this.setState({columns});
      

    }
  }

  handleRequestType = (e) => {
    const { dispatch } = this.props;
    let requestStatus = e.target.value;
    this.setState({data:[]});
    this.setState({reportType:requestStatus});


  }
  setDDOptions = (options, keyName, valueName) =>{
    return options.map((value)=>{
          return (<option key={value[keyName]} value={value[keyName]}>{value[valueName]}</option>);
    });
}
setSubCategory = (e)=>{
    const {requestDet} = this.props;
    let catId = e.target.value;
    let subCategory = [];
    this.setState({data:[]});
    if(catId){
        
        requestDet["subCategory"].map((value)=>{
            if(catId === value["categoryId"])
                subCategory.push(value);
        });
        
    }
    this.onFormChange(e);
    this.setState({subCategory});

  }
 
  onFormChange = (e) =>{
      
    if(e){
      //   console.log("e", e, e.target.name, e.target.value);
      this.setState({[e.target.name]: e.target.value});
    }
  }
  onSubCatChange = (e) =>{
    const { dispatch } = this.props;
    this.onFormChange(e);
    this.setState({data:[]});
    this.state.subCategorySel = e.target.value;
    this.state.requestCode = 2;
    // dispatch(reportPost(this.state));
  }
  onProjectChange = (e) =>{
    const { dispatch } = this.props;
    this.onFormChange(e);
    this.setState({data:[]});
    this.state.projects = e.target.value;
    this.state.requestCode = 3;
    
  }
  onClickReset = () =>{
    this.setState({reportType:0});
    this.setState({data:[]});
  }
  onClickSubmit = () =>{


    if(this.state.reportType == 0 ){
      toast.error("Please select report type", { autoClose: 3000 });
      return false;
     }
    if(this.state.reportType == 1){
     
      if(this.state.materialName == "" ){
        toast.error("Please select material name", { autoClose: 3000 });
        return false;
       }
      // if(this.state.subCategorySel == ""){
      //  toast.error("Please select category", { autoClose: 3000 });
      //  return false;
      // }
    }
    if(this.state.reportType == 2){
      if(this.state.projects == ""){
       toast.error("Please select project name", { autoClose: 3000 });
       return false;
      }
    }
    const { dispatch } = this.props;
    dispatch(reportPost(this.state));
  }
  render() {
    const {
        reportData, userType, requestDet
    } = this.props;
    let {subCategory, data, columns} = this.state;
    

// console.log("data", data);

  
    return (
      <div>
        
        
                <ToastContainer autoClose={8000} />
                 
            <div className="container" id="divRequestListing">
          {data.length > 0 && 
                
            <ReactTable
                data={data}
                columns={columns}
                showPagination={true}
                defaultPageSize={10}
            />
          }
          {data.length == 0 && columns.length != 0 &&
            <div style={{"color":"red", "width":"80%", "textAlign":"center", "textWeight":"bold", "paddingTop":"100px"}}>No Records Found</div>
          }
            </div>
      </div>
      
    );
  }
}
