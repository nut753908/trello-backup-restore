/* global JSZip */

const descToFile = (desc, zip, i, j) => {
  if (desc) {
    zip.file(`list${i}_card${j}_desc.md`, desc);
  }
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

const cardToFile = (card, zip, i, j) => {
  card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
  card.idMembers = card.members.map((v) => v.id);
  card.idLabels = card.labels.map((v) => v.id);
  delete card.members;
  delete card.labels;
  zip.file(`list${i}_card${j}.json`, JSON.stringify(card, null, 2));
};

const listToFile = (list, zip, i) => {
  delete list.cards;
  zip.file(`list${i}.json`, JSON.stringify(list, null, 2));
};

const boardToFile = (board, zip) => {
  zip.file("_board.json", JSON.stringify(board, null, 2));
};

const loopCard = (list, zip, i) => {
  list.cards.forEach((card, j) => {
    j++;
    descToFile(card.desc, zip, i, j);
    cardToFile(card, zip, i, j);
  });
};

const loopList = (lists, zip) => {
  lists.forEach((list, i) => {
    i++;
    loopCard(list, zip, i);
    listToFile(list, zip, i);
  });
};

export const createZipBlob = (lists, board) => {
  const zip = new JSZip();
  loopList(lists, zip);
  boardToFile(board, zip);
  return zip.generateAsync({ type: "blob" });
};
