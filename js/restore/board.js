// cf: custom field

import { objToLabel, objToCf } from "./file.js";

export const getCurBoard = async (t) => {
  const board = await t.board("all");
  return {
    idBoard: board.id,
    idMembers: board.members.map((m) => m.id),
    idLabels: board.labels.map((l) => l.id),
    idCfs: board.customFields.map((cf) => cf.id),
  };
};

export const getPreBoard = async (file) => {
  const text = await file.async("string");
  const board = JSON.parse(text);
  return {
    labels: board.labels,
    cfs: board.customFields,
  };
};

export const getMapIdLabel = async (
  token,
  idBoard,
  labels,
  idLabels,
  addLabels
) => {
  const map = {};
  for (let l of labels) {
    if (idLabels.indexOf(l.id) !== -1) {
      map[l.id] = l.id;
    } else if (addLabels) {
      map[l.id] = await objToLabel(l, token, idBoard);
    }
  }
  return map;
};

export const getMapIdCf = async (token, idBoard, cfs, idCfs, addCfs) => {
  const mapIdCf = {};
  const mapIdCfo = {};
  for (let cf of cfs) {
    if (idCfs.indexOf(cf.id) !== -1) {
      mapIdCf[cf.id] = cf.id;
      if (cf.options) {
        cf.options.forEach((o) => (mapIdCfo[o.id] = o.id));
      }
    } else if (addCfs) {
      const cf2 = await objToCf(cf, token, idBoard);
      mapIdCf[cf.id] = cf2.id;
      if (cf.options) {
        cf.options.forEach((o, i) => (mapIdCfo[o.id] = cf2.options[i].id));
      }
    }
  }
  return { mapIdCf, mapIdCfo };
};
