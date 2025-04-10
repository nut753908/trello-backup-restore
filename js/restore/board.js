// cf: custom field
// cfo: custom field option

import { objToLabel, objToCf, objToCfo } from "./obj.js";

export const getCurBoard = async (t) => {
  const board = await t.board("all");
  return {
    idBoard: board.id,
    idMembers: board.members.map((m) => m.id),
    labels: board.labels,
    cfs: board.customFields,
    isFree: board.paidStatus === "free",
  };
};

export const getMapIdLabel = async (
  token,
  idBoard,
  _labels,
  labels,
  addLabels
) => {
  const map = {};
  for (const l of _labels) {
    const curL = labels.find(
      (l2) => l.name === l2.name && l.color === l2.color
    );
    if (curL) {
      map[l.id] = curL.id;
    } else if (addLabels) {
      map[l.id] = await objToLabel(l, token, idBoard);
    }
  }
  return map;
};

export const getMapIdCf = async (token, idBoard, _cfs, cfs, addCfs) => {
  const mapIdCf = {};
  const mapIdCfo = {};
  for (const cf of _cfs) {
    const curCf = cfs.find(
      (cf2) => cf.name === cf2.name && cf.type === cf2.type
    );
    if (curCf) {
      mapIdCf[cf.id] = curCf.id;
      if (cf.options) {
        for (const o of cf.options) {
          // note: if several found, pick first one
          const curO = curCf.options.find(
            (o2) => o.value.text === o2.value.text && o.color === o2.color
          );
          if (curO) {
            mapIdCfo[o.id] = curO.id;
          } else if (addCfs) {
            mapIdCfo[o.id] = await objToCfo(o, token, curCf.id);
          }
        }
      }
    } else if (addCfs) {
      const newCf = await objToCf(cf, token, idBoard);
      mapIdCf[cf.id] = newCf.id;
      if (cf.options) {
        cf.options.forEach((o, i) => (mapIdCfo[o.id] = newCf.options[i].id));
      }
    }
  }
  return { mapIdCf, mapIdCfo };
};
