import { objToLabel } from "./file.js";

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
