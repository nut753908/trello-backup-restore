/* global JSZip */

import { protect } from "/js/protect.js";
import { createList, createCard } from "/js/api.js";

const upload = () => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });
};

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

const restoreList = async (token, idBoard, file) => {
  const text = await file.async("string");
  const list = JSON.parse(text);
  const name = list?.name;
  const res = await createList(token, idBoard, name);
  const resJson = await res.json();
  return resJson?.id;
};

const restoreCard = async (token, idList, file) => {
  const text = await file.async("string");
  const card = JSON.parse(text);
  const body = cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {});
  const res = await createCard(token, idList, body);
  const resJson = await res.json();
  return resJson?.id;
};

const restore = (file) => async (t) => {
  t.alert({ message: "Restoring, please wait..." });
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  const newZip = new JSZip();
  const zip = await newZip.loadAsync(file);
  const listRe = /^list(\d+)\.json$/;
  const lists = zip.file(listRe);
  for (const list of lists) {
    const idList = await restoreList(token, idBoard, list);
    const i = list.name.match(listRe)[1];
    const cardRe = new RegExp(`^list${i}_card(\\d+)\\.json$`);
    const cards = zip.file(cardRe);
    for (const card of cards) {
      await restoreCard(token, idList, card);
    }
  }
  t.alert({ message: "Restoration complete 🎉" });
};

export const restorePopupCallback = async (t) => {
  const file = await upload();
  t.closePopup();
  if (!/\.zip$/.test(file?.name)) {
    return;
  }
  await protect(restore(file))(t);
};
