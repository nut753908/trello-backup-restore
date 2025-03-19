/* global JSZip */

import {
  boardToFile,
  listToFile,
  cardToFile,
  descToFile,
} from "/js/back-up/file.js";

const loopCard = (list, zip, i) => {
  list.cards.forEach((card, j) => {
    j++;
    cardToFile(card, zip, i, j);
    descToFile(card.desc, zip, i, j);
  });
};

const loopList = (lists, zip) => {
  lists.forEach((list, i) => {
    i++;
    listToFile(list, zip, i);
    loopCard(list, zip, i);
  });
};

export const createZipBlob = (board, lists) => {
  const zip = new JSZip();
  boardToFile(board, zip);
  loopList(lists, zip);
  return zip.generateAsync({ type: "blob" });
};
