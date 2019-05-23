import React from 'react';

 const PreviewTemplate = (props) => {
  
     let {detailsArr, list, onCheckBoxClickCallBack, elementId} = props;
     console.log("detais", detailsArr);
    const onCheckBoxClick = (e, id)=>{
        e.stopPropagation();
        
        onCheckBoxClickCallBack(e.target.value, e.target.checked);
    
    };
    return(
        <div>
            {list === true && 
                <span ><input value={detailsArr.workArrangementId} type="checkbox" onClick={onCheckBoxClick}/> &nbsp;</span>
            }
            <span id={elementId}>
            <strong>{detailsArr.projectId}</strong> : {detailsArr.supervisor} &amp; {detailsArr.supervisor2} {detailsArr.workerCount > 0 && 
               <span>+{detailsArr.workerCount}pax ({detailsArr.workerNames})</span>
            } 
           </span>
           {detailsArr.Remarks &&
            <span>&nbsp;{detailsArr.Remarks}</span>
           }

        </div>
        );

}
export default PreviewTemplate;