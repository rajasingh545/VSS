
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';


export default class Popup extends Component {
  constructor() {
    super();

    this.state = {
      show: false,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ show: nextProps.show });
  }

  render() {
    return (
      <Modal show={ this.state.show } onHide={ this.props.handleClose } dialogClassName="modallg">
        <Modal.Header closeButton>
          <Modal.Title><strong>{this.props.title}</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.children}

        </Modal.Body>
      </Modal>);
  }
}
