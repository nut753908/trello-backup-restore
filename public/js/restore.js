/* global JSZip */

import { protect } from "/js/protect.js";
import { createList, createCard } from "/js/api.js";

const upload = () => {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });
};

const getBody = (card) => ({
  name: card?.name,
  due: card?.due,
  start: card?.start,
  dueComplete: card?.dueComplete,
  idMembers: card?.idMembers,
  idLabels: card?.idLabels,
  address: card?.address,
  locationName: card?.locationName,
  coordinates: card?.coordinates,
});

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
  const body = getBody(card);
  const res = await createCard(token, idList, body);
  const resJson = await res.json();
  return resJson?.id;
};

const restore = (file) => async (t) => {
  if (!/\.zip$/.test(file?.name)) {
    return;
  }
  t.alert({ message: "Restoring, please wait..." });
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  const newZip = new JSZip();
  const zip = await newZip.loadAsync(file);
  const listFiles = zip.file(/^list\d+\.json$/);
  for (const listFile of listFiles) {
    const idList = await restoreList(token, idBoard, listFile);
    const i = listFile.name.match(/^list(\d+)\.json$/)[1];
    const cardFiles = zip.file(new RegExp(`^list${i}_card\\d+\\.json$`));
    for (const cardFile of cardFiles) {
      await restoreCard(token, idList, cardFile);
    }
  }
  t.alert({ message: "Restoration complete 🎉" });
};

export const restorePopupCallback = async (t) => {
  const file = await upload();
  t.closePopup();
  await protect(restore(file))(t);
};
