// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item

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
} from "/js/back-up/file.js";

const loopA = async (a_s, zip, i, j, token) => {
  for (const [_n, a] of a_s.entries()) {
    const n = _n + 1;
    aToFile(a, zip, i, j, n);
    await afToFile(a, zip, i, j, n, token);
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

const loopCard = async (cards, zip, i, token) => {
  for (const [_j, card] of cards.entries()) {
    const j = _j + 1;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    await loopA(card.attachments, zip, i, j, token);
    coverToFile(card.cover, card.attachments, zip, i, j);
    loopCl(card.checklists, zip, i, j);
    loopCfi(card.customFieldItems, zip, i, j);
  }
};

export const loopList = async (lists, zip, token) => {
  for (const [_i, list] of lists.entries()) {
    const i = _i + 1;
    listToFile(list, zip, i);
    await loopCard(list.cards, zip, i, token);
  }
};
