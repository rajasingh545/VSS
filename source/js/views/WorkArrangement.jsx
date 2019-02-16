/* Module dependencies */
import React from 'react';

import DropdownMultiple from '../common/DropdownMultiple';
import Dropdown from '../common/Dropdown';



class WorkArrangement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      workers: [
        {
          id: 0,
          title: 'New York',
          selected: false,
          key: 'workers'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'workers'
        },
        {
          id: 2,
          title: 'Istanbul',
          selected: false,
          key: 'workers'
        },
        {
          id: 3,
          title: 'Dublin1',
          selected: false,
          key: 'workers'
        },
        {
          id: 4,
          title: 'Istanbul2',
          selected: false,
          key: 'workers'
        }
      ],
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
      location: [
        {
          id: 0,
          title: 'New York',
          selected: false,
          key: 'location'
        },
        {
          id: 1,
          title: 'Dublin',
          selected: false,
          key: 'location'
        },
        {
          id: 2,
          title: 'California',
          selected: false,
          key: 'location'
        },
        {
          id: 3,
          title: 'Istanbul',
          selected: false,
          key: 'location'
        },
        {
          id: 4,
          title: 'Izmir',
          selected: false,
          key: 'location'
        },
        {
          id: 5,
          title: 'Oslo',
          selected: false,
          key: 'location'
        },
        {
          id: 6,
          title: 'Zurich',
          selected: false,
          key: 'location'
        }
      ]
    };
    this.resetThenSet = this.resetThenSet.bind(this);   //this is required to bind the dispatch
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  toggleSelected(id, key){
    let temp = JSON.parse(JSON.stringify(this.state[key]))
    temp[id].selected = !temp[id].selected
    this.setState({
      [key]: temp
    })
  }
  resetThenSet(id, key){
    let temp = JSON.parse(JSON.stringify(this.state[key]));
    temp.forEach(item => item.selected = false);
    temp[id].selected = true;
    this.setState({
      [key]: temp
    });
  }
  componentWillReceiveProps(nextProps) {
    console.log('--in componentWillReceiveProps(nextProps) {');
    const count = nextProps.list.filter(function(a) { return a.selected; }).length;
    console.log("sssssss",count)
    if(count === 0){
      return {headerTitle: nextProps.title}
    }
    else if(count === 1){
      return {headerTitle: `${count} ${nextProps.titleHelper}`}
    }
    else if(count > 1){
      return {headerTitle: `${count} ${nextProps.titleHelper}s`}
    }
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
                  list={this.state.project}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Base Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.project}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Additional Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  list={this.state.project}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Workers</label></div>
          <div className="col-sm-6">
          <DropdownMultiple
              titleHelper="Workers"
              title="Select Workers"  
              headerTitle={headerTitle}
              list={this.state.location}
              toggleItem={this.toggleSelected}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Remark</label></div>
          <div className="col-sm-6">
            <input type="text" />
          </div>
    </div>

    <div className="row">
      <div className="col-sm-12">
      <div></div>
      <button className="Button btn-block" id="draft" type="submit">Draft</button>
      <button className="Button btn-block" id="preview" type="submit">Preview</button>
      <button className="Button btn-block" id="submit" type="submit">Submit</button>
      </div>
    </div>
        
    </div>
    
    );
  }
}



/* Export Home*/
export default WorkArrangement;