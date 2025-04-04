// cf: custom field
// cfo: custom field option
// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item
// s: sticker

import { getPreBoard, getMapIdLabel, getMapIdCf } from "./board.js";
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
    const m = aFile.name.match(re)[1];
    const afFile = zip.file(`${dir}list${i}_card${j}_attachment${m}_file`);
    const idA = await getIdA(aFile);
    mapIdA[idA] = await fileToA(aFile, afFile, token, idCard);
  }
  return mapIdA;
};

const loopCi = async (dir, i, j, m, zip, token, idCl, idMembers) => {
  const re = new RegExp(
    `^${dir}list${i}_card${j}_checklist${m}_checkitem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    await fileToCi(file, token, idCl, idMembers);
  }
};

const loopCl = async (dir, i, j, zip, token, idCard, idMembers) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_checklist(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    const m = file.name.match(re)[1];
    const idCl = await fileToCl(file, token, idCard);
    await loopCi(dir, i, j, m, zip, token, idCl, idMembers);
  }
};

const loopCfi = async (dir, i, j, zip, token, idCard, mapIdCf, mapIdCfo) => {
  const re = new RegExp(
    `^${dir}list${i}_card${j}_customFieldItem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(ascend);
  await filesToCfis(files, token, idCard, mapIdCf, mapIdCfo);
};

const loopS = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_sticker(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const file of files) {
    await fileToS(file, token, idCard);
  }
};

const loopCard = async (
  dir,
  i,
  zip,
  token,
  idList,
  idMembers,
  mapIdLabel,
  mapIdCf,
  mapIdCfo
) => {
  const re = new RegExp(`^${dir}list${i}_card(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  for (const cardFile of files) {
    const j = cardFile.name.match(re)[1];
    const descFile = zip.file(`${dir}list${i}_card${j}_desc.md`);
    const idCard = await fileToCard(
      cardFile,
      descFile,
      token,
      idList,
      idMembers,
      mapIdLabel
    );
    const mapIdA = await loopA(dir, i, j, zip, token, idCard);
    const coverFile = zip.file(`${dir}list${i}_card${j}_cover.json`);
    await fileToCover(coverFile, token, idCard, mapIdA);
    await loopCl(dir, i, j, zip, token, idCard, idMembers);
    await loopCfi(dir, i, j, zip, token, idCard, mapIdCf, mapIdCfo);
    await loopS(dir, i, j, zip, token, idCard);
  }
};

const loopList = async (
  dir,
  zip,
  token,
  idBoard,
  idMembers,
  mapIdLabel,
  mapIdCf,
  mapIdCfo,
  toRight
) => {
  const re = new RegExp(`^${dir}list(\\d+)\\.json$`);
  const files = zip.file(re).sort(toRight ? ascend : descend);
  const pos = toRight ? "bottom" : "top";
  for (const file of files) {
    const i = file.name.match(re)[1];
    const idList = await fileToList(file, token, idBoard, pos);
    await loopCard(
      dir,
      i,
      zip,
      token,
      idList,
      idMembers,
      mapIdLabel,
      mapIdCf,
      mapIdCfo
    );
  }
};

export const loopDir = async (
  zip,
  token,
  idBoard,
  idMembers,
  labels,
  cfs,
  isFree,
  addLabels,
  addCfs,
  toRight
) => {
  const dirs = [{ name: "" }, ...zip.folder(/.*/)]
    .sort(toRight ? ascend : descend)
    .map((d) => d.name);
  for (const dir of dirs) {
    const file = zip.file(`${dir}_board.json`);
    const { _labels, _cfs } = await getPreBoard(file);
    const mapIdLabel = await getMapIdLabel(
      token,
      idBoard,
      _labels,
      labels,
      addLabels
    );
    const { mapIdCf, mapIdCfo } = isFree
      ? {}
      : await getMapIdCf(token, idBoard, _cfs, cfs, addCfs);
    await loopList(
      dir,
      zip,
      token,
      idBoard,
      idMembers,
      mapIdLabel,
      mapIdCf,
      mapIdCfo,
      toRight
    );
  }
};
