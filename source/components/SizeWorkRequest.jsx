
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import Dropdown1 from './Dropdown1';
import CustInput from './CustInput';
import CustomButton from './CustomButton';
// import baseHOC from "../pages/baseHOC";
import { workRequestPost } from '../actions/workArrangement.actions';

@connect((state) => ({
  loading: state.request.get('loadingListing'),
  listingDetails: state.request.get('listingDetails'),
  workRequestData: state.request.get('workRequestData'),
  requestDet: state.request.get('requestDet'),
}))
export default class SizeWorkRequest extends Component {
  constructor() {
    super();

    this.state = {
      subCategory: [],
      completedTotal: 0,
    };
  }
  componentDidMount() {
    const { dispatch, contractId } = this.props;
    const request = {
      requestCode: 30,
      contractId,
    };
    dispatch(workRequestPost(request));
  }

  componentWillReceiveProps(nextProps) {

    const addedSize = nextProps.sizeList.length > 0 ? this.getAddedSize(this.props.sizeList) : 0;
    
    if (nextProps.workRequestData) {
      const total = nextProps.workRequestData.total ? (nextProps.workRequestData.total - addedSize) : 0 
      this.setState({ completedTotal: total});
      this.setState({ remainingSize: parseInt(this.props.contractSize) - parseInt(total) });
    }
  }

  getAddedSize = (sizeList) => {
    let addedSize = 0;

    sizeList.map((size) => {
      addedSize = addedSize + parseInt(size.H * size.L * size.W * size.set);
    });
    return addedSize;
  }

  onFormChange = (e) => {
    if (e) {
      this.setState({ [e.target.name]: e.target.value });

      if (e.target.selectedIndex) {
        this.setState({ [`${ e.target.name }_text`]: e.target[e.target.selectedIndex].text });
      }
    }
  }

  populateSubCat = (e) => {
    const key = e.target.value;
    this.setState({ subCategory: this.props.subCategory[key] });
    this.onFormChange(e);
  }

  validateSizeForm =() => {
    if (typeof this.state.scaffoldWorkType === 'undefined' || this.state.scaffoldWorkType === '') {
      toast.error('Please select scaffold work type', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.scaffoldType === 'undefined' || this.state.scaffoldType === '') {
      toast.error('Please select scaffold type', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.scaffoldSubcategory === 'undefined' || this.state.scaffoldSubcategory === '') {
      toast.error('Please select scaffold subcategory', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.L === 'undefined' || this.state.L == '' || this.state.L == 0) {
      toast.error('Length cant be empty', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.H === 'undefined' || this.state.H == '' || this.state.H == 0) {
      toast.error('Height cant be empty', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.W === 'undefined' || this.state.W == '' || this.state.W == 0) {
      toast.error('Width cant be empty', { autoClose: 3000 });
      return false;
    }
    if (typeof this.state.set === 'undefined' || this.state.set == '' || this.state.set == 0) {
      toast.error('Set cant be empty', { autoClose: 3000 });
      return false;
    }

    const enteredSize = this.state.L * this.state.H * this.state.W * this.state.set;

    if(enteredSize > this.state.remainingSize){
      toast.error('Entered size can not be more that remaining size', { autoClose: 3000 });
      return false;
    }
    return true;
  }

  handleSubmit = () => {
    if (this.validateSizeForm() === true) {
      const sizeList = {
        value_scaffoldWorkType: this.state.scaffoldWorkType,
        text_scaffoldWorkType: this.state.scaffoldWorkType_text,
        value_scaffoldType: this.state.scaffoldType,
        text_scaffoldType: this.state.scaffoldType_text,
        value_scaffoldSubcategory: this.state.scaffoldSubcategory,
        text_scaffoldSubcategory: this.state.scaffoldSubcategory_text,
        L: this.state.L,
        H: this.state.H,
        W: this.state.W,
        set: this.state.set,
      };

      this.props.handleSubmit(sizeList);
    }
  }


  render() {
    return (
      <div>
        <div className="row">
          <div className="col-xs-6"><label>Type of Scaffolding Works</label></div>
          <div className="col-xs-6">
            <Dropdown1
              title="select"
              name="scaffoldName"
              keyName="id"
              stateId="scaffoldWorkType"
              list={ this.props.scaffoldWorkType }
              resetThenSet={ this.onFormChange }
              key="1"
            />
          </div>
        </div>


        <div className="sizeSelection">

          <div className="row">
            <div className="col-xs-6"><label>Scaffold Type</label></div>
            <div className="col-xs-6">

              <Dropdown1
                title="select"
                name="scaffoldName"
                keyName="id"
                stateId="scaffoldType"
                list={ this.props.scaffoldTypeList }
                resetThenSet={ this.populateSubCat }
                key="2"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6"><label>Scaffold Sub Category</label></div>
            <div className="col-xs-6">
              <Dropdown1
                title="select"
                name="scaffoldSubCatName"
                keyName="scaffoldSubCateId"
                stateId="scaffoldSubcategory"
                list={ this.state.subCategory }
                resetThenSet={ this.onFormChange }
                key="3"
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-12"><label>Size</label></div>
          </div>
          <div className="row">
            <div className="col-xs-3">
              <CustInput
                size="4"
                type="float"
                name="L"
                value={ this.state.L }
                onChange={ this.onFormChange }

              /> L
            </div>
            <div className="col-xs-3">
              <CustInput
                size="4"
                type="float"
                name="W"
                value={ this.state.W }
                onChange={ this.onFormChange }
                step="any"
              />W
            </div>
            <div className="col-xs-3">
              <CustInput
                size="4"
                type="float"
                name="H"
                value={ this.state.H }
                onChange={ this.onFormChange }
                step="any"
              />H
            </div>

            <div className="col-xs-3">
              <CustInput
                size="4"
                type="number"
                name="set"
                value={ this.state.set }
                onChange={ this.onFormChange }
              />Set
            </div>
          </div>
          <br />
          <br />
          <div className="row">
            <div className="col-sm-6"><label>Total Contract Size:</label></div>
    <div className="col-sm-6"><label><strong>{this.props.contractDesc} ({this.props.contractSize})</strong></label></div>
          </div>
          <div className="row">
            <div className="col-sm-3"><label>Completed Size:</label></div>
    <div className="col-sm-3"><label><strong>{this.state.completedTotal}</strong></label></div>
    <div className="col-sm-3"><label>Remaining Size:</label></div>
    <div className="col-sm-3"><label><strong>{this.state.remainingSize}</strong></label></div>
          </div>

          <br />
          <hr />
          <br />
          <div className="row">
            <div className="col-12">
              <div className="col-sm-6"> <CustomButton bsStyle="secondary" onClick={ this.props.handleClose }>Cancel</CustomButton></div>
              <div className="col-sm-6"> <CustomButton bsStyle="primary" onClick={ this.handleSubmit }>Submit</CustomButton></div>
            </div>
          </div>
        </div>
      </div>);
  }
}
