// cf: custom field
// cfo: custom field option
// a: attachment
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  labelKeys,
  cfKeys,
  cfoKeys,
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
  createCf,
  addCfo,
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

export const objToCfo = async (cfo, token, idCf) => {
  cfo = cfoKeys.reduce((o, k) => ({ ...o, [k]: cfo[k] }), {});
  const res = await backoff(() => addCfo(token, idCf, cfo));
  if (!res.ok) {
    throw new Error(JSON.stringify({ cfo, status: res.status, url: res.url }));
  }
  const json = await res.json();
  return json.id;
};

export const objToList = async (list, token, idBoard, pos) => {
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

export const objToCard = async (card, token, idList, idMembers, mapIdLabel) => {
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
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

export const objToA = async (a, token, idCard) => {
  a = aKeys.reduce((o, k) => ({ ...o, [k]: a[k] }), {});
  a.setCover = false;
  const res = await backoff(() => createA(token, idCard, a));
  if (!res.ok) {
    throw new Error(JSON.stringify({ a, status: res.status, url: res.url }));
  }
};

export const objToCover = async (cover, token, idCard) => {
  if (cover) {
    cover = coverKeys.reduce((o, k) => ({ ...o, [k]: cover[k] }), {});
    const res = await backoff(() => updateCard(token, idCard, { cover }));
    if (!res.ok) {
      throw new Error(
        JSON.stringify({ cover, status: res.status, url: res.url })
      );
    }
  }
};

export const objToCl = async (cl, token, idCard) => {
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

export const objToCi = async (ci, token, idCl, idMembers) => {
  ci = ciKeys.reduce((o, k) => ({ ...o, [k]: ci[k] }), {});
  if (idMembers.indexOf(ci.idMember) === -1) {
    ci.idMember = null;
  }
  const res = await backoff(() => createCi(token, idCl, ci));
  if (!res.ok) {
    throw new Error(JSON.stringify({ ci, status: res.status, url: res.url }));
  }
};

export const objToCfis = async (cfis, token, idCard, mapIdCf, mapIdCfo) => {
  if (mapIdCf && mapIdCfo && cfis.length > 0) {
    const validCfis = [];
    for (let cfi of cfis) {
      cfi = cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi[k] }), {});
      cfi.idCustomField = mapIdCf[cfi.idCustomField];
      cfi.idValue = mapIdCfo[cfi.idValue];
      if (cfi.idCustomField && (cfi.value || cfi.idValue)) {
        validCfis.push(cfi);
      }
    }
    const res = await backoff(() =>
      updateCfis(token, idCard, { customFieldItems: validCfis })
    );
    if (!res.ok) {
      throw new Error(
        JSON.stringify({ cfis, status: res.status, url: res.url })
      );
    }
  }
};

export const objToS = async (s, token, idCard) => {
  s = sKeys.reduce((o, k) => ({ ...o, [k]: s[k] }), {});
  const res = await backoff(() => addS(token, idCard, s));
  if (!res.ok) {
    throw new Error(JSON.stringify({ s, status: res.status, url: res.url }));
  }
};
