
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';


export default class MaterialPreview extends Component {
  render() {
    const { item, onClose, index } = this.props;
    return (
      <Alert bsStyle="danger" onDismiss={ () => onClose(index) } key={ index }>
        <div>
          {item.text_materials}, Worker Count: {item.workerCount}, In Time: {item.inTime}-Out Time:{item.outTime}
        </div>
      </Alert>);
  }
}
