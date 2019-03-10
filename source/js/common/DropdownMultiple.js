import React, { Component } from 'react'
import {Glyphicon}  from 'react-bootstrap';
import './global.css'

class DropdownMultiple extends Component{
  constructor(props){
    super(props)
    this.state = {
      listOpen: false,
      headerTitle: this.props.title,
      timeOut: null
    }
    this.close = this.close.bind(this)
  }

  componentDidMount(props){
    const count = this.props.list.filter(function(a) { return a.selected; }).length;
    this.countUpdate(props, count);
  }
  componentWillReceiveProps(nextProps){
    const count = nextProps.list.filter(function(a) { return a.selected; }).length;
    this.countUpdate(nextProps, count);
  }
  countUpdate(props, count){
    if(count === 0){
      this.setState({headerTitle: this.props.title});
    }
    else if(count === 1){
      this.setState({headerTitle: `${count} ${props.titleHelper}`});
    }
    else if(count > 1){
      this.setState({headerTitle: `${count} ${props.titleHelper}s`});
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

  close(timeOut){
    this.setState({
      listOpen: false
    })
  }

  toggleList(){
    this.setState(prevState => ({
      listOpen: !prevState.listOpen
    }))
  }
  toggleSelected(id, key){
    let temp = this.state[key];
    temp[id].selected = !temp[id].selected
    this.setState({
      [key]: temp
    })
  }
  selectItem(index, stateKey, keyName){
    let {list} = this.props;
    // list.forEach(item => item.selected = false);
    list[index].selected = !list[index].selected;
   
    let selectedList = list.filter(item => item.selected === true);
    let selectedids = selectedList.map(item => item[keyName]);
     this.props.toggleItem(list, stateKey, selectedids);
  }


  render(){
    const{list, toggleItem, name, keyName, stateKey} = this.props
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
         {list.map((item, index) => (
           <li className="dd-list-item" key={item[keyName]} onClick={() => this.selectItem(index, stateKey, keyName)}>
             {item[name]} {item.selected && <a href="#"><Glyphicon  glyph="ok-circle"/></a>}
           </li>
          ))}
        </ul>}
      </div>
    )
  }

}

export default DropdownMultiple
