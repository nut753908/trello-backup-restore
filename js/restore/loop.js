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
  return (
    await Promise.all(
      files.map(async (aFile) => {
        const n = aFile.name.match(re)[1];
        const afFile = zip.file(`${dir}list${i}_card${j}_attachment${n}_file`);
        const idA = await getIdA(aFile);
        return { [idA]: await fileToA(aFile, afFile, token, idCard, n) };
      })
    )
  ).reduce((o1, o2) => ({ ...o1, ...o2 }), {});
};

const loopCi = async (dir, i, j, n, zip, token, idCl) => {
  const re = new RegExp(
    `^${dir}list${i}_card${j}_checklist${n}_checkitem(\\d+)\\.json$`
  );
  const files = zip.file(re).sort(ascend);
  await Promise.all(
    files.map(async (file) => {
      const m = file.name.match(re)[1];
      await fileToCi(file, token, idCl, m);
    })
  );
};

const loopCl = async (dir, i, j, zip, token, idCard) => {
  const re = new RegExp(`^${dir}list${i}_card${j}_checklist(\\d+)\\.json$`);
  const files = zip.file(re).sort(ascend);
  await Promise.all(
    files.map(async (file) => {
      const n = file.name.match(re)[1];
      const idCl = await fileToCl(file, token, idCard, n);
      await loopCi(dir, i, j, n, zip, token, idCl);
    })
  );
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
  await Promise.all(
    files.map(async (cardFile) => {
      const j = cardFile.name.match(re)[1];
      const descFile = zip.file(`${dir}list${i}_card${j}_desc.md`);
      const idCard = await fileToCard(cardFile, descFile, token, idList, j);
      await Promise.all([
        (async () => {
          const mapIdA = await loopA(dir, i, j, zip, token, idCard);
          const coverFile = zip.file(`${dir}list${i}_card${j}_cover.json`);
          await fileToCover(coverFile, token, idCard, mapIdA);
        })(),
        loopCl(dir, i, j, zip, token, idCard),
        loopCfi(dir, i, j, zip, token, idCard),
        loopS(dir, i, j, zip, token, idCard),
      ]);
    })
  );
};

const loopList = async (
  dir,
  zip,
  token,
  idBoard,
  toRight,
  sign,
  count,
  offset
) => {
  const re = new RegExp(`^${dir}list(\\d+)\\.json$`);
  const files = zip.file(re).sort(toRight ? ascend : descend);
  await Promise.all(
    files.map(async (file, h) => {
      const i = file.name.match(re)[1];
      const pos = sign * (h + count) + offset;
      const idList = await fileToList(file, token, idBoard, pos);
      await loopCard(dir, i, zip, token, idList);
    })
  );
};

let totalCount = 0;

export const loopDir = async (zip, token, idBoard, toRight) => {
  const sign = toRight ? 1 : -1;
  const offset = toRight ? 10000000000 : 4095;
  await Promise.all(
    [{ name: "" }, ...zip.folder(/.*/)]
      .sort(toRight ? ascend : descend)
      .map((d) => d.name)
      .map((dir) => {
        const re = new RegExp(`^${dir}list\\d+\\.json$`);
        const count = totalCount;
        totalCount += zip.file(re).length;
        return [dir, count];
      })
      .map(async ([dir, count]) => {
        await loopList(dir, zip, token, idBoard, toRight, sign, count, offset);
      })
  );
};
