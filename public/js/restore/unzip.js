/* global JSZip */

import { backoff } from "/js/restore/backoff.js";
import { createList, createCard } from "/js/restore/api.js";

const cardKeys = [
  "id",
  "name",
  "desc",
  "due",
  "start",
  "dueComplete",
  "idMembers",
  "idLabels",
  "address",
  "locationName",
  "coordinates",
];

const fileToCard = (file, descFile, token, idList) =>
  file
    .async("string")
    .then(JSON.parse)
    .then(async (card) => {
      if (descFile) {
        card.desc = await descFile.async("string");
      }
      return card;
    })
    .then((card) => cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {}))
    .then((body) => backoff(() => createCard(token, idList, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

const fileToList = (file, token, idBoard) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((list) => list?.name)
    .then((name) => backoff(() => createList(token, idBoard, name)))
    .then((res) => res.json())
    .then((json) => json?.id);

const compareName = (a, b) => a.name > b.name ? 1 : -1;

const loopCard = async (i, zip, token, idList) => {
  const re = new RegExp(`^list${i}_card(\\d+)\\.json$`);
  const files = zip.file(re).sort(compareName);
  for (const file of files) {
    const j = file.name.match(re)[1];
    const descFile = zip.file(`list${i}_card${j}_desc.md`);
    await fileToCard(file, descFile, token, idList);
  }
};

const loopList = async (zip, token, idBoard) => {
  const re = /^list(\d+)\.json$/;
  const files = zip.file(re).sort(compareName);
  for (const file of files) {
    const i = file.name.match(re)[1];
    const idList = await fileToList(file, token, idBoard);
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
