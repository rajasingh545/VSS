import React from 'react';
import {Button} from 'react-bootstrap';
 const CustomButton = (props) => {
    return (
        <Button {...props} className="width100">{props.children}</Button>
    );

}
export default CustomButton;