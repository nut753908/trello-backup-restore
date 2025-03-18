/* global JSZip */

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
  zip.file(`list${i + 1}_card${j + 1}.json`, JSON.stringify(card, null, 2));
};

const listToFile = (list, zip, i) => {
  delete list.cards;
  zip.file(`list${i + 1}.json`, JSON.stringify(list, null, 2));
};

const loopCard = (list, zip, i) => {
  list.cards.forEach((card, j) => {
    cardToFile(card, zip, i, j);
  });
};

const loopList = (lists, zip) => {
  lists.forEach((list, i) => {
    loopCard(list, zip, i);
    listToFile(list, zip, i);
  });
};

export const createZipBlob = async (lists) => {
  const zip = new JSZip();
  loopList(lists, zip);
  return await zip.generateAsync({ type: "blob" });
};
