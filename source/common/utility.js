export function getCurrentDate(separator = '-') {
  const newDate = new Date();
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();

  return `${ date }${ separator }${ month < 10 ? `0${ month }` : `${ month }` }${ separator }${ year }`;
}
export function getCurrentTime(separator = ':') {
  const newDate = new Date();
  const hour = newDate.getHours();
  const minute = newDate.getMinutes();


  return `${ hour }${ separator }${ minute }`;
}
export function getFormattedDate(dat) {
  const separator = '-';
  const newDate = new Date(dat);
  const date = newDate.getDate();
  const month = newDate.getMonth() + 1;
  const year = newDate.getFullYear();
  return `${ date }${ separator }${ month < 10 ? `0${ month }` : `${ month }` }${ separator }${ year }`;
}
export function getDetailsWithLib2(listingDet, libArr) {
  const obj = {};
  if (libArr) {
    obj.supervisor2 = getDetailsWithMatchedKey2(listingDet.addSupervsor, libArr.supervisorsList, 'userId', 'Name');
    obj.supervisor = getDetailsWithMatchedKey2(listingDet.baseSupervsor, libArr.supervisorsList, 'userId', 'Name');
    obj.projectId = getDetailsWithMatchedKey2(listingDet.projectId, libArr.projects, 'projectId', 'projectName');

    obj.createdOn = getFormattedDate(listingDet.createdOn);
    const workerids = listingDet.workers.map((id) => {
      return getDetailsWithMatchedKey2(id, libArr.workers, 'workerIdActual', 'workerName');
    });
    obj.workerCount = listingDet.workers.length;
    obj.workerNames = workerids.join(',');
    obj.workArrangementId = listingDet.workArrangementId;
    obj.Remarks = listingDet.remarks;
  }
  return obj;
}

export function getDetailsWithMatchedKey2(id, lib, key, returnKey) {
  let returnValue = '';
  if (lib) {
    lib.map((value) => {
      if (value[key] == id) {
        returnValue = value[returnKey];
      }
    });
  }
  return returnValue;
}

export function getDetailsWithMatchedKeyObject(id, lib, key, returnKey) {
  let returnValue = '';
  if (lib) {
    for (let k in lib) {
      const obj = lib[k];
      console.log("==>", obj[0][returnKey], id, obj[0][key])
      if (obj[0][key] == id) {
        returnValue = obj[0][returnKey];
      }
    };
  }
  return returnValue;
}
export function getPreviewContent(obj, libArr) {
  const detailsArr = {
    workArrangementId: obj.workArrangementId,
    projectId: getDetailsWithMatchedKey2(obj.projectId, libArr.projects, 'projectId', 'projectName'),
    supervisor: getDetailsWithMatchedKey2(obj.value_supervisors, libArr.supervisors, 'userId', 'Name'),
    supervisor2: getDetailsWithMatchedKey2(obj.value_supervisors2, libArr.supervisors, 'userId', 'Name'),
    workerCount: obj.workerName.length,
    workerNames: obj.workerName.join(','),
    Remarks: obj.remarks,
  };


  return detailsArr;
}

export function getReasons() {
  return [
    { id: 1, reason: 'MC' },
    { id: 2, reason: 'Leave' },
    { id: 3, reason: 'Absent' },
    { id: 4, reason: 'Home Leave' },
    { id: 5, reason: 'Late' },
    { id: 99, reason: 'Others' },
  ];
}
export function truncate(string, length) {
  if (string.length > length) { return `${ string.substring(0, length) }...`; }
  return string;
}

