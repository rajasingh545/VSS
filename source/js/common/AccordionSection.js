import React, { Component } from 'react';
import { Glyphicon} from "react-bootstrap";

class AccordionSection extends Component {
 

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div
        style={{
            display: 'block',
            padding: '6px 0px',
            textDecoration: 'none',
            color: '#757575',
          
          padding: '5px 5px',
        }}
      >
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
         <Glyphicon glyph="duplicate"/>&nbsp;{label}
          <div style={{ float: 'right' }}>
            {!isOpen && <span>&#9660;</span>}
            {isOpen && <span>&#9650;</span>}
          </div>
        </div>
        {isOpen && (
          <div style={{fontSize:"9px"}}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default AccordionSection;