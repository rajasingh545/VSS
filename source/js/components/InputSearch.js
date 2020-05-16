import React , {Component} from 'react';

class InputSearch extends Component{
constructor(props){
super(props);
}
filterList =(event)=>{
  let updatedList = this.props.initialItems;
  updatedList = updatedList.filter(function(item){
    const keys = Object.keys(item);
    let i = 0;
    let result = false;
    for(i=0;i<keys.length;i++){
      result = item[keys[i]].toLowerCase().search(
        event.target.value.toLowerCase()) !== -1;
        if(result){
          break;
        }
    }
    return result;
  });
this.props.FilterData(updatedList);
}
render(){
return(

        <div className="input-group md-form form-sm form-1 pl-0">
        <div className="input-group-prepend">
          <span className="input-group-text pink lighten-3" id="basic-text1"><i className="fas fa-search text-white"
              ariaHidden="true"></i></span>
        </div>
        <input className="form-control my-0 py-1" style={{zIndex:1}} type="text" placeholder="Search" ariaLabel="Search" onChange={this.filterList} />
      </div>
    
)
}
}

export default InputSearch;