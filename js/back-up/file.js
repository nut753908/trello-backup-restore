// m: member
// cfo: custom field option
// cf: custom field
// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  mKeys,
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

export const boardToFile = (board, zip) => {
  board.members = board.members.map((m) =>
    mKeys.reduce((o, k) => ({ ...o, [k]: m[k] }), {})
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
  board = boardKeys.reduce((o, k) => ({ ...o, [k]: board[k] }), {});
  zip.file("_board.json", JSON.stringify(board, null, 2));
};

export const listToFile = (list, zip, i) => {
  list = listKeys.reduce((o, k) => ({ ...o, [k]: list[k] }), {});
  zip.file(`list${i}.json`, JSON.stringify(list, null, 2));
};

export const cardToFile = (card, zip, i, j) => {
  card.idMembers = card.members.map((v) => v.id);
  card.idLabels = card.labels.map((v) => v.id);
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
  zip.file(`list${i}_card${j}.json`, JSON.stringify(card, null, 2));
};

export const descToFile = (desc, zip, i, j) => {
  if (desc) {
    zip.file(`list${i}_card${j}_desc.md`, desc);
  }
};

export const aToFile = (a, zip, i, j, n) => {
  a = aKeys.reduce((o, k) => ({ ...o, [k]: a[k] }), {});
  zip.file(`list${i}_card${j}_attachment${n}.json`, JSON.stringify(a, null, 2));
};

export const coverToFile = (cover, zip, i, j) => {
  if (cover.color || cover.idAttachment || cover.idUploadedBackground) {
    cover.url = cover.idUploadedBackground ? cover.sharedSourceUrl : null;
    cover = coverKeys.reduce((o, k) => ({ ...o, [k]: cover[k] }), {});
    zip.file(`list${i}_card${j}_cover.json`, JSON.stringify(cover, null, 2));
  }
};

export const clToFile = (cl, zip, i, j, n) => {
  cl = clKeys.reduce((o, k) => ({ ...o, [k]: cl[k] }), {});
  zip.file(`list${i}_card${j}_checklist${n}.json`, JSON.stringify(cl, null, 2));
};

export const ciToFile = (ci, zip, i, j, n, m) => {
  ci.checked = ci.state === "complete";
  ci = ciKeys.reduce((o, k) => ({ ...o, [k]: ci[k] }), {});
  zip.file(
    `list${i}_card${j}_checklist${n}_checkitem${m}.json`,
    JSON.stringify(ci, null, 2)
  );
};

export const cfiToFile = (cfi, zip, i, j, n) => {
  cfi = cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi[k] }), {});
  zip.file(
    `list${i}_card${j}_customFieldItem${n}.json`,
    JSON.stringify(cfi, null, 2)
  );
};

export const sToFile = (s, zip, i, j, n) => {
  s = sKeys.reduce((o, k) => ({ ...o, [k]: s[k] }), {});
  zip.file(`list${i}_card${j}_sticker${n}.json`, JSON.stringify(s, null, 2));
};
