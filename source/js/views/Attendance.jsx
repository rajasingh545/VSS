/* Module dependencies */
import React from 'react';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import CustInput from '../common/CustInput';
import TimeField from '../common/TimePicker';
import {getCurrentDate, getCurrentTime} from '../common/utility';

class Attedence extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption:"option1",
      project: [
        {
          id: 0,
          title: 'project1',
          selected: false,
          key: 'project'
        },
        {
          id: 1,
          title: 'project2',
          selected: false,
          key: 'project'
        },
        {
          id: 2,
          title: 'project3',
          selected: false,
          key: 'project'
        }
      ],
    };
    this.resetThenSet = this.resetThenSet.bind(this);   //this is required to bind the dispatch
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  
  resetThenSet(id, key){
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp
    });
  }
  handleOptionChange(changeEvent) {
    this.setState({
      selectedOption: changeEvent.target.value
    });
  }
  /* Render */
  render() {
    const {headerTitle} = this.state;
    let cDate = getCurrentDate();
    let cTime = getCurrentTime();
    console.log("==",cTime); 
    return (
    <div className="work-arr-container">
    <br/>
    <div className="row">
        <div className="col-sm-3"><label>Date</label></div>
        
        <div className="col-sm-3"> <CustInput type="text" value={cDate} readOnly/> </div>

    </div>
    <div className="row">
        <div className="col-sm-3"><label>Site</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.project}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>
  {/* map mutiple workers 8*/}
  <div className="companyWorksList">
   
    <div className="row">
      <div className="col-xs-1">
        <span>&nbsp;</span>
      </div>
      <div className="col-xs-6">
        <span><strong>Workers</strong></span>
      </div>

     <div className="col-sm-3">
        <label>
        <span>
            &nbsp;<input type="radio" value="option1" 
                        checked={this.state.selectedOption === 'option1'} 
                        onChange={this.handleOptionChange} />
            &nbsp;IN
        </span>&nbsp;&nbsp;
        <span>
            <input type="radio" value="option2" 
                        checked={this.state.selectedOption === 'option2'} 
                        onChange={this.handleOptionChange} />
            &nbsp;OUT
        </span>
        </label>
        </div>
    </div>
    <div className="row">
      <div className="col-xs-1">
        <span><input type="checkbox" /></span>
      </div>
      <div className="col-xs-6">
        <span>wrname1</span>
      </div>

      <div className="col-xs-3" style={{textAlign:"center"}}>
      <TimeField value = {cTime} className="width100" onChange={this.onTimeChange}/>
      </div>
      
    </div>
  </div>
    <div className="row">
        <div className="col-sm-6"><label>Remark</label></div>
          <div className="col-sm-6">
            <CustInput type="text" />
          </div>
    </div>
  {/* map mutiple site name with count of workers 
    <div className="row">
        <div className="col-xs-6"><label>Site Name1</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" className="width100" onChange={this.onTimeChange}/>
        </div>
       
    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name2</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" onChange={this.onTimeChange}/>
        </div>
    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name3</label></div>
          <div className="col-xs-6">
          <TimeField colon=":" onChange={this.onTimeChange}/>
        </div>
    </div>*/}
    <br/>
    <div className="row">
      <div className="col-sm-6">
        <CustomButton bsStyle="secondary" className="width50" id="draft" type="submit">Draft</CustomButton>
      </div>
      <div className="col-sm-6">
        <CustomButton bsStyle="primary" id="submit" className="width50" type="submit">Submit</CustomButton>
      </div>
    </div>
        
    </div>
    
    );
  }
}



export default Attedence;