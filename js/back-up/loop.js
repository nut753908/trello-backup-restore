// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  filterList,
  filterCard,
  filterA,
  filterCover,
  filterCl,
  filterCi,
  filterCfi,
  filterS,
} from "./filter.js";

const ascend = (a, b) => (a.pos > b.pos ? 1 : -1);

const loopA = (as) => as.map((a) => filterA(a));

const loopCi = (cis) => cis.sort(ascend).map((ci) => filterCi(ci));

const loopCl = (cls) =>
  cls
    .sort(ascend)
    .map((cl) => ({ ...filterCl(cl), checkItems: loopCi(cl.checkItems) }));

const loopCfi = (cfis) => cfis.map((cfi) => filterCfi(cfi));

const loopS = (ss) => ss.map((s) => filterS(s));

const loopCard = (cards) =>
  cards.map((card) => ({
    ...filterCard(card),
    attachments: loopA(card.attachments),
    cover: filterCover(card.cover),
    checklists: loopCl(card.checklists),
    customFieldItems: loopCfi(card.customFieldItems),
    stickers: loopS(card.stickers),
  }));

export const loopList = (lists) =>
  lists.map((list) => ({ ...filterList(list), cards: loopCard(list.cards) }));
