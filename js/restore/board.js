// cfo: custom field option
// cf: custom field

import { objToLabel, objToCfo, objToCf } from "./file.js";

export const getCurBoard = async (t) => {
  const board = await t.board("all");
  return {
    idBoard: board.id,
    idMembers: board.members.map((m) => m.id),
    idLabels: board.labels.map((l) => l.id),
    cfs: board.customFields,
  };
};

export const getPreBoard = async (file) => {
  const text = await file.async("string");
  const board = JSON.parse(text);
  return {
    _labels: board.labels,
    _cfs: board.customFields,
  };
};

export const getMapIdLabel = async (
  token,
  idBoard,
  _labels,
  idLabels,
  addLabels
) => {
  const map = {};
  for (let l of _labels) {
    if (idLabels.indexOf(l.id) !== -1) {
      map[l.id] = l.id;
    } else if (addLabels) {
      map[l.id] = await objToLabel(l, token, idBoard);
    }
  }
  return map;
};

export const getMapIdCf = async (token, idBoard, _cfs, cfs, addCfs) => {
  const mapIdCf = {};
  const mapIdCfo = {};
  for (let cf of _cfs) {
    const curCf = cfs.find(
      (cf2) => cf.name === cf2.name && cf.type === cf2.type
    );
    if (curCf) {
      mapIdCf[cf.id] = curCf.id;
      if (cf.options) {
        for (const o of cf.options) {
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
