// m: member
// cf: custom field
// cfo: custom field option
// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  boardKeys,
  mKeys,
  labelKeys,
  cfKeys,
  cfoKeys,
  listKeys,
  cardKeys,
  aKeys,
  coverKeys,
  clKeys,
  ciKeys,
  cfiKeys,
  sKeys,
} from "/js/back-up/keys.js";
import { APP_KEY, PROXY_HOST } from "/js/common/env.js";
import { backoff } from "/js/common/backoff.js";

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

const downloadUrlRe =
  /^https:\/\/trello\.com\/1\/cards\/[0-9a-f]{24}\/attachments\/[0-9a-f]{24}\/download\/.+/;
const downloadHostRe = /^https:\/\/trello\.com/;

export const afToFile = async (a, zip, i, j, n, token) => {
  if (downloadUrlRe.test(a.url)) {
    const proxyUrl = a.url.replace(downloadHostRe, PROXY_HOST);
    const res = await backoff(
      () => fetch(`${proxyUrl}?key=${APP_KEY}&token=${token}`),
      false
    );
    const blob = await res.blob();
    zip.file(`list${i}_card${j}_attachment${n}_file`, blob);
  }
};

export const coverToFile = (cover, a_s, zip, i, j) => {
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
