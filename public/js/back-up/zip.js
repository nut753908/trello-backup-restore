/* global JSZip */

import { APP_KEY } from "/js/env.js";
import {
  boardToFile,
  listToFile,
  cardToFile,
  descToFile,
  attachmentToFile,
  fileToFile,
  coverToFile,
} from "/js/back-up/file.js";

const getLists = {
  card: async (t) => [
    {
      ...(await t.list("id", "name")),
      cards: [await t.card("all")],
    },
  ],
  list: async (t) => [await t.list("all")],
  lists: (t) => t.lists("all"),
};

const addProperties = async (idBoard, token, lists) => {
  const res = await fetch(
    `https://api.trello.com/1/boards/${idBoard}/cards?fields=cover&key=${APP_KEY}&token=${token}`
  );
  const json = await res.json();
  const map = json.reduce((o, c) => ({ ...o, [c.id]: c }), {});
  lists.forEach((l) => {
    l.cards.forEach((c) => {
      c.cover = map[c.id].cover;
    });
  });
};

const loopAttachment = async (attachments, zip, i, j, token) => {
  for (const [_n, attachment] of attachments.entries()) {
    const n = _n + 1;
    attachmentToFile(attachment, zip, i, j, n);
    await fileToFile(attachment, zip, i, j, n, token);
  }
};

const loopCard = async (cards, zip, i, token) => {
  for (const [_j, card] of cards.entries()) {
    const j = _j + 1;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    await loopAttachment(card.attachments, zip, i, j, token);
    coverToFile(card.cover, zip, i, j);
  }
};

const loopList = async (lists, zip, token) => {
  for (const [_i, list] of lists.entries()) {
    const i = _i + 1;
    listToFile(list, zip, i);
    await loopCard(list.cards, zip, i, token);
  }
};

export const createZipBlob = async (t, type) => {
  const token = await t.getRestApi().getToken();
  const board = await t.board("id", "name");
  const lists = await getLists[type](t);
  await addProperties(board.id, token, lists);
  const zip = new JSZip();
  boardToFile(board, zip);
  await loopList(lists, zip, token);
  return zip.generateAsync({ type: "blob" });
};
