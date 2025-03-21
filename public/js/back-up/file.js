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
  a.url = decodeURI(a.url);
  zip.file(`list${i}_card${j}_attachment${n}.json`, JSON.stringify(a, null, 2));
};

const downloadUrlRe =
  /^https:\/\/trello\.com\/1\/cards\/[0-9a-f]{24}\/attachments\/[0-9a-f]{24}\/download\/.+/;
const trelloUrlRe = /^https:\/\/trello\.com/;
const apiProxyUrl = "https://trello-backup-restore.glitch.me";

export const fileToFile = async (url, zip, i, j, n, token) => {
  if (downloadUrlRe.test(url)) {
    const proxyUrl = url.replace(trelloUrlRe, apiProxyUrl);
    const res = await fetch(`${proxyUrl}?key=${APP_KEY}&token=${token}`);
    const blob = await res.blob();
    const name = decodeURI(url).split("/download/").pop();
    zip.file(`list${i}_card${j}_attachment${n}_file_${name}`, blob);
  }
};
