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

var restore = async function (t, text) {
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  const _listAndCard = JSON.parse(text);
  const name = _listAndCard?.list?.name;
  const _res = await createList(idBoard, name, APP_KEY, token);
  const _resJson = await _res.json();
  const idList = _resJson?.id;
  const body = getBody(_listAndCard?.card);
  await createCard(idList, body, APP_KEY, token);
};

export var restorePopupCallback = async function (t) {
  const inputFile = await upload();
  t.closePopup();
  if (/\.zip$/.test(inputFile?.name)) {
    var newZip = new JSZip();
    const zip = await newZip.loadAsync(inputFile);
    const file = zip.file("list-and-card.json");
    if (file) {
      const text = await file.async("string");
      await restore(t, text);
    }
  }
};
