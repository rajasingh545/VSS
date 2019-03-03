/* Module dependencies */
import React from 'react';
import Dropdown from '../common/Dropdown';
import {Button} from 'react-bootstrap';
import input from '../common/inputBox';

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
    return (
    <div className="work-arr-container">
    
    <div className="row">
        <div className="col-sm-6"><label>Attedence</label></div>
        <div className="col-sm-6">
        <label>
        <span>
            <input type="radio" value="option1" 
                        checked={this.state.selectedOption === 'option1'} 
                        onChange={this.handleOptionChange} />
            IN
        </span>
        <span>
            <input type="radio" value="option2" 
                        checked={this.state.selectedOption === 'option2'} 
                        onChange={this.handleOptionChange} />
            OUT
        </span>
        </label>
        </div>

    </div>
    <div className="row">
        <div className="col-sm-6"><label>Site</label></div>
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
        <div className="col-sm-12"><label>Company Workers</label></div>
    </div>

    <div className="row">
      <div className="col-xs-1">
        <span>1</span>
      </div>
      <div className="col-xs-3">
        <span>wrname1</span>
      </div>

      <div className="col-xs-2">
        <input type="text" size="4"/>
      </div>
      <div className="col-xs-6">
        <Dropdown
              title="Select Project"
              list={this.state.project}
              resetThenSet={this.resetThenSet}
        />
      </div>
    </div>
  </div>
    <div className="row">
        <div className="col-sm-6"><label>Remark</label></div>
          <div className="col-sm-6">
            <input type="text" />
          </div>
    </div>
  {/* map mutiple site name with count of workers */}
    <div className="row">
        <div className="col-xs-6"><label>Site Name1</label></div>
          <div className="col-xs-6">
          <input type="text" placeholder={"10"}/>
        </div>
       
    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name2</label></div>
          <div className="col-xs-6">
          <input type="text" placeholder={"20"}/>
        </div>
    </div>
    <div className="row">
    <div className="col-xs-6"><label>Site Name3</label></div>
          <div className="col-xs-6">
          <input type="text" placeholder={"30"}/>
        </div>
    </div>
    <br/>
    <div className="row">
      <div className="col-sm-6">
        <Button bsStyle="secondary" className="width50" id="draft" type="submit">Draft</Button>
      </div>
      <div className="col-sm-6">
        <Button bsStyle="primary" id="submit" className="width50" type="submit">Submit</Button>
      </div>
    </div>
        
    </div>
    
    );
  }
}



export default Attedence;