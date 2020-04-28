import React, { Component } from 'react';

export default class Acknowledge extends Component {
  constructor(props) {
    super(props);

    

  }

  
  
  goBack = () => {    
     this.props.history.push('/Home'); 
  }

  render() {

    const reqid = this.props.location.search.replace("?req=","");
    return (
     <div>

            <div class=""><br /><br /></div>
            <div class="padding15">
                <div class=" Listing1 padding15">
                    <label id="items" class="">Approval Acknowledegement</label>
                    <p>Request updated Successfully</p>

                    <p>
                        <br /><br />Regards,
                        <br />Management
                    </p>
                </div>

            </div>

            <div class='row'>
                <div class="col-xs-3">
                </div>
                <div class="col-xs-5">
                    
                    <input type="button" value="Back" id="btBack" onClick={this.goBack} class="Button btn-block" />
                </div>
                <div class="col-xs-4">
                </div>

            </div>
    
     </div>
     
    );
  }
}
