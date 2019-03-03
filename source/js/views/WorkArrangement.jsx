/* Module dependencies */
import React from 'react';
import { connect } from 'react-redux';
import DropdownMultiple from '../common/DropdownMultiple';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import baseHOC from "./baseHoc";
import { listigDetails, requestDetails, clearListing,requestPostClear } from 'actions/WorkArrangement.actions';

@connect(state => ({
  loading: state.request.get('loadingListing'),
listingDetails: state.request.get('listingDetails'),
requestDet: state.request.get('requestDet'),
}))
@baseHOC
class WorkArrangement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      workers: [],
      project: [],
      supervisors: []
    };
    this.resetThenSet = this.resetThenSet.bind(this);   //this is required to bind the dispatch
    this.toggleSelected = this.toggleSelected.bind(this);
  }
  componentWillMount(){
    const { dispatch } = this.props;
    this.state.userType = this.props.userType;
    this.state.userId = this.props.userId;
     dispatch(requestDetails(this.state));

  }
  componentWillReceiveProps(nextProps) {
    console.log("next props", nextProps);

    if(nextProps.requestDet){
      this.setState({workers:nextProps.requestDet.workers, projects:nextProps.requestDet.projects, supervisors:nextProps.requestDet.supervisors});

    }
  
  }
  toggleSelected(id, list, stateKey){
    this.setState({
      [stateKey]: list
    });
  }
  resetThenSet(key, list, stateKey){
    // let temp = this.state[key];
    // temp.forEach(item => item.selected = false);
    // temp[id].selected = true;
    this.setState({
      [stateKey]: list
    });
    let valuekey= `value_${stateKey}`;
    this.setState({valuekey:key});
  }
  
  /* Render */
  render() {
    const {headerTitle} = this.state;

    return (
    <div className="container work-arr-container">
    <br />
    <div className="row">
        <div className="col-sm-6"><label>Project</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Project"
                  name="projectName"
                  key="projectId"
                  stateId="projects"
                  list={this.state.projects}
                  
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Base Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Supervisor"
                  name="supervisorName"
                  key="supervisorId"
                  list={this.state.supervisors}
                  resetThenSet={this.resetThenSet}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Additional Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Supervisor"
                  name="supervisorName"
                  key="supervisorId"
                  list={this.state.supervisors}
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
              name="workerName"
              key="workerId"
              stateKey = "workers"
              headerTitle={headerTitle}
              list={this.state.workers}
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
<br />
    <div className="row">
      <div className="col-sm-3"><CustomButton bsStyle="secondary"  id="draft" type="submit">Draft</CustomButton> </div>
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit">Preview</CustomButton></div>
      <div className="col-sm-3"> <CustomButton bsStyle="primary"  id="submit" type="submit">Submit</CustomButton></div>
     
      
      </div>
    </div>
        
   
    
    );
  }
}



/* Export Home*/
export default WorkArrangement;