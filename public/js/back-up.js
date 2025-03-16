/* global JSZip */

var download = function (blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const getLists = {
  card: async (t) => [
    {
      ...(await t.list("id", "name")),
      cards: [await t.card("all")],
    },
  ],
  list: async (t) => [await t.list("all")],
  lists: async (t) => t.lists("all"),
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

var backUp = async function (t, type) {
  var zip = new JSZip();
  const lists = await getLists[type](t);
  lists.forEach((list, i) => {
    list.cards.forEach((card, j) => {
      card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
      card.idMembers = card.members.map((v) => v.id);
      card.idLabels = card.labels.map((v) => v.id);
      delete card.members;
      delete card.labels;
      zip.file(`list${i + 1}_card${j + 1}.json`, JSON.stringify(card, null, 2));
    });
    delete list.cards;
    zip.file(`list${i + 1}.json`, JSON.stringify(list, null, 2));
  });
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, `${type}.zip`);
};

export var backUpCardButtonCallback = async function (t) {
  await backUp(t, "card");
};

export var backUpListActionCallback = async function (t) {
  await backUp(t, "list");
};

export var backUpListsBoardButtonCallback = async function (t) {
  await backUp(t, "lists");
};
