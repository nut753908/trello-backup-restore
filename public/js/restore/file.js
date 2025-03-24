// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  listKeys,
  cardKeys,
  aKeys,
  coverKeys,
  clKeys,
  ciKeys,
  cfiKeys,
  sKeys,
} from "/js/restore/keys.js";
import { backoff } from "/js/common/backoff.js";
import {
  createList,
  createCard,
  createA,
  updateCard,
  createCl,
  createCi,
  updateCfis,
  addS,
} from "/js/restore/api.js";

export const fileToList = async (file, token, idBoard) => {
  const text = await file.async("string");
  let list = JSON.parse(text);
  list = listKeys.reduce((o, k) => ({ ...o, [k]: list?.[k] }), {});
  const res = await backoff(() => createList(token, idBoard, list));
  const json = await res.json();
  return json?.id;
};

export const fileToCard = async (cardFile, descFile, token, idList) => {
  const text = await cardFile.async("string");
  let card = JSON.parse(text);
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {});
  if (descFile) {
    card.desc = await descFile.async("string");
  }
  const res = await backoff(() => createCard(token, idList, card));
  const json = await res.json();
  return json?.id;
};

export const getIdA = async (file) => {
  const text = await file.async("string");
  const a = JSON.parse(text);
  return a.id;
};

export const fileToA = async (aFile, afFile, token, idCard) => {
  const text = await aFile.async("string");
  let a = JSON.parse(text);
  a = aKeys.reduce((o, k) => ({ ...o, [k]: a?.[k] }), {});
  a.setCover = false;
  if (afFile) {
    a.file = new File(
      [await afFile.async("blob")],
      a.url
        ? decodeURI(a.url.split("/").pop())
        : decodeURI(a.name.split("/").pop())
    );
    delete a.url;
  }
  const res = await backoff(() => createA(token, idCard, a));
  const json = await res.json();
  return json?.id;
};

export const fileToCover = async (file, token, idCard, mapIdA) => {
  if (file) {
    const text = await file.async("string");
    let cover = JSON.parse(text);
    cover = coverKeys.reduce((o, k) => ({ ...o, [k]: cover?.[k] }), {});
    cover.idAttachment = mapIdA[cover.idAttachment];
    await backoff(() => updateCard(token, idCard, { cover }));
  }
};

export const fileToCl = async (file, token, idCard) => {
  const text = await file.async("string");
  let cl = JSON.parse(text);
  cl = clKeys.reduce((o, k) => ({ ...o, [k]: cl?.[k] }), {});
  const res = await backoff(() => createCl(token, idCard, cl));
  const json = await res.json();
  return json?.id;
};

export const fileToCi = async (file, token, idCl) => {
  const text = await file.async("string");
  let ci = JSON.parse(text);
  ci = ciKeys.reduce((o, k) => ({ ...o, [k]: ci?.[k] }), {});
  await backoff(() => createCi(token, idCl, ci));
};

export const filesToCfis = async (files, token, idCard) => {
  if (files.length > 0) {
    const cfis = [];
    for (const file of files) {
      const text = await file.async("string");
      let cfi = JSON.parse(text);
      cfi = cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi?.[k] }), {});
      cfis.push(cfi);
    }
    await backoff(() => updateCfis(token, idCard, { customFieldItems: cfis }));
  }
};

export const fileToS = async (file, token, idCard) => {
  const text = await file.async("string");
  let s = JSON.parse(text);
  s = sKeys.reduce((o, k) => ({ ...o, [k]: s?.[k] }), {});
  await backoff(() => addS(token, idCard, s));
};
