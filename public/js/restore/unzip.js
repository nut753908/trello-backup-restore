/* global JSZip */

import {
  fileToList,
  fileToCard,
  fileToAttachment,
  fileToCover,
  fileToChecklist,
  fileToCheckitem,
  filesToCustomFieldItems,
} from "/js/restore/file.js";

const compareName = (a, b) => (a.name > b.name ? 1 : -1);

const loopAttachment = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_attachment(\\d+)\\.json$`);
  const files = zip.file(re).sort(compareName);
  // a: attachment
  const mapIdA = {};
  for (const aFile of files) {
    const n = aFile.name.match(re)[1];
    const fileFile = zip.file(`list${i}_card${j}_attachment${n}_file`);
    mapIdA[n] = await fileToAttachment(aFile, fileFile, token, idCard);
  }
  return mapIdA;
};

const loopCheckitem = async (i, j, n, zip, token, idCl) => {
  const re = new RegExp(
    `^list${i}_card${j}_checklist${n}_checkitem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(compareName);
  for (const file of files) {
    await fileToCheckitem(file, token, idCl);
  }
};

const loopChecklist = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_checklist(\\d+)\\.json$`);
  const files = zip.file(re).sort(compareName);
  for (const file of files) {
    const n = file.name.match(re)[1];
    const idCl = await fileToChecklist(file, token, idCard);
    await loopCheckitem(i, j, n, zip, token, idCl);
  }
};

const loopCustomFieldItem = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_customFieldItem(\\d+)\\.json$`);
  const files = zip.file(re).sort(compareName);
  if (files.length > 0) {
    await filesToCustomFieldItems(files, token, idCard);
  }
};

const loopCard = async (i, zip, token, idList) => {
  const re = new RegExp(`^list${i}_card(\\d+)\\.json$`);
  const files = zip.file(re).sort(compareName);
  for (const cardFile of files) {
    const j = cardFile.name.match(re)[1];
    const descFile = zip.file(`list${i}_card${j}_desc.md`);
    const idCard = await fileToCard(cardFile, descFile, token, idList);
    // a: attachment
    const mapIdA = await loopAttachment(i, j, zip, token, idCard);
    const coverFile = zip.file(`list${i}_card${j}_cover.json`);
    await fileToCover(coverFile, token, idCard, mapIdA);
    await loopChecklist(i, j, zip, token, idCard);
    await loopCustomFieldItem(i, j, zip, token, idCard);
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
