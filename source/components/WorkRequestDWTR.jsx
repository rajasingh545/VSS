import React, { Component } from 'react';
import { toast } from 'react-toastify';
import CustInput from './CustInput';
import CustomButton from './CustomButton';
import Dropdown1 from './Dropdown1';
import * as API from '../config/api-config';

export default class WorkRequestDWTR extends Component {
  constructor() {
    super();

    this.state = {
      uniqueId: Date.now(),
    };
  }

  selectImages = (event) => {
    const ext = event.target.files[0].name.split('.');
  
    const data = new FormData();
    data.append('image', event.target.files[0], event.target.files[0].name);
    data.append('uniqueId', this.state.uniqueId);
    data.append('requestCode', 20);
    data.append('imagefor', event.target.name);
    this.setState({ [event.target.name]: `images/${ this.state.uniqueId }/${ event.target.name }.${ ext[1] }` });
  
    this.uploadImages(data);
  }

  uploadImages = (obj) => {
    fetch(API.WORKREQUEST_URI, {
      method: 'post',
      mode: 'cors',
      body: obj,
    }).then(response => response.json())
      .then(json => this.imageUploadSuccess(json));
  }
  imageUploadSuccess = (json) => {
    if (json.responsecode == 1) {
      toast.success('Image uploaded Successfully', { autoClose: 3000 });
    } else {
      toast.error(`Error: ${ json.response }`, { autoClose: 3000 });
    }
  }

    onFormChange = (e) => {
      if (e) {
        this.setState({ [e.target.name]: e.target.value });

        if (e.target.selectedIndex) {
          this.setState({ [`${ e.target.name }_text`]: e.target[e.target.selectedIndex].text });
        }
      }
    }

    onTimeChange = (val, name) => {
      const e = {
        target: {
          value: val.format('HH:mm'),
          name,
        },
      };
      this.onFormChange(e);
    }


    validateWorkRequestForm =() => {
      if ((typeof this.state.wrno === 'undefined' || this.state.wrno == '')) {
        toast.error('Please select work request id', { autoClose: 3000 });
        return false;
      }
      if ((typeof this.state.subdivision === 'undefined' || this.state.subdivision == '')) {
        toast.error('Please select sub division', { autoClose: 3000 });
        return false;
      }

      if (!this.state.L) {
        toast.error('Length is required', { autoClose: 3000 });
        return false;
      }
      if (!this.state.W) {
        toast.error('Width is required', { autoClose: 3000 });
        return false;
      }
      if (!this.state.H) {
        toast.error('Height is required', { autoClose: 3000 });
        return false;
      }
      if (!this.state.set) {
        toast.error('Set is required', { autoClose: 3000 });
        return false;
      }

      if ((typeof this.state.workstatus === 'undefined' || this.state.workstatus == '')) {
        toast.error('Please select work status', { autoClose: 3000 });
        return false;
      }


      return true;
    }

    handleSubmit = () => {
      if (this.validateWorkRequestForm() === true) {
        const list = {
          uniqueId: this.state.uniqueId,
          value_subdivision: this.state.subdivision,
          text_subdivision: this.state.subdivision_text,
          L: this.state.L,
          H: this.state.H,
          W: this.state.W,
          set: this.state.set,
          value_workstatus: this.state.workstatus,
          text_workstatus: this.state.workstatus_text,
          cL: this.state.cL,
          cH: this.state.cH,
          cW: this.state.cW,
          cset: this.state.cset,
          desc: this.state.desc,
          photo_1: this.state.photo_1,
          photo_2: this.state.photo_2,
          photo_3: this.state.photo_3,
        };

        this.props.handleSubmit(list);
      }
    }

    onItemChange = (e) => {
      const key = e.target.value;
      // console.log(this.state.items, this.state.items[key]);
      this.setState({ subItem: this.props.items[key] });
      this.onFormChange(e);
    }

    displayDesc = (e) => {
      const key = e.target.value;
      const selectedArr = this.state.subItem.filter((item) => key === item.itemId)[0];

      this.setState({ desc: selectedArr.desc });

      this.setState({ requestByName: selectedArr.requestBy });
      this.setState({ workType: selectedArr.type });
      this.onFormChange(e);
    }


    render() {
      return (

        <div className="orginalContract">


          <div className="row">
            <div className="col-xs-12">
              <label>WR #</label>
              <Dropdown1
                title="Select WR #"
                name="workRequestStrId"
                keyName="workRequestId"
                stateId="wrno"
                value={ this.state.value_item }
                list={ this.props.workRequests }
                resetThenSet={ this.onItemChange }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <label>WR Sub Division</label>
              <Dropdown1
                title={ this.state.divisionTitle }
                name="itemName"
                keyName="itemId"
                stateId="subdivision"
                list={ this.state.subItem }
                resetThenSet={ this.displayDesc }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12 red"> {this.state.desc}</div>

          </div>
          {this.state.requestByName != '' &&
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
              <div className="col-xs-3"> <CustInput size="4" type="number" name="L" value={ this.state.L } onChange={ this.onFormChange } /> L</div>
              <div className="col-xs-3"><CustInput size="4" type="number" name="W" value={ this.state.W } onChange={ this.onFormChange } />W</div>
              <div className="col-xs-3"><CustInput size="4" type="number" name="H" value={ this.state.H } onChange={ this.onFormChange } />H</div>

              <div className="col-xs-3"><CustInput size="4" type="number" name="set" value={ this.state.set } onChange={ this.onFormChange } />Set</div>
            </div>

            <div className="col-xs-3">
              <label>Status</label>

            </div>
            <div className="col-xs-9">
              <Dropdown1
                title={ this.state.statusTitle }
                name="value"
                keyName="id"
                stateId="workstatus"
                value={ this.state.value_workstatus }
                list={ this.props.workStatus }
                resetThenSet={ this.onFormChange }
              />
              <br /><br />
            </div>
            {(this.state.workstatus == 2 || this.state.workstatus == 3) &&
            <div >
              <div className="row">
                <div className="col-sm-12"><label>Comp/Full Size</label></div>
              </div>
              <div className="col-xs-3"> <CustInput size="4" type="number" name="cL" value={ this.state.cL } onChange={ this.onFormChange } /> L</div>
              <div className="col-xs-3"><CustInput size="4" type="number" name="cW" value={ this.state.cW } onChange={ this.onFormChange } />W</div>
              <div className="col-xs-3"><CustInput size="4" type="number" name="cH" value={ this.state.cH } onChange={ this.onFormChange } />H</div>

              <div className="col-xs-3"><CustInput size="4" type="number" name="cset" value={ this.state.cset } onChange={ this.onFormChange } />Set</div>
            </div>
  }
          </div>
}
          <br /><br />

          <div className="row" style={ { paddingTop: '15px' } }>
            <div className="col-xs-3">Upload Photo 1</div>
            <div className="col-xs-6"> <input type="file" name="photo_1" onChange={ this.selectImages } /></div>
          </div>
          <div className="row" style={ { paddingTop: '15px' } }>
            <div className="col-xs-3">Upload Photo 2</div>
            <div className="col-xs-6"> <input type="file" name="photo_2" onChange={ this.selectImages } /></div>
          </div>
          <div className="row" style={ { paddingTop: '15px' } }>
            <div className="col-xs-3">Upload Photo 2</div>
            <div className="col-xs-6"> <input type="file" name="photo_3" onChange={ this.selectImages } /></div>
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
      );
    }
}
