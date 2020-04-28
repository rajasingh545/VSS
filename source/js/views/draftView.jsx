mport React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {DropdownButton, MenuItem} from "react-bootstrap"
import { requestDetails, requestPost } from 'actions/request.actions';


@connect(state => ({
  error: state.request.get('error'),
  loading: state.request.get('loading'),
  requestDet: state.request.get('requestDet'),
  requestPost: state.request.get('requestPost'),
}))
export default class MatRequest extends Component {


}