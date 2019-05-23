

import React, { Component } from 'react';

 class WorkRequestPreview extends Component{
    constructor(props){
        super(props)
        
      }
     
     setItemList = (itemList)=>{
       
        return itemList.map((item)=>{

            return(

                <div className="hrline"> 
                    <div className="row">
                    <div className="col-sm-3"><label>Items:</label></div>
                    <div className="col-sm-3 strong">{item.text_item}</div>
                    <div className="col-sm-3"><label>Location:</label></div>
                    <div className="col-sm-3 strong">{item.text_location}</div>
                    </div>
                    <div className="row">
                    <div className="col-sm-3"><label>Size Type:</label></div>
                    <div className="col-sm-3 strong">{(item.sizeType == 1)? "Full Size":"Partial Size"}</div>
                    <div className="col-sm-3"><label>Work Based On :</label></div>
                    <div className="col-sm-3 strong">{(item.workBased == 1)? "Size":"ManPower"}</div>
                    </div>
                    {item.workBased == 1 &&
                    <div>
                        <div className="row">
                            <div className="col-sm-6"><label>Scaffold Work Type:</label></div>
                            <div className="col-sm-6 strong">{item.text_scaffoldWorkType}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6"><label>Scaffold Type:</label></div>
                            <div className="col-sm-6 strong">{item.text_scaffoldType}</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-3"> L: <span className="strong">{item.L}</span></div>
                            <div className="col-xs-3">W: <span className="strong">{item.W}</span></div>
                            <div className="col-xs-3">H: <span className="strong">{item.H}</span></div>
                        
                            <div className="col-xs-3">Set <span className="strong">{item.Set}</span></div>
                        </div>

                    </div>
                    }

                    {item.workBased == 2 &&
                    
                    <div>
                    <div className="row">
                        <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3 strong">{item.safety}</div>
                        <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3 strong">{item.supervisor}</div>
                    </div>

                    <div className="row">
                        <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3 strong">{item.erectors}</div>
                        <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3 strong">{item.gworkers}</div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12"><label>ManPower Time</label></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">Time IN</div>
                        <div className="col-xs-3 strong">{item.inTime}</div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">Time OUT</div>
                        <div className="col-xs-3 strong">{item.outTime}</div>
                    </div>

                </div>
                }

                </div>

            )

        });
     }

     setsizeList = (itemList)=>{
       
        return itemList.map((item)=>{

            return(

                <div className="hrline">                    
                    
                    <div>
                        <div className="row">
                            <div className="col-sm-6"><label>Scaffold Work Type:</label></div>
                            <div className="col-sm-6 strong">{item.text_scaffoldWorkType}</div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6"><label>Scaffold Type:</label></div>
                            <div className="col-sm-6 strong">{item.text_scaffoldType}</div>
                        </div>
                        <div className="row">
                            <div className="col-xs-3"> L: <span className="strong">{item.L}</span></div>
                            <div className="col-xs-3">W: <span className="strong">{item.W}</span></div>
                            <div className="col-xs-3">H: <span className="strong">{item.H}</span></div>                       
                            <div className="col-xs-3">Set <span className="strong">{item.Set}</span></div>
                        </div>

                    </div>

                </div>

            )

        });
     }
     setManPowerList =(itemList) =>{
        return itemList.map((item)=>{

            return(

                <div className="hrline">                    
                    
                    
                    <div className="row">
                        <div className="col-xs-3"><label>Safety</label></div><div className="col-xs-3 strong">{item.safety}</div>
                        <div className="col-xs-3"><label>Supervisor</label></div><div className="col-xs-3 strong">{item.supervisor}</div>
                    </div>

                    <div className="row">
                        <div className="col-xs-3"><label>Erectors</label></div><div className="col-xs-3 strong">{item.erectors}</div>
                        <div className="col-xs-3"><label>General Workers</label></div><div className="col-xs-3 strong">{item.gworkers}</div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12"><label>ManPower Time</label></div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">Time IN</div>
                        <div className="col-xs-3 strong">{item.inTime}</div>
                    </div>
                    <div className="row">
                        <div className="col-xs-3">Time OUT</div>
                        <div className="col-xs-3 strong">{item.outTime}</div>
                    </div>

                </div>

               

            )

        });
     }
   
    render(){

        const {curState} = this.props;
        return(
        <div>
            <div className="container work-arr-container">
    
            <div className="row">
                <div className="col-sm-6"><label>Project:</label></div>
                <div className="col-sm-6 strong">{curState.text_projects}</div>
            </div>
            <div className="row">
            <div className="col-sm-6"><label>Client:</label></div>
            <div className="col-sm-6 strong">{curState.text_clients}</div>
            </div>

            <div className="row">
            <div className="col-sm-6"><label>Requested By:</label></div>
            <div className="col-sm-6 strong">{curState.requestBy}</div>
            </div>
            <div className="row">
            <div className="col-sm-6"><label>Contract Type:</label></div>
            <div className="col-sm-6 strong">{(curState.cType == 1)? "Orginal Contarct":"Variation Works"}</div>
            </div>
            {curState.cType == 1 && 
                    this.setItemList(curState.itemList)
            }
            {curState.cType == 2 && 
                <div>
                
                    <div className="row">
                    
                    <div className="col-sm-3"><label>Work Based On :</label></div>
                    <div className="col-sm-3 strong">{(curState.workBased == 1)? "Size":"ManPower"}</div>
                    </div>
                    {curState.workBased == 1 &&
                        this.setsizeList(curState.sizeList)
                    }
                     {curState.workBased == 2 &&
                        this.setManPowerList(curState.manpowerList)
                    }

                    </div>
            }
            </div>

        </div>
        );
    }

}
export default WorkRequestPreview;