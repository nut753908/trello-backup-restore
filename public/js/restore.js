/* global JSZip */

import { createList, createCard } from "/js/api.js";
import { APP_KEY } from "/js/env.js";

var upload = function () {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });
};

var getBody = function (card) {
  return {
    name: card?.name,
    due: card?.due,
    start: card?.start,
    dueComplete: card?.dueComplete,
    idMembers: card?.idMembers,
    idLabels: card?.idLabels,
    address: card?.address,
    locationName: card?.locationName,
    coordinates: card?.coordinates,
  };
};

var restoreList = async function (token, idBoard, file) {
  const text = await file.async("string");
  const list = JSON.parse(text);
  const name = list?.name;
  const res = await createList(idBoard, name, APP_KEY, token);
  const resJson = await res.json();
  return resJson?.id;
};

var restoreCard = async function (token, idList, file) {
  const text = await file.async("string");
  const card = JSON.parse(text);
  const body = getBody(card);
  const res = await createCard(idList, body, APP_KEY, token);
  const resJson = await res.json();
  return resJson?.id;
};

var restore = async function (t, file) {
  if (!/\.zip$/.test(file?.name)) {
    return;
  }
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  var newZip = new JSZip();
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
};

export var restorePopupCallback = async function (t) {
  const file = await upload();
  t.closePopup();
  await restore(t, file);
};
