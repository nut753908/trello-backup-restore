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
} from "./keys.js";
import { backoff } from "../common/backoff.js";
import {
  createList,
  createCard,
  createA,
  updateCard,
  createCl,
  createCi,
  updateCfis,
  addS,
} from "./api.js";

export const fileToList = async (file, token, idBoard, pos) => {
  const text = await file.async("string");
  let list = JSON.parse(text);
  list = listKeys.reduce((o, k) => ({ ...o, [k]: list?.[k] }), {});
  const res = await backoff(() => createList(token, idBoard, list, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ list, pos, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json?.id;
};

export const fileToCard = async (cardFile, descFile, token, idList, pos) => {
  const text = await cardFile.async("string");
  let card = JSON.parse(text);
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {});
  if (descFile) {
    card.desc = await descFile.async("string");
  }
  const res = await backoff(() => createCard(token, idList, card, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ idList, card, pos, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json?.id;
};

export const getIdA = async (file) => {
  const text = await file.async("string");
  const a = JSON.parse(text);
  return a.id;
};

export const fileToA = async (aFile, afFile, token, idCard, pos) => {
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
  const res = await backoff(() => createA(token, idCard, a, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ a, pos, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return a.file ? json?.id : null;
};

export const fileToCover = async (file, token, idCard, mapIdA) => {
  if (file) {
    const text = await file.async("string");
    let cover = JSON.parse(text);
    cover = coverKeys.reduce((o, k) => ({ ...o, [k]: cover?.[k] }), {});
    cover.idAttachment = mapIdA[cover.idAttachment];
    const res = await backoff(() => updateCard(token, idCard, { cover }));
    if (!res.ok) {
      throw new Error(
        JSON.stringify({ cover, status: res.status, url: res.url })
      );
    }
  }
};

export const fileToCl = async (file, token, idCard, pos) => {
  const text = await file.async("string");
  let cl = JSON.parse(text);
  cl = clKeys.reduce((o, k) => ({ ...o, [k]: cl?.[k] }), {});
  const res = await backoff(() => createCl(token, idCard, cl, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ idCard, cl, pos, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json?.id;
};

export const fileToCi = async (file, token, idCl, pos) => {
  const text = await file.async("string");
  let ci = JSON.parse(text);
  ci = ciKeys.reduce((o, k) => ({ ...o, [k]: ci?.[k] }), {});
  const res = await backoff(() => createCi(token, idCl, ci, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ ci, pos, status: res.status, url: res.url })
    );
  }
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
    const res = await backoff(() =>
      updateCfis(token, idCard, { customFieldItems: cfis })
    );
    if (!res.ok) {
      throw new Error(
        JSON.stringify({ cfis, status: res.status, url: res.url })
      );
    }
  }
};

export const fileToS = async (file, token, idCard) => {
  const text = await file.async("string");
  let s = JSON.parse(text);
  s = sKeys.reduce((o, k) => ({ ...o, [k]: s?.[k] }), {});
  const res = await backoff(() => addS(token, idCard, s));
  if (!res.ok) {
    throw new Error(JSON.stringify({ s, status: res.status, url: res.url }));
  }
};
