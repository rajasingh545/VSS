
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';


export default class SizePreview extends Component {
  render() {
    const { item, onClose, index } = this.props;
    return (
      <Alert bsStyle="success" onDismiss={ () => onClose(index) }>
        <div>
          {item.text_scaffoldWorkType}, {item.text_scaffoldType}, {item.text_scaffoldSubcategory}- L:{item.L}, W:{item.W}, H:{item.H}, Set:{item.set}
        </div>
      </Alert>);
  }
}
