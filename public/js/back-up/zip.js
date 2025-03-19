/* global JSZip */

import {
  boardToFile,
  listToFile,
  cardToFile,
  descToFile,
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

const loopCard = (cards, zip, i) => {
  cards.forEach((card, j) => {
    j++;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
  });
};

const loopList = (lists, zip) => {
  lists.forEach((list, i) => {
    i++;
    listToFile(list, zip, i);
    loopCard(list.cards, zip, i);
  });
};

export const createZipBlob = async (t, type) => {
  const board = await t.board("id", "name");
  const lists = await getLists[type](t);
  const zip = new JSZip();
  boardToFile(board, zip);
  loopList(lists, zip);
  return zip.generateAsync({ type: "blob" });
};
