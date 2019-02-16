/* Module dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import Dropdown from '../common/Dropdown';



class WorkRequest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedOption:"option1",
      reasons: [
        {
          id: 0,
          title: 'MC',
          selected: false,
          key: 'reasons'
        },
        {
          id: 1,
          title: 'Leave',
          selected: false,
          key: 'reasons'
        },
        {
          id: 2,
          title: 'Absent',
          selected: false,
          key: 'reasons'
        },
        {
            id: 3,
            title: 'Home Leave',
            selected: false,
            key: 'reasons'
          },
          {
            id: 4,
            title: 'Late',
            selected: false,
            key: 'reasons'
          },
          {
            id: 5,
            title: 'Remarks',
            selected: false,
            key: 'reasons'
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
    <div className="container work-arr-container">
    
    <div className="row">
        <div className="col-sm-6"><label>Project</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.reasons}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Client</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.reasons}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>
    
    <div className="row">
        <div className="col-xs-6"><label>Work Request By</label></div>
          <div className="col-xs-6">
            <input type="text" />
          </div>
    </div>

    <div className="row">
        <div className="col-xs-3">
            <label>
             <input type="radio" value="OC" 
                        checked={this.state.selectedOption === 'OC'} 
                        onChange={this.handleOptionChange} />
            </label>
        </div>
        <div className="col-xs-3">
            <label>Original Contract</label>
        </div>
    </div>

    <div className="row">
        <div className="col-xs-3">
            <label>
            <input type="radio" value="VW" 
                        checked={this.state.selectedOption === 'VW'} 
                        onChange={this.handleOptionChange} />
            </label>
        </div>
        <div className="col-xs-3">
            <label>
                Variation Works
            
            </label>
        </div>
    </div>
    <div className="orginalContract">
        <div className="row">
            <div className="col-xs-6">
            <label>Items</label>
                <Dropdown
                    title="Select Items"
                    list={this.state.reasons}
                    resetThenSet={this.resetThenSet}
                />
            </div>
            <div className="col-xs-6">
            <label>Locations</label>
                <Dropdown
                    title="Select Locations"
                    list={this.state.reasons}
                    resetThenSet={this.resetThenSet}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-xs-3"><label><input type="radio" value="FS"/></label></div>
            <span className="col-xs-3">
                Full Size
            </span>
        </div>
        
        <div className="row">
            <div className="col-xs-3"><label><input type="radio" value="PS"/></label></div>
            <span className="col-xs-3">
                Partial Size
            </span>
        </div>
    </div>

    <div className="description">
        <div className="row">
            <div className="col-xs-6"><label>Description</label></div>
            <div className="col-xs-6">
                <input type="textarea" value=""/>
            </div>
        </div>
    </div>

    <div className="workBasedOn">
        <div className="row">
        <div className="col-sm-12">Work Based On</div>
        </div>
        <div className="row">
            <div className="col-xs-3">
                <label>
                    <input type="radio" value="S" 
                                checked={this.state.selectedOption === 'S'} 
                                onChange={this.handleOptionChange} />
                </label>
            </div>
            <div className="col-xs-3">
                Size
            </div>
        
        </div>
        <div className="row">
            <div className="col-xs-3">
                <label>
                    <input type="radio" value="MP" 
                                checked={this.state.selectedOption === 'MP'} 
                                onChange={this.handleOptionChange} />
                </label>
            </div>
            <div className="col-xs-3">
                ManPower
            </div>
        </div>
    </div>

    <div className="row">
        <div className="col-xs-6"><label>Type of Scaffolding Works</label></div>
          <div className="col-xs-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.reasons}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-xs-6"><label>Ref# WR</label></div>
          <div className="col-xs-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.reasons}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="sizeSelection">
    
        <div className="row">
            <div className="col-xs-6"><label>Scaffold Type</label></div>
            <div className="col-xs-6">
                <Dropdown
                    title="Select Project"
                    list={this.state.reasons}
                    resetThenSet={this.resetThenSet}
                />
            </div>
        </div>
        <div className="row">
            <div className="col-xs-6"><label>Scaffold Sub Category</label></div>
            <div className="col-xs-6">
                <Dropdown
                    title="Select Project"
                    list={this.state.reasons}
                    resetThenSet={this.resetThenSet}
                />
            </div>
        </div>

        <div className="row">
            <div className="col-sm-12"><label>Size</label></div>
        </div>
        <div className="row">
            <div className="col-xs-3"><input type="text" size="4"/>L</div>
            <div className="col-xs-3"><input type="text" size="4"/>W</div>
            <div className="col-xs-3"><input type="text" size="4"/>H</div>
            <div className="col-xs-3"><input type="text" size="4"/>Set</div>

        </div>
    </div>

    <div className="manPowerSelection">
        <div className="row">
            <div className="col-xs-6"><label>ManPower</label></div>
        </div>

        <div className="row">
            <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3"><input type="text" size="4"/></div>
            <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3"><input type="text" size="4"/></div>
        </div>

        <div className="row">
            <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3"><input type="text" size="4"/></div>
            <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3"><input type="text" size="4"/></div>
        </div>

        <div className="row">
            <div className="col-xs-12"><label>ManPower Time</label></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time IN</div>
            <div className="col-xs-3"><input type="text" size="8"/></div>
        </div>
        <div className="row">
            <div className="col-xs-3">Time OUT</div>
            <div className="col-xs-3"><input type="text" size="8"/></div>
        </div>
    </div>
    <div className="row">
      <div className="col-12">
        <button className="Button btn-block" id="draft" type="submit">Draft</button>
        <button className="Button btn-block" id="preview" type="submit">Preview</button>
        <button className="Button btn-block" id="submit" type="submit">Submit</button>
      </div>
    </div>
        
    </div>
    
    );
  }
}



export default WorkRequest;
