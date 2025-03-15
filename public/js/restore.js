import { createList, createCard } from "/js/api.js";
import { APP_KEY } from "/js/env.js";

var upload = function () {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json"; // NOTE: change to ".zip" later
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });
};

var read = function (file) {
  return new Promise(function (resolve) {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsText(file);
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
  const file = await upload();
  t.closePopup();
  if (/.*\.json$/.test(file?.name)) {
    const text = await read(file);
    await restore(t, text);
  }
};
