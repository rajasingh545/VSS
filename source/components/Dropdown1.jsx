import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';
import '../css/global.css';

class Dropdown1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
      list: this.props.list,
    };
    this.close = this.close.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list != this.props.list || nextProps.title != this.props.title) {
      this.setState({ list: nextProps.list, headerTitle: nextProps.title });
    }
    if (nextProps.value == '') {
      this.setState({ headerTitle: this.props.title });
    }
    if (nextProps.reset === true) {
      this.reset();
    }
  }
  componentDidUpdate() {
    const { listOpen } = this.state;
    setTimeout(() => {
      if (listOpen) {
        window.addEventListener('click', this.close);
      } else {
        window.removeEventListener('click', this.close);
      }
    }, 0);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.close);
  }

  reset() {
    this.setState({
      headerTitle: this.props.title,
    });
  }
  close() {
    this.setState({
      listOpen: false,
    });
  }

  selectItem = (e) => {
    this.props.resetThenSet(e);
  }

  toggleList() {
    this.setState(prevState => ({
      listOpen: !prevState.listOpen,
    }));
  }

  render() {
    const { keyName, name, stateId } = this.props;
    const { list, listOpen, headerTitle } = this.state;

    return (

      <div className="dd-wrapper">
        <select name={ stateId } key={ stateId } className="ComboBox form-control" onChange={ this.selectItem }>
          <option value="" >-Select-</option>

          {list.length > 0 &&
          list.map((item, index) => (
            <option
              style={ { textAlign: 'left' } }
              className="dd-list-item ellipsis"
              key={ item[keyName] }
              value={ item[keyName] }
              text={ item[name] }
            >{item[name]} {item.selected && <Glyphicon glyph="glyphicon-check" />}
            </option>
          ))
        }
        </select>
      </div>
    );
  }
}

export default Dropdown1;
