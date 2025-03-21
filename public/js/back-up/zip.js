/* global JSZip */

import {
  boardToFile,
  listToFile,
  cardToFile,
  descToFile,
  attachmentToFile,
  fileToFile,
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

const loopAttachment = (attachments, zip, i, j, token) => {
  attachments.forEach((attachment, n) => {
    n++;
    attachmentToFile(attachment, zip, i, j, n);
    fileToFile(attachment.url, zip, i, j, n, token);
  });
};

const loopCard = (cards, zip, i, token) => {
  cards.forEach((card, j) => {
    j++;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
    loopAttachment(card.attachments, zip, i, j, token);
  });
};

const loopList = (lists, zip, token) => {
  lists.forEach((list, i) => {
    i++;
    listToFile(list, zip, i);
    loopCard(list.cards, zip, i, token);
  });
};

export const createZipBlob = async (t, type) => {
  const board = await t.board("id", "name");
  const lists = await getLists[type](t);
  const token = await t.getRestApi().getToken();
  const zip = new JSZip();
  boardToFile(board, zip);
  loopList(lists, zip, token);
  return zip.generateAsync({ type: "blob" });
};
