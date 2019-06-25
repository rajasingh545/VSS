import React, { Component } from 'react'
import {Glyphicon}  from 'react-bootstrap';
import './global.css'

class Dropdown extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
      list :this.props.list
    }
    this.close = this.close.bind(this)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.list != this.props.list || nextProps.title != this.props.title){
      
      this.setState({list:nextProps.list, headerTitle: nextProps.title});
    }
    if(nextProps.value == ""){      
      this.setState({headerTitle: this.props.title});
    }
    if(nextProps.reset === true){
      this.reset();
    }
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
  
  reset(){
    this.setState({
      headerTitle: this.props.title
    })
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
    }, this.props.resetThenSet(value, list, stateKey, title, list[id]))
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }

  render(){
    const{keyName, name, stateId} = this.props
    const{list, listOpen, headerTitle} = this.state
 
    return(
      
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
          <div className="dd-header-title ellipsis">{headerTitle}</div>
          {listOpen
              ? <a href="#"><Glyphicon  glyph="menu-up" /></a>
              : <a href="#"><Glyphicon  glyph="menu-down"/></a>
          }
        </div>
        {listOpen && <ul className="dd-list" onClick={e => e.stopPropagation()}>
          {list.map((item, index)=> (
            <li  style={{textAlign:"left"}} className="dd-list-item ellipsis" key={item[keyName]} onClick={() => this.selectItem(item[name], index, stateId, item[keyName])}>{item[name]} {item.selected && <Glyphicon glyph="glyphicon-check"/>}</li>
          ))}
        </ul>}
      </div>
    )
  }
}

export default Dropdown
