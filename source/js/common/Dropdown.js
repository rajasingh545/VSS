import React, { Component } from 'react'
import {Glyphicon}  from 'react-bootstrap';
import './global.css'

class Dropdown extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title
    }
    this.close = this.close.bind(this)
  }

  componentDidUpdate(){
    const { listOpen } = this.state
    setTimeout(() => {
      if(listOpen){
        window.addEventListener('click', this.close)
      }
      else{
        window.removeEventListener('click', this.close)
      }
    }, 0)
  }
  componentWillUnmount(){
    window.removeEventListener('click', this.close)
  }

  close(timeOut){
    this.setState({
      listOpen: false
    })
  }

  selectItem(title, id, stateKey, value){
    let {list} = this.props;
    list.forEach(item => item.selected = false);
    list[id].selected = true;
   
    this.setState({
      headerTitle: title,
      listOpen: false
    }, this.props.resetThenSet(value, list, stateKey))
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render(){
    const{list, keyName, name, stateId} = this.props
    const{listOpen, headerTitle} = this.state
 
    return(
      
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <div className="dd-header-title">{headerTitle}</div>
          {listOpen
              ? <a href="#"><Glyphicon  glyph="menu-up" /></a>
              : <a href="#"><Glyphicon  glyph="menu-down"/></a>
          }
        </div>
        {listOpen && <ul className="dd-list" onClick={e => e.stopPropagation()}>
          {list.map((item, index)=> (
            <li className="dd-list-item" key={item[keyName]} onClick={() => this.selectItem(item[name], index, stateId, item[keyName])}>{item[name]} {item.selected && <Glyphicon glyph="glyphicon-check"/>}</li>
          ))}
        </ul>}
      </div>
    )
  }
}

export default Dropdown
