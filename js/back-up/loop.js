// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  listToFile,
  cardToFile,
  descToFile,
  aToFile,
  afToFile,
  coverToFile,
  clToFile,
  ciToFile,
  cfiToFile,
  sToFile,
} from "./file.js";

const loopA = async (a_s, zip, i, j, token, withFile) => {
  for (const [_n, a] of a_s.entries()) {
    const n = _n + 1;
    aToFile(a, zip, i, j, n);
    await afToFile(a, zip, i, j, n, token, withFile);
  }
};

const loopCi = (cis, zip, i, j, n) => {
  for (const [_m, ci] of cis.entries()) {
    const m = _m + 1;
    ciToFile(ci, zip, i, j, n, m);
  }
};

const loopCl = (cls, zip, i, j) => {
  for (const [_n, cl] of cls.entries()) {
    const n = _n + 1;
    clToFile(cl, zip, i, j, n);
    loopCi(cl.checkItems ?? null, zip, i, j, n);
  }
};

const loopCfi = (cfis, zip, i, j) => {
  for (const [_n, cfi] of cfis.entries()) {
    const n = _n + 1;
    cfiToFile(cfi, zip, i, j, n);
  }
};

const loopS = (ss, zip, i, j) => {
  for (const [_n, s] of ss.entries()) {
    const n = _n + 1;
    sToFile(s, zip, i, j, n);
  }
};

const loopCard = async (cards, zip, i, token, withFile) => {
  for (const card of cards) {
    const j = card.j + 1;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    await loopA(card.attachments, zip, i, j, token, withFile);
    coverToFile(card.cover, card.attachments, zip, i, j);
    loopCl(card.checklists, zip, i, j);
    loopCfi(card.customFieldItems, zip, i, j);
    loopS(card.stickers, zip, i, j);
  }
};

export const loopList = async (lists, zip, token, withFile) => {
  for (const list of lists) {
    const i = list.i + 1;
    listToFile(list, zip, i);
    await loopCard(list.cards, zip, i, token, withFile);
  }
};
