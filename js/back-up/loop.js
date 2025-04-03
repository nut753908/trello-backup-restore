// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  listToFile,
  cardToFile,
  descToFile,
  aToFile,
  coverToFile,
  clToFile,
  ciToFile,
  cfiToFile,
  sToFile,
} from "./file.js";

const ascend = (a, b) => (a.pos > b.pos ? 1 : -1);

const loopA = (a_s, zip, i, j) =>
  a_s.forEach((a, _m) => {
    const m = _m + 1;
    aToFile(a, zip, i, j, m);
  });

const loopCi = (cis, zip, i, j, m) =>
  cis.sort(ascend).forEach((ci, _n) => {
    const n = _n + 1;
    ciToFile(ci, zip, i, j, m, n);
  });

const loopCl = (cls, zip, i, j) =>
  cls.sort(ascend).forEach((cl, _m) => {
    const m = _m + 1;
    clToFile(cl, zip, i, j, m);
    loopCi(cl.checkItems ?? null, zip, i, j, m);
  });

const loopCfi = (cfis, zip, i, j) =>
  cfis.forEach((cfi, _m) => {
    const m = _m + 1;
    cfiToFile(cfi, zip, i, j, m);
  });

const loopS = (ss, zip, i, j) =>
  ss.forEach((s, _m) => {
    const m = _m + 1;
    sToFile(s, zip, i, j, m);
  });

const loopCard = (cards, zip, i) =>
  cards.forEach((card) => {
    const j = card.j + 1;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    loopA(card.attachments, zip, i, j);
    coverToFile(card.cover, zip, i, j);
    loopCl(card.checklists, zip, i, j);
    loopCfi(card.customFieldItems, zip, i, j);
    loopS(card.stickers, zip, i, j);
  });

export const loopList = (lists, zip) =>
  lists.forEach((list) => {
    const i = list.i + 1;
    listToFile(list, zip, i);
    loopCard(list.cards, zip, i);
  });
