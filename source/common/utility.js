export function getCurrentDate(separator = "-") {
  let newDate = new Date();
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();

  return `${date}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${year}`;
}
export function getCurrentTime(separator = ":") {
  let newDate = new Date();
  let hour = newDate.getHours();
  let minute = newDate.getMinutes();

  return `${hour}${separator}${minute}`;
}
export function addDays(now, add) {
  return now.setDate(now.getDate() + add);
}
export function subDays(now, add) {
  return now.setDate(now.getDate() - add);
}
export function getFormattedDate(dat) {
  let separator = "-";
  let newDate = new Date(dat);
  let date = newDate.getDate();
  let month = newDate.getMonth() + 1;
  let year = newDate.getFullYear();
  return `${date}${separator}${
    month < 10 ? `0${month}` : `${month}`
  }${separator}${year}`;
}
export function getDetailsWithLib2(listingDet, libArr) {
  // console.log(listingDet, libArr);
  let obj = {};
  obj.createdByName = listingDet.createdByName;
  obj.createdOn = listingDet.createdOn;
  if (libArr) {
    let supervisors = listingDet.addSupervsor.map((id) => {
      return getDetailsWithMatchedKey2(
        id,
        libArr.supervisorsList,
        "userId",
        "Name"
      );
    });
    obj.supervisor = getDetailsWithMatchedKey2(
      listingDet.baseSupervsor,
      libArr.supervisorsList,
      "userId",
      "Name"
    );
    obj.projectId = getDetailsWithMatchedKey2(
      listingDet.projectId,
      libArr.projects,
      "projectId",
      "projectName"
    );

    obj.createdOn = getFormattedDate(listingDet.createdOn);
    let workerids = listingDet.workers.map((id) => {
      return getDetailsWithMatchedKey2(
        id,
        libArr.workers,
        "workerIdActual",
        "workerName"
      );
    });
    if (listingDet.workersteamlist.length > 0) {
      let { team, workers } = libArr,
        { workersteamlist } = listingDet,
        newArrar = [];
      workersteamlist.map((worker) => {
        for (let i = 0; i < workers.length; i++) {
          if (worker.worker_id === workers[i].workerIdActual) {
            workers[i].team_id = worker.team_id;
            workers[i].team_name = worker.team_name;
            newArrar.push(workers[i]);
          }
        }
      });
      let emptyArr = team.map((_x) => {
        return getWorkersDetailsByTeam(
          _x.teamid,
          _x.teamName,
          newArrar,
          "workerName"
        );
      });
      let text = "";
      emptyArr.map((_x) => {
        if (_x !== undefined) {
          text += " + " + _x;
        }
      });

      text = text + " , " + obj.createdByName + " , " + obj.createdOn + " , ";
      obj.workerNames = text;
    }

    obj.supervisor2 = supervisors.join(",  ");
    obj.workerCount = listingDet.workers.length;
    obj.workArrangementId = listingDet.workArrangementId;
    obj.Remarks = listingDet.remarks;
    obj.isNew = listingDet.isNew;
  }
  return obj;
}

export function getDetailsWithMatchedKey2(id, lib, key, returnKey) {
  let returnValue = "";
  if (lib) {
    lib.map((value) => {
      if (value[key] == id) {
        returnValue = value[returnKey];
      }
    });
  }
  return returnValue;
}
export function getFieldSupervisorName(id, lib, key, returnKey) {
  let returnValue = [];
  if (lib) {
    for (let i = 0; i < id.length; i++) {
      const element = id[i];
      lib.map((value) => {
        if (value[key] == element) {
          returnValue.push(value[returnKey]);
        }
      });
    }
  }
  return returnValue;
}
export function getWorkersDetailsByTeam(tid, tna, nArr, returnKey) {
  let returnValue = "",
    nameArr = [];
  if (nArr) {
    nArr.map((value) => {
      if (value.team_id == tid && value.team_name == tna) {
        nameArr.push(value[returnKey]);
        returnValue = value[returnKey];
      }
    });
  }
  if (nameArr.length > 0) {
    return (
      tna + ": " + nameArr.length + "pax  ( " + nameArr.join(",  ") + " ) "
    );
  }
}
export function getPreviewContent(obj, libArr) {
  let detailsArr = {
    workArrangementId: obj.workArrangementId,
    projectId: getDetailsWithMatchedKey2(
      obj.projectId,
      libArr.projects,
      "projectId",
      "projectName"
    ),
    supervisor: getDetailsWithMatchedKey2(
      obj.value_supervisors,
      libArr.supervisors,
      "userId",
      "Name"
    ),
    supervisor2: getDetailsWithMatchedKey2(
      obj.value_supervisors2,
      libArr.supervisors,
      "userId",
      "Name"
    ),
    workerCount: obj.workerName.length,
    workerNames: obj.workerName.join(",  "),
    Remarks: obj.remarks,
  };

  return detailsArr;
}

export function getReasons() {
  return [
    { id: 1, reason: "MC" },
    { id: 2, reason: "Leave" },
    { id: 3, reason: "Absent" },
    { id: 4, reason: "Home Leave" },
    { id: 5, reason: "Late" },
    { id: 6, reason: "Early Start" },
    { id: 7, reason: "OT" },
    { id: 99, reason: "Others" },
  ];
}
export function truncate(string, length) {
  if (string.length > length) return string.substring(0, length) + "...";
  else return string;
}

export function getDetailsWithMatchedKeyObject(id, lib, key, returnKey) {
  const returnValue = "";
  if (lib) {
    for (const k in lib) {
      // eslint-disable-next-line eqeqeq
      const obj = lib[k].filter((item) => {
        // eslint-disable-next-line eqeqeq
        return item[key] == id;
      });

      if (obj[0] && obj[0][returnKey]) {
        return obj[0][returnKey];
      }
    }
  }
  return returnValue;
}
