// cfo: custom field option
// cf: custom field
// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  memberKeys,
  labelKeys,
  cfoKeys,
  cfKeys,
  boardKeys,
  listKeys,
  cardKeys,
  aKeys,
  coverKeys,
  clKeys,
  ciKeys,
  cfiKeys,
  sKeys,
} from "./keys.js";

export const filterBoard = (board) => {
  board.members = board.members.map((m) =>
    memberKeys.reduce((o, k) => ({ ...o, [k]: m[k] }), {})
  );
  board.labels = board.labels.map((l) =>
    labelKeys.reduce((o, k) => ({ ...o, [k]: l[k] }), {})
  );
  board.customFields = board.customFields.map((cf) => {
    if (cf.options) {
      cf.options = cf.options.map((cfo) =>
        cfoKeys.reduce((o, k) => ({ ...o, [k]: cfo[k] }), {})
      );
    }
    return cfKeys.reduce((o, k) => ({ ...o, [k]: cf[k] }), {});
  });
  return boardKeys.reduce((o, k) => ({ ...o, [k]: board[k] }), {});
};

export const filterList = (list) =>
  listKeys.reduce((o, k) => ({ ...o, [k]: list[k] }), {});

export const filterCard = (card) => {
  card.idMembers = card.members.map((v) => v.id);
  card.idLabels = card.labels.map((v) => v.id);
  return cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
};

export const filterA = (a) => aKeys.reduce((o, k) => ({ ...o, [k]: a[k] }), {});

export const filterCover = (cover) => {
  if (cover.color || cover.idUploadedBackground) {
    cover.url = cover.idUploadedBackground ? cover.sharedSourceUrl : null;
    return coverKeys.reduce((o, k) => ({ ...o, [k]: cover[k] }), {});
  }
  return null;
};

export const filterCl = (cl) =>
  clKeys.reduce((o, k) => ({ ...o, [k]: cl[k] }), {});

export const filterCi = (ci) => {
  ci.checked = ci.state === "complete";
  return ciKeys.reduce((o, k) => ({ ...o, [k]: ci[k] }), {});
};

export const filterCfi = (cfi) =>
  cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi[k] }), {});

export const filterS = (s) => sKeys.reduce((o, k) => ({ ...o, [k]: s[k] }), {});
