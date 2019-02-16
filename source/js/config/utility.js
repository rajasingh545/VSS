

export function getDetailsWithLib(rawListingDet, libArr){

// console.log("libs", rawListingDet, libArr);
   
    let detailsArr = {};
    let requestTypes = Array();
        requestTypes[1] = "Request";
        requestTypes[2] = "Return";
        requestTypes[3] = "Transfer";
         let approxArr = Array();
         approxArr[1] = "Yes";
          approxArr[0] = "No";
        

    detailsArr = { 
        "request":{
            requestId : "REQ"+rawListingDet.request.requestId,
            reqID : rawListingDet.request.REQID,
            activeDoNumber : rawListingDet.request.activeDoNumber,
            formattedReqID : rawListingDet.request.requestNumber,
            requestType : requestTypes[rawListingDet.request.notificationType],
            projectIdFrom : getDetailsWithMatchedKey(rawListingDet.request.projectIdFrom, libArr["allprojects"], "projectId", "projectName"),
             projectIdTo : getDetailsWithMatchedKey(rawListingDet.request.projectIdTo, libArr["allprojects"], "projectId", "projectName"),
            createdBy : getDetailsWithMatchedKey(rawListingDet.request.createdBy, libArr["users"], "userId", "Name"),
            requestStatus : rawListingDet.request.requestStatus,
            description: rawListingDet.request.description,
            notificationNumber: rawListingDet.request.notificationNumber,
            rawRequestType : rawListingDet.request.notificationType,
            createdOn: formatDate(rawListingDet.request.createdOn),
            cRemarks:rawListingDet.request.remarks
            // DORemarks : rawListingDet.request.DORemarks,
            // driverId:getDetailsWithMatchedKey(rawListingDet.request.driverId, libArr["drivers"], "driverId", "driverName"),
            // vehicleId:getDetailsWithMatchedKey(rawListingDet.request.vehicleId, libArr["vehicles"], "vehicleId", "vehicleNumber"),
        }
    };
    if(rawListingDet.matRequests){
        let matRequest = [];
        let remarks = "";
        let driverId = "";
        let vehicleId = "";
        let driverRemarks = "";
        let doStatus = "";
        let collectionRemarks = "";
        rawListingDet.matRequests.map((value)=>{
           
                let req = {
                    categoryId : getDetailsWithMatchedKey(value.categoryId, libArr["category"], "categoryId", "categoryName"),
                    quantityRequested : value.quantityRequested,
                    quantityDelivered : value.quantityDelivered,
                    quantityRemaining : value.quantityRemaining,
                    quantityAccepted : value.quantityAccepted,
                    subCategoryId : getDetailsWithMatchedKey(value.subCategoryId, libArr["subCategory"], "subCategoryId", "subCategoryName"),
                    categoryUniqueId : value.categoryId+"-"+value.subCategoryId+"-"+value.quantityRequested,
                     description : value.description,
                     id:value.id,
                     approx :approxArr[value.approx],
                     rawRequestType : rawListingDet.request.notificationType
                     
                }
                remarks= value.DORemarks;
                driverId = value.driverId;
                vehicleId = value.vehicleId;
                driverRemarks = value.driverRemarks;
                doStatus = value.requestStatus;
                collectionRemarks = value.collectionRemarks;
                matRequest.push(req);
        });
        detailsArr.request.DORemarks= remarks;
        detailsArr.request.collectionRemarks= collectionRemarks;
        detailsArr.request.driverRemarks= driverRemarks;
        detailsArr.request.doStatus = doStatus;
        detailsArr.request.doStatus = doStatus;
        detailsArr.request.driverRawId = driverId;
        detailsArr.request.vehicleRawId = vehicleId;
        detailsArr.request.driverId= getDetailsWithMatchedKey(driverId, libArr["drivers"], "driverId", "driverName");
        detailsArr.request.vehicleId= getDetailsWithMatchedKey(vehicleId, libArr["vehicles"], "vehicleId", "vehicleNumber");
        detailsArr.matRequests = matRequest;
        
    }
    

    return detailsArr;
        
}
export function getDetailsWithMatchedKey(id, lib, key, returnKey){
    let returnValue = "";
    lib.map((value) =>{
        if(value[key] === id){
            returnValue = value[returnKey];
        }

    });
    return returnValue;
}
export function getListingId(id){
     return id.replace("REQ", "");
     
}
export function validateLoggedUser(){
    let userId = sessionStorage.getItem("userId");
    if(userId === ""){
        return false;
    }
    else{
        return true;
    }

}
export function formatDate(date) {
    let monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    date = new Date(date);
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }