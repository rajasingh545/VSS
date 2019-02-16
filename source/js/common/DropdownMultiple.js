import React, { Component } from 'react'
import FontAwesome from 'react-fontawesome'
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

  render(){
    const{list, toggleItem} = this.props
    const{listOpen, headerTitle} = this.state
    return(
      <div className="dd-wrapper">
        <div className="dd-header" onClick={() => this.toggleList()}>
            <div className="dd-header-title">{headerTitle}</div>
            {listOpen
              ? <FontAwesome name="angle-up" size="2x"/>
              : <FontAwesome name="angle-down" size="2x"/>
            }
        </div>
       {listOpen && <ul className="dd-list" onClick={e => e.stopPropagation()}>
         {list.map((item) => (
           <li className="dd-list-item" key={item.title} onClick={() => toggleItem(item.id, item.key)}>
             {item.title} {item.selected && <FontAwesome name="check"/>}
           </li>
          ))}
        </ul>}
      </div>
    )
  }

}

export default DropdownMultiple
