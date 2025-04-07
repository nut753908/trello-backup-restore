// cf: custom field
// cfo: custom field option
// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  objToList,
  objToCard,
  objToA,
  objToCover,
  objToCl,
  objToCi,
  objToCfis,
  objToS,
} from "./obj.js";

const loopA = async (as, token, idCard) => {
  for (const a of as) {
    await objToA(a, token, idCard);
  }
};

const loopCi = async (cis, token, idCl, idMembers) => {
  for (const ci of cis) {
    await objToCi(ci, token, idCl, idMembers);
  }
};

const loopCl = async (cls, token, idCard, idMembers) => {
  for (const cl of cls) {
    const idCl = await objToCl(cl, token, idCard);
    await loopCi(cl.checkItems, token, idCl, idMembers);
  }
};

const loopS = async (ss, token, idCard) => {
  for (const s of ss) {
    await objToS(s, token, idCard);
  }
};

const loopCard = async (
  cards,
  token,
  idList,
  idMembers,
  mapIdLabel,
  mapIdCf,
  mapIdCfo
) => {
  for (const card of cards) {
    const idCard = await objToCard(card, token, idList, idMembers, mapIdLabel);
    await loopA(card.attachments, token, idCard);
    await objToCover(card.cover, token, idCard);
    await loopCl(card.checklists, token, idCard, idMembers);
    await objToCfis(card.customFieldItems, token, idCard, mapIdCf, mapIdCfo);
    await loopS(card.stickers, token, idCard);
  }
};

export const loopList = async (
  lists,
  token,
  idBoard,
  idMembers,
  mapIdLabel,
  mapIdCf,
  mapIdCfo,
  toRight
) => {
  lists = toRight ? lists : lists.toReversed();
  const pos = toRight ? "bottom" : "top";
  for (const list of lists) {
    const idList = await objToList(list, token, idBoard, pos);
    await loopCard(
      list.cards,
      token,
      idList,
      idMembers,
      mapIdLabel,
      mapIdCf,
      mapIdCfo
    );
  }
};
