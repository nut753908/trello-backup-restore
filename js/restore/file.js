// cf: custom field
// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  labelKeys,
  cfoKeys,
  cfKeys,
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
  createLabel,
  addCfo,
  createCf,
  createList,
  createCard,
  createA,
  updateCard,
  createCl,
  createCi,
  updateCfis,
  addS,
} from "./api.js";

export const objToLabel = async (label, token, idBoard) => {
  label = labelKeys.reduce((o, k) => ({ ...o, [k]: label[k] }), {});
  const res = await backoff(() => createLabel(token, idBoard, label));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ label, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json.id;
};

export const objToCfo = async (cfo, token, idCf) => {
  cfo = cfoKeys.reduce((o, k) => ({ ...o, [k]: cfo[k] }), {});
  const res = await backoff(() => addCfo(token, idCf, cfo));
  if (!res.ok) {
    throw new Error(JSON.stringify({ cfo, status: res.status, url: res.url }));
  }
  const json = await res.json();
  return json.id;
};

export const objToCf = async (cf, token, idBoard) => {
  cf = cfKeys.reduce((o, k) => ({ ...o, [k]: cf[k] }), {});
  const res = await backoff(() => createCf(token, idBoard, cf));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ idBoard, cf, status: res.status, url: res.url })
    );
  }
  return await res.json();
};

export const fileToList = async (file, token, idBoard, pos) => {
  const text = await file.async("string");
  let list = JSON.parse(text);
  list = listKeys.reduce((o, k) => ({ ...o, [k]: list[k] }), {});
  const res = await backoff(() => createList(token, idBoard, list, pos));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ list, pos, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json.id;
};

export const fileToCard = async (
  cardFile,
  descFile,
  token,
  idList,
  idMembers,
  mapIdLabel
) => {
  const text = await cardFile.async("string");
  let card = JSON.parse(text);
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
  if (descFile) {
    card.desc = await descFile.async("string");
  }
  card.idMembers = card.idMembers.filter((id) => idMembers.indexOf(id) !== -1);
  card.idLabels = card.idLabels.map((id) => mapIdLabel[id]).filter((id) => id);
  const res = await backoff(() => createCard(token, idList, card));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ idList, card, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json.id;
};

export const getIdA = async (file) => {
  const text = await file.async("string");
  const a = JSON.parse(text);
  return a.id;
};

export const fileToA = async (aFile, afFile, token, idCard) => {
  const text = await aFile.async("string");
  let a = JSON.parse(text);
  a = aKeys.reduce((o, k) => ({ ...o, [k]: a[k] }), {});
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
  if (!res.ok) {
    throw new Error(JSON.stringify({ a, status: res.status, url: res.url }));
  }
  const json = await res.json();
  return a.file ? json.id : null;
};

export const fileToCover = async (file, token, idCard, mapIdA) => {
  if (file) {
    const text = await file.async("string");
    let cover = JSON.parse(text);
    cover = coverKeys.reduce((o, k) => ({ ...o, [k]: cover[k] }), {});
    cover.idAttachment = mapIdA[cover.idAttachment];
    const res = await backoff(() => updateCard(token, idCard, { cover }));
    if (!res.ok) {
      throw new Error(
        JSON.stringify({ cover, status: res.status, url: res.url })
      );
    }
  }
};

export const fileToCl = async (file, token, idCard) => {
  const text = await file.async("string");
  let cl = JSON.parse(text);
  cl = clKeys.reduce((o, k) => ({ ...o, [k]: cl[k] }), {});
  const res = await backoff(() => createCl(token, idCard, cl));
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ idCard, cl, status: res.status, url: res.url })
    );
  }
  const json = await res.json();
  return json.id;
};

export const fileToCi = async (file, token, idCl, idMembers) => {
  const text = await file.async("string");
  let ci = JSON.parse(text);
  ci = ciKeys.reduce((o, k) => ({ ...o, [k]: ci[k] }), {});
  if (idMembers.indexOf(ci.idMember) === -1) {
    ci.idMember = null;
  }
  const res = await backoff(() => createCi(token, idCl, ci));
  if (!res.ok) {
    throw new Error(JSON.stringify({ ci, status: res.status, url: res.url }));
  }
};

export const filesToCfis = async (files, token, idCard, mapIdCf, mapIdCfo) => {
  if (files.length > 0) {
    const cfis = [];
    for (const file of files) {
      const text = await file.async("string");
      let cfi = JSON.parse(text);
      cfi = cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi[k] }), {});
      cfi.idCustomField = mapIdCf[cfi.idCustomField];
      cfi.idValue = mapIdCfo[cfi.idValue];
      if (cfi.idCustomField) {
        cfis.push(cfi);
      }
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
  s = sKeys.reduce((o, k) => ({ ...o, [k]: s[k] }), {});
  const res = await backoff(() => addS(token, idCard, s));
  if (!res.ok) {
    throw new Error(JSON.stringify({ s, status: res.status, url: res.url }));
  }
};
