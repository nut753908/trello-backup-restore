// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  fileToList,
  fileToCard,
  fileToA,
  fileToCover,
  fileToCl,
  fileToCi,
  filesToCfis,
  fileToS,
} from "/js/restore/file.js";

const compare = (a, b) => (a.name > b.name ? 1 : -1);

const loopA = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_attachment(\\d+)\\.json$`);
  const files = zip.file(re).sort(compare);
  const mapIdA = {};
  for (const aFile of files) {
    const n = aFile.name.match(re)[1];
    const afFile = zip.file(`list${i}_card${j}_attachment${n}_file`);
    mapIdA[n] = await fileToA(aFile, afFile, token, idCard);
  }
  return mapIdA;
};

const loopCi = async (i, j, n, zip, token, idCl) => {
  const re = new RegExp(
    `^list${i}_card${j}_checklist${n}_checkitem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(compare);
  for (const file of files) {
    await fileToCi(file, token, idCl);
  }
};

const loopCl = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_checklist(\\d+)\\.json$`);
  const files = zip.file(re).sort(compare);
  for (const file of files) {
    const n = file.name.match(re)[1];
    const idCl = await fileToCl(file, token, idCard);
    await loopCi(i, j, n, zip, token, idCl);
  }
};

const loopCfi = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_customFieldItem(\\d+)\\.json$`);
  const files = zip.file(re).sort(compare);
  await filesToCfis(files, token, idCard);
};

const loopS = async (i, j, zip, token, idCard) => {
  const re = new RegExp(`^list${i}_card${j}_sticker(\\d+)\\.json$`);
  const files = zip.file(re).sort(compare);
  for (const file of files) {
    await fileToS(file, token, idCard);
  }
};

const loopCard = async (i, zip, token, idList) => {
  const re = new RegExp(`^list${i}_card(\\d+)\\.json$`);
  const files = zip.file(re).sort(compare);
  for (const cardFile of files) {
    const j = cardFile.name.match(re)[1];
    const descFile = zip.file(`list${i}_card${j}_desc.md`);
    const idCard = await fileToCard(cardFile, descFile, token, idList);
    const mapIdA = await loopA(i, j, zip, token, idCard);
    const coverFile = zip.file(`list${i}_card${j}_cover.json`);
    await fileToCover(coverFile, token, idCard, mapIdA);
    await loopCl(i, j, zip, token, idCard);
    await loopCfi(i, j, zip, token, idCard);
    await loopS(i, j, zip, token, idCard);
  }
};

export const loopList = async (zip, token, idBoard) => {
  const re = /^list(\d+)\.json$/;
  const files = zip.file(re).sort(compare);
  for (const file of files) {
    const i = file.name.match(re)[1];
    const idList = await fileToList(file, token, idBoard);
    await loopCard(i, zip, token, idList);
  }
};
