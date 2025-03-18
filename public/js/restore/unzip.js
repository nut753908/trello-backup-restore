/* global JSZip */

import { withBackoff } from "/js/restore/backoff.js";
import { createList, createCard } from "/js/restore/api.js";

const cardKeys = [
  "id",
  "name",
  "due",
  "start",
  "dueComplete",
  "idMembers",
  "idLabels",
  "address",
  "locationName",
  "coordinates",
];

const fileToCard = async (file, token, idList) => {
  const text = await file.async("string");
  const card = JSON.parse(text);
  const body = cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {});
  const res = await withBackoff(() => createCard(token, idList, body));
  const json = await res.json();
  return json?.id;
};

const fileToList = async (file, token, idBoard) => {
  const text = await file.async("string");
  const list = JSON.parse(text);
  const name = list?.name;
  const res = await withBackoff(() => createList(token, idBoard, name));
  const json = await res.json();
  return json?.id;
};

const loopCard = async (i, zip, token, idList) => {
  const re = new RegExp(`^list${i}_card(\\d+)\\.json$`);
  for (const file of zip.file(re)) {
    await fileToCard(file, token, idList);
  }
};

const loopList = async (zip, token, idBoard) => {
  const re = /^list(\d+)\.json$/;
  for (const file of zip.file(re)) {
    const idList = await fileToList(file, token, idBoard);
    const i = file.name.match(re)[1];
    await loopCard(i, zip, token, idList);
  }
};

export const unzip = (file) => async (t) => {
  t.alert({ message: "Restoring, please wait..." });
  const newZip = new JSZip();
  const zip = await newZip.loadAsync(file);
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  await loopList(zip, token, idBoard);
  await t.hideAlert();
  t.alert({ message: "Restoration complete 🎉" });
};
