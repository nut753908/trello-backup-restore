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

const loopA = (a_s, zip, i, j) =>
  a_s.forEach((a, _n) => {
    const n = _n + 1;
    aToFile(a, zip, i, j, n);
  });

const loopCi = (cis, zip, i, j, n) =>
  cis.forEach((ci, _m) => {
    const m = _m + 1;
    ciToFile(ci, zip, i, j, n, m);
  });

const loopCl = (cls, zip, i, j) =>
  cls.forEach((cl, _n) => {
    const n = _n + 1;
    clToFile(cl, zip, i, j, n);
    loopCi(cl.checkItems ?? null, zip, i, j, n);
  });

const loopCfi = (cfis, zip, i, j) =>
  cfis.forEach((cfi, _n) => {
    const n = _n + 1;
    cfiToFile(cfi, zip, i, j, n);
  });

const loopS = (ss, zip, i, j) =>
  ss.forEach((s, _n) => {
    const n = _n + 1;
    sToFile(s, zip, i, j, n);
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
