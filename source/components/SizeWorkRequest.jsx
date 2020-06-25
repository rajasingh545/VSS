
import React, { Component } from 'react';
import { toast } from 'react-toastify';
import Dropdown1 from './Dropdown1';
import CustInput from './CustInput';
import CustomButton from './CustomButton';


export default class SizeWorkRequest extends Component {
  constructor() {
    super();

    this.state = {
      subCategory: [],
    };
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
                type="number"
                name="L"
                value={ this.state.L }
                onChange={ this.onFormChange }
              /> L
            </div>
            <div className="col-xs-3">
              <CustInput
                size="4"
                type="number"
                name="W"
                value={ this.state.W }
                onChange={ this.onFormChange }
              />W
            </div>
            <div className="col-xs-3">
              <CustInput
                size="4"
                type="number"
                name="H"
                value={ this.state.H }
                onChange={ this.onFormChange }
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
