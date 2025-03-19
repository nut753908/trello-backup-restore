/* global JSZip */

import { fileToList, fileToCard } from "/js/restore/file.js";

const compareName = (a, b) => (a.name > b.name ? 1 : -1);

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
