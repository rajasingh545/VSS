
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';


export default class ManPowerPreview extends Component {
  render() {
    const { item, onClose, index } = this.props;
    return (
      <Alert bsStyle="danger" onDismiss={ () => onClose(index) }>
        <div>
          Safety: {item.safety}, Supervisor: {item.supervisor}, Erectors: {item.erectors}, General Workers:{item.gworkers} - In Time:{item.inTime}, Out Time :{item.outTime}
        </div>
      </Alert>);
  }
}
