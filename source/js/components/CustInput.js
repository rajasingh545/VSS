import React from 'react';
import {FormControl} from 'react-bootstrap';
 const CustInput = (props) => {
    let additionalProps = {};
     if(props.type === "textarea"){
        additionalProps = {componentClass:"textarea"}
     }
     if(props.type === "number"){
        additionalProps = {min:"0"}
     }
     const onKeyPressFn = (e)=>{
       
        if(props.type === "number"){
            let val = e.target.value;
            if(val < 0){
                return false;
            }
            if(!!(val % 1)){
                return false;
            }
        }
        if(typeof props.onChange == "function"){
            props.onChange(e);
        }
       
     }
    return (
      
        <FormControl
            {...additionalProps}
            {...props}
            className="width100"
            onChange = {onKeyPressFn}
          />
    );

}
export default CustInput;