/* Module dependencies */
import React from 'react';
import { connect } from 'react-redux';
import DropdownMultiple from '../common/DropdownMultiple';
import Dropdown from '../common/Dropdown';
import CustomButton from '../common/CustomButton';
import CustInput from '../common/CustInput';
import baseHOC from "./baseHoc";
import { requestDetails, requestPost } from 'actions/WorkArrangement.actions';
import {Modal} from 'react-bootstrap';

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
      supervisors: [],
      show:false
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
      if( nextProps.requestDet.supervisors){
        this.setState({supervisors:nextProps.requestDet.supervisors});
      }
      else{
        
        this.setState({workers:nextProps.requestDet.workers, projects:nextProps.requestDet.projects});
      }
    }
  
  }
  getSupervisor = (key, list, stateKey) =>{
    const { dispatch } = this.props;
    this.state.requestCode = 1;
    this.state.projectId = key;
     dispatch(requestDetails(this.state));
     this.resetThenSet(key, list, stateKey);
  }
  toggleSelected(list, stateKey, selectedIds){
    this.setState({
      [stateKey]: list
    });
    this.setState({workerIds:selectedIds});
  }
  resetThenSet(key, list, stateKey){
    // let temp = this.state[key];
    // temp.forEach(item => item.selected = false);
    // temp[id].selected = true;
    this.setState({
      [stateKey]: list
    });
    
    let valuekey= `value_${stateKey}`;
    // console.log("====",valuekey, key);
    this.setState({[valuekey]:key});
  }
  setRemarks = (e) =>{
    let remarks = e.target.value;
    this.setState({remarks});
  }
  submitRequest = (status) =>{
    const { dispatch } = this.props;
    
    this.state.requestCode = 1;
    this.state.status = status;
    dispatch(requestPost(this.state));
    this.setState({show:true});
  }
  handleClose = () =>{
    this.setState({show:false, value_projectId:"", value_supervisorId:"", value_supervisors2:""});

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
                  keyName="projectId"
                  stateId="projects"
                  list={this.state.projects}
                  
                  resetThenSet={this.getSupervisor}
            />
          </div>
    </div>

    <div className="row">
        <div className="col-sm-6"><label>Base Supervisor</label></div>
          <div className="col-sm-6">
            <Dropdown
                  title="Select Supervisor"
                  name="Name"
                  keyName="userId"
                  stateId="supervisors"
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
                  name="Name"
                  keyName="userId"
                  stateId="supervisors2"
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
              keyName="workerId"
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
            <CustInput type="textarea" value={this.state.remarks} onChange={this.setRemarks} />
          </div>
    </div>
<br />
    <div className="row">
      <div className="col-sm-3"><CustomButton bsStyle="secondary"  id="draft" type="submit" onClick={()=>this.submitRequest(2)}>Draft</CustomButton> </div>
      <div className="col-sm-3">  <CustomButton bsStyle="warning"  id="preview" type="submit">Preview</CustomButton></div>
      <div className="col-sm-3"> <CustomButton bsStyle="primary"  id="submit" type="submit" onClick={()=>this.submitRequest(1)}>Submit</CustomButton></div>
     
      
      </div>

<Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title><strong>Request Confirmation</strong></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            
            <p>
             Work Arrangement Created Successfully
            </p>
           
          </Modal.Body>
          <Modal.Footer>
            <CustomButton bsStyle="secondary" onClick={this.handleClose}>Close</CustomButton>
          </Modal.Footer>
        </Modal>

    </div>
        
   
    
    );
  }
}



/* Export Home*/
export default WorkArrangement;