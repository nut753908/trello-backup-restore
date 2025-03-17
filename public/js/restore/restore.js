/* global JSZip */

import { createList, createCard } from "/js/restore/api.js";
import { protect } from "/js/protect.js";

const selectFile = () =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });

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

const restoreCard = async (file, token, idList) => {
  const text = await file.async("string");
  const card = JSON.parse(text);
  const body = cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {});
  const res = await createCard(token, idList, body);
  const json = await res.json();
  return json?.id;
};

const restoreList = async (file, token, idBoard) => {
  const text = await file.async("string");
  const list = JSON.parse(text);
  const name = list?.name;
  const res = await createList(token, idBoard, name);
  const json = await res.json();
  return json?.id;
};

const loopCard = async (i, zip, token, idList) => {
  const re = new RegExp(`^list${i}_card(\\d+)\\.json$`);
  for (const file of zip.file(re)) {
    await restoreCard(file, token, idList);
  }
};

const loopList = async (zip, token, idBoard) => {
  const re = /^list(\d+)\.json$/;
  for (const file of zip.file(re)) {
    const idList = await restoreList(file, token, idBoard);
    const i = file.name.match(re)[1];
    await loopCard(i, zip, token, idList);
  }
};

const restore = (file) => async (t) => {
  t.alert({ message: "Restoring, please wait..." });
  const newZip = new JSZip();
  const zip = await newZip.loadAsync(file);
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  await loopList(zip, token, idBoard);
  t.alert({ message: "Restoration complete 🎉" });
};

export const restorePopupCallback = async (t) => {
  const file = await selectFile();
  t.closePopup();
  if (/\.zip$/.test(file?.name)) {
    await protect(restore(file))(t);
  }
};
