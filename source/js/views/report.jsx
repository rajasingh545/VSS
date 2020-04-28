import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { reportPost, requestDetails } from 'actions/request.actions';
import {getDetailsWithMatchedKey} from "../config/utility";

// import {getDetailsWithLib, validateLoggedUser} from "config/utility";
import baseHOC from "./baseHoc";

import ReactTable from "react-table";
import { ToastContainer, toast } from 'react-toastify';


@connect(state => ({

  requestDet: state.request.get('requestDet'),
  reportData: state.request.get('reportData'),
}))
@baseHOC
export default class Report extends Component {
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
    if(this.props.userType === "3"){
        this.state.requestStatus = 3;
    }
    else if(this.props.userType === "4"){
        this.state.requestStatus = 4;
    }
    else if(this.props.userType === "5"){
        
        this.state.requestStatus = 2;
    }

    if(this.state.requestStatus == 5 || this.state.requestStatus == 4 || this.state.requestStatus == 7){
        this.state.requestCode = 9;
    }
   
  }
  componentWillReceiveProps(nextProps){
    const {requestDet} = this.props;
    // console.log("nextProps",nextProps);

    if(nextProps.reportData){
      let data = [];
      let columns = [];
      if(this.state.requestCode == "3"){
        nextProps.reportData.map

        for (var key in nextProps.reportData) {
          let categoryName = getDetailsWithMatchedKey(nextProps.reportData[key].categoryId, requestDet["category"], "categoryId", "categoryName");
          let subCategoryName = getDetailsWithMatchedKey(key, requestDet["subCategory"], "subCategoryId", "subCategoryName");
          let price = getDetailsWithMatchedKey(key, requestDet["subCategory"], "subCategoryId", "price");
          let returnedQuantity = (nextProps.reportData[key].returnedQuantity)?nextProps.reportData[key].returnedQuantity:0;
          let balance = (nextProps.reportData[key].requestedQuantity - returnedQuantity);
          let amount = balance * parseFloat(price);
          let requestedQuantity = nextProps.reportData[key].requestedQuantity;

          returnedQuantity = (returnedQuantity == "" || isNaN(returnedQuantity)) ? 0 : returnedQuantity;
          balance = (balance == "" || isNaN(balance)) ? 0 : balance;
         
          requestedQuantity = (requestedQuantity == "" || isNaN(requestedQuantity)) ? 0 : requestedQuantity;
          amount =(amount == "" || isNaN(amount)) ? 0 : amount;
          amount = "$"+amount;
          price = "$"+price;
          // console.log(returnedQuantity, balance, amount, typeof balance,  typeof amount);
          data.push({
            ...nextProps.reportData[key],
            categoryName,
            subCategoryName,
            price,
            returnedQuantity,
            balance,
            amount,
            requestedQuantity
          });

        
        }

        this.setState({data});
        if(this.props.userType == 5){
        columns =  [ 
          {
            Header: 'Category',
            accessor: 'categoryName',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Sub Category',
            accessor: 'subCategoryName',
            headerClassName:"gridcolHeader"
           
          },
          
          {
            Header: 'Del. Qty',
            accessor: 'requestedQuantity',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Return Qty',
            accessor: 'returnedQuantity',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Balance Qty',
            accessor: 'balance',
            headerClassName:"gridcolHeader"
           
          }
          ];
        }else{
          columns =  [ 
            {
              Header: 'Category',
              accessor: 'categoryName',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: 'Sub Category',
              accessor: 'subCategoryName',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: '$ Price',
              accessor: 'price',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: 'Del. Qty',
              accessor: 'requestedQuantity',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: 'Return Qty',
              accessor: 'returnedQuantity',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: 'Balance Qty',
              accessor: 'balance',
              headerClassName:"gridcolHeader"
             
            },
            {
              Header: '$ Balance  Amount',
              accessor: 'amount',
              headerClassName:"gridcolHeader"
             
            }
            ];
        }
          this.setState({columns});
      }
      else{
        let data2 = [];
        for (var key in nextProps.reportData) {
          let categoryName = getDetailsWithMatchedKey(nextProps.reportData[key].categoryId, requestDet["category"], "categoryId", "categoryName");
          let subCategoryName = getDetailsWithMatchedKey(nextProps.reportData[key].subCategoryId, requestDet["subCategory"], "subCategoryId", "subCategoryName");
          let balance2=(parseFloat(nextProps.reportData[key].storeBalance)-parseFloat(nextProps.reportData[key].storeOut))+parseFloat(nextProps.reportData[key].storeIn);
          data2.push({
            ...nextProps.reportData[key],           
            subCategoryName,
            categoryName,
            balance2
          });
        }
        columns = [ 
          {
            Header: 'Material Name',
            accessor: 'categoryName',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Category',
            accessor: 'subCategoryName',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Opening Stock',
            accessor: 'storeBalance',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Stock Out',
            accessor: 'storeOut',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Stock In',
            accessor: 'storeIn',
            headerClassName:"gridcolHeader"
           
          },
          {
            Header: 'Balance',
            accessor: 'balance2',
            headerClassName:"gridcolHeader"
           
          }
          ];
        
        this.setState({data:data2});
        this.setState({columns})
      }

    }
  }
  handleRequestType = (e) => {
    const { dispatch } = this.props;
    let requestStatus = e.target.value;
    this.setState({data:[]});
    this.setState({materialName :""});
    this.setState({subCategorySel:""});
    this.setState({projects:""});
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
    this.state.requestCode = 2;
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
        
        <div className="row">
                <div className="col-xs-8">
                <ToastContainer autoClose={8000} />
                    <ul className="WorkOrderForm">
                    <li><strong>Report Type</strong></li>
                        <li>
                            
                            
                              <select id="reportType" name="reportType" className="ComboBox form-control" placeholder="Search By Status" value={this.state.reportType} onChange={this.handleRequestType}>
                              <option value="0">Select</option>
                              {(userType === "1" || userType === "3") && 
                               <option value="1">Stock</option>
                              }
                               {(userType === "1" || userType === "5") && 
                               <option value="2">Project</option>
                              }
                                 
                               
                            </select>
                            
                            
                        </li>
                        {this.state.reportType == 1 && requestDet &&
                        <div>
                <li><strong>Material Name</strong></li>
               
                    <li>
                        
                         <select name="materialName" value={this.state.materialName} className="ComboBox form-control" onChange={this.setSubCategory}>
                              <option value="">Select</option>
                              <option value="0">All</option>
                            {this.setDDOptions(requestDet["category"], "categoryId", "categoryName")}
                         </select>
                        
                        
                    </li>
                        

                    <li><strong> Category </strong></li>
                    <li id="materialCategoryListContainer">
                        <select name="subCategorySel" value={this.state.subCategorySel} className="ComboBox form-control" onChange={this.onSubCatChange}>
                             <option value="">All</option>
                            {this.setDDOptions(subCategory, "subCategoryId", "subCategoryName")}
                        </select>
                    </li> 
                    </div>
                }  

                 {this.state.reportType == 2 && requestDet &&
                 <div>
                  <li><strong> Project </strong></li>
                  <li id="materialCategoryListContainer">
                  <select name="projects" value={this.state.projects} className="ComboBox form-control" onChange={this.onProjectChange}>
                              <option value="">Select</option>
                            {this.setDDOptions(requestDet["projects"], "projectId", "projectName")}
                         </select>
                  </li> 
                </div>
                 }
                  {this.state.reportType == 3 && 
                 <div>
                  <li><strong> Notiifciation Number </strong></li>
                  <li id="materialCategoryListContainer">
                  <input type="text" name="notificationno" className=" form-control"/>
                  </li> 
                </div>
                 }
                    </ul>
                    <br />
                <div style={{width:"100%"}}>
                       
                  <input type="button" style={{width:"40%", float:"left"}} value="Submit" onClick={this.onClickSubmit} id="btBack" className="Button btn-block" />
                  &nbsp;<input type="button" style={{width: "40%", float: "right", marginTop:"0px"}} value="Reset" onClick={this.onClickReset} id="btBack" className="Button btn-block" />
                </div>
                </div>
                
            </div>
                    <br />
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
