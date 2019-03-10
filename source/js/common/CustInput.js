import React from 'react';
import {FormControl} from 'react-bootstrap';
 const CustInput = (props) => {
    let additionalProps = {};
     if(props.type === "textarea"){
        additionalProps = {componentClass:"textarea"}
     }
    return (
      
        <FormControl
            {...additionalProps}
            {...props}
            className="width100"
           
          />
    );

}
export default CustInput;