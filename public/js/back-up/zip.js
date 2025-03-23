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
  checklistToFile,
  checkitemToFile,
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
    `https://api.trello.com/1/boards/${idBoard}/cards` +
      `?fields=cover&checklists=all&key=${APP_KEY}&token=${token}`
  );
  const json = await res.json();
  const map = json.reduce((o, c) => ({ ...o, [c.id]: c }), {});
  lists.forEach((l) => {
    l.cards.forEach((c) => {
      c.cover = map[c.id].cover;
      c.checklists = map[c.id].checklists;
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

const loopCheckitem = (checkitems, zip, i, j, n) => {
  for (const [_m, checkitem] of checkitems.entries()) {
    const m = _m + 1;
    checkitemToFile(checkitem, zip, i, j, n, m);
  }
};

const loopChecklist = (checklists, zip, i, j) => {
  for (const [_n, checklist] of checklists.entries()) {
    const n = _n + 1;
    checklistToFile(checklist, zip, i, j, n);
    loopCheckitem(checklist.checkItems ?? null, zip, i, j, n);
  }
};

const loopCard = async (cards, zip, i, token) => {
  for (const [_j, card] of cards.entries()) {
    const j = _j + 1;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    await loopAttachment(card.attachments, zip, i, j, token);
    coverToFile(card.cover, zip, i, j);
    loopChecklist(card.checklists, zip, i, j);
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
