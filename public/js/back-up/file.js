import { APP_KEY } from "/js/env.js";

export const boardToFile = (board, zip) => {
  zip.file("_board.json", JSON.stringify(board, null, 2));
};

export const listToFile = (list, zip, i) => {
  list = { ...list };
  delete list.cards;
  zip.file(`list${i}.json`, JSON.stringify(list, null, 2));
};

const cardKeys = [
  "id",
  "name",
  "due",
  "start",
  "dueComplete",
  "address",
  "locationName",
  "coordinates",
  "members",
  "labels",
];

export const cardToFile = (card, zip, i, j) => {
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
  card.idMembers = card.members.map((v) => v.id);
  card.idLabels = card.labels.map((v) => v.id);
  delete card.members;
  delete card.labels;
  zip.file(`list${i}_card${j}.json`, JSON.stringify(card, null, 2));
};

export const descToFile = (desc, zip, i, j) => {
  if (desc) {
    zip.file(`list${i}_card${j}_desc.md`, desc);
  }
};

// a: attachment
export const attachmentToFile = (a, zip, i, j, n) => {
  a = ["id", "name", "url"].reduce((o, k) => ({ ...o, [k]: a[k] }), {});
  zip.file(`list${i}_card${j}_attachment${n}.json`, JSON.stringify(a, null, 2));
};

const downloadFile = (url, token) =>
  fetch(`https://trello-backup-restore.glitch.me/download?key=${APP_KEY}&token=${token}`);

export const fileToFile = async (url, zip, i, j, n, token) => {
  const res = await downloadFile(url, token);
  const blob = await res.blob();
  const url2 = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url2;
  a.download = "hoge.png";
  a.click();
  URL.revokeObjectURL(url2);
};
