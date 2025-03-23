// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item

import { APP_KEY } from "/js/env.js";
import {
  cardKeys,
  aKeys,
  coverKeys,
  clKeys,
  ciKeys,
  cfiKeys,
} from "/js/back-up/keys.js";
import { downloadUrlRe, trelloHostRe, proxyHost } from "/js/back-up/url.js";

export const boardToFile = (board, zip) => {
  zip.file("_board.json", JSON.stringify(board, null, 2));
};

export const listToFile = (list, zip, i) => {
  list = { ...list };
  delete list.cards;
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

export const afToFile = async (a, zip, i, j, n, token) => {
  if (downloadUrlRe.test(a.url)) {
    const proxyUrl = a.url.replace(trelloHostRe, proxyHost);
    const res = await fetch(`${proxyUrl}?key=${APP_KEY}&token=${token}`);
    const blob = await res.blob();
    zip.file(`list${i}_card${j}_attachment${n}_file`, blob);
  }
};

export const coverToFile = (cover, a_s, zip, i, j) => {
  if (cover.color || cover.idAttachment || cover.idUploadedBackground) {
    const pos = a_s.findIndex((a) => a.id === cover.idAttachment);
    cover.attachmentPos = pos !== -1 ? pos + 1 : null;
    cover.unsplashUrl = cover.idUploadedBackground
      ? cover.sharedSourceUrl
      : null;
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
