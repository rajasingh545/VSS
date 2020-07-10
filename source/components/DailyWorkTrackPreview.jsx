

import React, { Component } from 'react';

import * as CONFIG from "../config/api-config";
import { getDetailsWithMatchedKey2} from '../common/utility';

import CustomButton from './CustomButton';

class DailyWorkTrackPreview extends Component{
   constructor(props){
       super(props)
       
     }
    
    setItemList = (itemList)=>{
        
       return itemList.map((item)=>{
       
           return(

               <div className="hrline"> 
                   <div className="row">
                   
                   <div className="col-sm-3"><label>Work Sub Division:</label></div>
                   <div className="col-sm-3 strong">{item.text_subdivision}</div>
                   </div>
                   <div className="row">
                           <div className="col-xs-3"> L: <span className="strong">{item.L}</span></div>
                           <div className="col-xs-3">W: <span className="strong">{item.W}</span></div>
                           <div className="col-xs-3">H: <span className="strong">{item.H}</span></div>
                       
                           <div className="col-xs-3">Set <span className="strong">{item.set}</span></div>
                       </div>
                       <div className="row">
                           <div className="col-sm-6"><label>Status:</label></div>
                           <div className="col-sm-6 strong">{item.text_workstatus}</div>
                       </div>
                  
                    {(item.value_workstatus == 2 || item.value_workstatus == 3) &&
                   <div className="row">
                           <div className="col-xs-3"> L: <span className="strong">{item.cL}</span></div>
                           <div className="col-xs-3">W: <span className="strong">{item.cW}</span></div>
                           <div className="col-xs-3">H: <span className="strong">{item.cH}</span></div>
                       
                           <div className="col-xs-3">Set <span className="strong">{item.cset}</span></div>
                       </div>
                    }
                     <div className="row">
                   <div className="col-sm-3"><label>Timing:</label></div>
                   <div className="col-sm-3 strong">{(item.timing == 1)? "Same":"Different"}</div>
                   
                   </div>
                   {item.timing == 2 &&
                   <div className="row">
                   <div className="col-sm-3"><label>Diff.Timing:</label></div>
                   <div className="col-sm-3 strong">{item.text_subdivision2}</div>
                   
                   </div>
                   }
                   
                 
               </div>

           )

       });
    }

    setTeamList = (itemList, curState)=>{
      
       return itemList.map((item)=>{
           let subdivid = "";
           if(item.value_subdivision2){
            subdivid = item.value_subdivision2;
           }else{
            subdivid = curState.value_subdivision;
           }
        let subdivisionTitle = getDetailsWithMatchedKey2(subdivid, curState.subItem, "itemId", "itemName");
           return(

               <div className="hrline">                    
                   
                   <div className="row">
                        <div className="col-sm-3"><label>Team/Type Worker:</label></div>
                        <div className="col-sm-3 strong">{item.text_team}</div>
                        
                        </div>
                        {curState.cType == 1 &&
                        <div className="row">
                        <div className="col-sm-3"><label>Sub Division:</label></div>
                        <div className="col-sm-3 strong">{subdivisionTitle}</div>
                        
                        </div>
                        }
                        <div className="row">
                            <div className="col-sm-3"><label>Worker Count:</label></div>
                            <div className="col-sm-3 strong">{item.workerCount}</div>
                        
                        </div>

                        <div className="row">
                            <div className="col-sm-3"><label>In Time</label></div>
                            <div className="col-sm-3 strong">{item.inTime}</div>
                        
                        </div>
                        <div className="row">
                            <div className="col-sm-3"><label>Out Time</label></div>
                            <div className="col-sm-3 strong">{item.outTime}</div>
                            
                        </div>

               </div>

           )

       });
    }
    setMaterialList =(itemList, curState) =>{
       return itemList.map((item)=>{
        let subdivid = "";
        if(item.value_subdivision2){
         subdivid = item.value_subdivision2;
        }else{
         subdivid = curState.value_subdivision;
        }
     let subdivisionTitle = getDetailsWithMatchedKey2(subdivid, curState.subItem, "itemId", "itemName");
           return(

               <div className="hrline">                    
                   
                   
                   <div className="row">
                        <div className="col-sm-3"><label>Material:</label></div>
                        <div className="col-sm-3 strong">{item.text_materials}</div>
                        
                        </div>
                        {curState.cType == 1 &&
                        <div className="row">
                        <div className="col-sm-3"><label>Sub Division:</label></div>
                        <div className="col-sm-3 strong">{subdivisionTitle}</div>
                        
                        </div>
                        }
                        <div className="row">
                            <div className="col-sm-3"><label>Worker Count:</label></div>
                            <div className="col-sm-3 strong">{item.mWorkerCount}</div>
                        
                        </div>
                        <div className="row">
                            <div className="col-sm-3"><label>In Time</label></div>
                            <div className="col-sm-3 strong">{item.minTime}</div>
                        
                        </div>
                        <div className="row">
                            <div className="col-sm-3"><label>Out Time</label></div>
                            <div className="col-sm-3 strong">{item.moutTime}</div>
                            
                        </div>

               </div>

              

           )

       });
    }
    edit = () =>{
        const {listingId} = this.props.curState;
        this.props.history.push('/DailyWorkTrack/'+listingId);
    }
   render(){

       const {curState, userType} = this.props;
      let imgURL = CONFIG.CONTEXT;
       return(
       <div>
           <br />
           <div className="container work-arr-container">
           {userType == 1 &&
            <div className="col-sm-6"><CustomButton bsStyle="primary"  id="draft" type="submit" onClick={()=>this.edit(1)}>Edit</CustomButton> </div>
           }
   <br /><br />
           <div className="row">
               <div className="col-sm-6"><label>Project:</label></div>
               <div className="col-sm-6 strong">{curState.text_projects}</div>
           </div>
           <div className="row">
           <div className="col-sm-6"><label>Client:</label></div>
           <div className="col-sm-6 strong">{curState.text_clients}</div>
           </div>
           <div className="row">
           <div className="col-sm-6"><label>Type:</label></div>
           <div className="col-sm-6 strong">{(curState.cType == 1)? "Work Request":"Others"}</div>
           </div>
           
           <div className="row">
           <div className="col-sm-6"><label>Base Supervisor:</label></div>
           <div className="col-sm-6 strong">{curState.text_basesupervisor}</div>
           </div>
           <div className="row">
           <div className="col-sm-6"><label>Field Supervisor:</label></div>
           <div className="col-sm-6 strong">{curState.text_supervisor}</div>
           </div>
           {curState.cType == 1 &&
           <div className="row">
           <div className="col-sm-6"><label>WR #</label></div>
           <div className="col-sm-6 strong">{curState.WRNOTitle || curState.text_wrno}</div>
           </div>
          
            }
             {curState.cType == 1 && curState.itemList && 
                   this.setItemList(curState.itemList)
           }
           {curState.teamList &&
                   <div>
                      {this.setTeamList(curState.teamList, curState)}
                   </div>
                  }
            {curState.materialList &&
            <div>
                {this.setMaterialList(curState.materialList, curState)}
            </div>
            }
            {curState.photo_1 != "" &&
            <div className="row">
            <div className="col-sm-6"><label>Photo 1</label></div>
            <div className="col-sm-6 strong"><a href={imgURL+"/"+curState.photo_1} target="_blank"><img src={imgURL+"/"+curState.photo_1} height="100px" width="200px" /></a></div>
           </div>
            }
             {curState.photo_2 != "" &&
           <div className="row"> 
            <div className="col-sm-6"><label>Photo 2</label></div>
            <div className="col-sm-6 strong"><a href={imgURL+"/"+curState.photo_2} target="_blank"><img src={imgURL+"/"+curState.photo_2}  height="100px" width="200px" /></a></div>
           </div>
             }
              {curState.photo_3 != "" &&
           <div className="row">
            <div className="col-sm-6"><label>Photo 3</label></div>
            <div className="col-sm-6 strong"><a href={imgURL+"/"+curState.photo_3} target="_blank"><img src={imgURL+"/"+curState.photo_3} height="100px" width="200px" /></a></div>
           </div>
              }
           <div className="row">
            <div className="col-sm-6"><label>Mat.Misuse</label></div>
            <div className="col-sm-6 strong">{(curState.matMisuse == 1)? "Yes":"No"}</div>
           </div>
           {curState.matPhotos != "" &&
           <div className="row">
            <div className="col-sm-6"><label>Photos</label></div>
            <div className="col-sm-6 strong"><a href={imgURL+"/"+curState.matPhotos} target="_blank"><img src={imgURL+"/"+curState.matPhotos} height="100px" width="200px" /></a></div>
           </div>
           }
           <div className="row">
            <div className="col-sm-6"><label>Remarks</label></div>
            <div className="col-sm-6 strong">{curState.matmisueremarks}</div>
           </div>
           <div className="row">
            <div className="col-sm-6"><label>Safty Vio.</label></div>
            <div className="col-sm-6 strong">{(curState.safetyvio == 1)? "Yes":"No"}</div>
           </div>
           {curState.safetyPhoto != "" &&
           <div className="row">
            <div className="col-sm-6"><label>Photos</label></div>
            <div className="col-sm-6 strong"><a href={imgURL+"/"+curState.safetyPhoto} target="_blank"><img src={imgURL+"/"+curState.safetyPhoto} height="100px" width="200px" /></a></div>
           </div>
           }
           <div className="row">
            <div className="col-sm-6"><label>Remarks</label></div>
            <div className="col-sm-6 strong">{curState.safetyvioremarks}</div>
           </div>

           </div>

       </div>
       );
   }

}
export default DailyWorkTrackPreview;