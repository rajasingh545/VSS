import React from 'react';

export default function baseHOC(WrappedComponent) {
  return class PP extends React.Component {
    constructor(props) {
      super(props)      
      
    }
    componentDidMount(){
       
        let userId = sessionStorage.getItem("userId");
        //  console.log("userid", userId);
        if(userId == null){
            this.props.history.push('/Login');
        }
    }
    
    render() {
    const newProps = {        
          userId: sessionStorage.getItem("userId"),
          userType: sessionStorage.getItem("userType"),
          project: sessionStorage.getItem("project")        
      }
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}