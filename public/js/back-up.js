/* global JSZip */

var download = function (blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
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

export var backUpCardButtonCallback = async function (t) {
  const list = await t.list("id", "name");
  const card = await t.card(...cardKeys).then(function (card) {
    card.idMembers = card.members.map((v) => v.id);
    card.idLabels = card.labels.map((v) => v.id);
    delete card.members;
    delete card.labels;
    return card;
  });
  var zip = new JSZip();
  zip.file("list1.json", JSON.stringify(list, null, 2));
  zip.file("list1_card1.json", JSON.stringify(card, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, "card.zip");
};

export var backUpListActionCallback = async function (t) {
  const list = await t.list("id", "name");
  const cards = await t
    .list("cards")
    .get("cards")
    .then(function (cards) {
      return cards
        .map(function (card) {
          return cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
        })
        .map(function (card) {
          card.idMembers = card.members.map((v) => v.id);
          card.idLabels = card.labels.map((v) => v.id);
          delete card.members;
          delete card.labels;
          return card;
        });
    });
  var zip = new JSZip();
  zip.file("list1.json", JSON.stringify(list, null, 2));
  cards.map(function (card, i) {
    zip.file(`list1_card${i + 1}.json`, JSON.stringify(card, null, 2));
  });
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, "list.zip");
};
