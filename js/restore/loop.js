// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import {
  fileToList,
  fileToCard,
  getIdA,
  fileToA,
  fileToCover,
  fileToCl,
  fileToCi,
  filesToCfis,
  fileToS,
} from "./file.js";

const ascend = (a, b) => (a.name > b.name ? 1 : -1);
const descend = (a, b) => (a.name < b.name ? 1 : -1);

const loopA = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_attachment(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  const mapIdA = {};
  for (const aFile of files) {
    const n = aFile.name.match(re)[1];
    const afFile = zip.file(`${dir}list${i}_card${j}_attachment${n}_file`);
    const idA = await getIdA(aFile);
    mapIdA[idA] = await fileToA(aFile, afFile, token, idCard);
  }
  return mapIdA;
};

const loopCi = async (dir, i, j, n, zip, token, idCl) => {
  const re = new RegExp(
    `^${dir}list${i}_card${j}_checklist${n}_checkitem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    await fileToCi(file, token, idCl);
  }
};

const loopCl = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_checklist(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    const n = file.name.match(re)[1];
    const idCl = await fileToCl(file, token, idCard);
    await loopCi(dir, i, j, n, zip, token, idCl);
  }
};

const loopCfi = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(
    `^${dir}list${i}_card${j}_customFieldItem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(ascend);
  await filesToCfis(files, token, idCard);
};

const loopS = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_sticker(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    await fileToS(file, token, idCard);
  }
};

const loopCard = async (dir, i, zip, token, idList) => {
  const re = new RegExp(`^${dir}list${i}_card(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const cardFile of files) {
    const j = cardFile.name.match(re)[1];
    const descFile = zip.file(`${dir}list${i}_card${j}_desc.md`);
    const idCard = await fileToCard(cardFile, descFile, token, idList);
    const mapIdA = await loopA(dir, i, j, zip, token, idCard);
    const coverFile = zip.file(`${dir}list${i}_card${j}_cover.json`);
    await fileToCover(coverFile, token, idCard, mapIdA);
    await loopCl(dir, i, j, zip, token, idCard);
    await loopCfi(dir, i, j, zip, token, idCard);
    await loopS(dir, i, j, zip, token, idCard);
  }
};

const loopList = async (dir, zip, token, idBoard, toRight) => {
  const re = new RegExp(`^${dir}list(\\d+)\\.json$`);
  const files = zip.file(re).sort(toRight ? ascend : descend);
  const pos = toRight ? "bottom" : "top";
  for (const file of files) {
    const i = file.name.match(re)[1];
    const idList = await fileToList(file, token, idBoard, pos);
    await loopCard(dir, i, zip, token, idList);
  }
};

export const loopDir = async (zip, token, idBoard, toRight) => {
  const dirs = [{ name: "" }, ...zip.folder(/.*/)]
    .sort(toRight ? ascend : descend)
    .map((d) => d.name);
  for (const dir of dirs) {
    await loopList(dir, zip, token, idBoard, toRight);
  }
};
