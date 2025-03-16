/* global JSZip */

var download = function (blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

var getLists = async function (t, type) {
  switch (type) {
    case "card":
      return [
        {
          ...(await t.list("id", "name")),
          cards: [await t.card("all")],
        },
      ];
    case "list":
      return [await t.list("all")];
    default:
      return [];
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

var backUp = async function (t, type) {
  var zip = new JSZip();
  const lists = await getLists(t, type);
  lists.forEach(function (list, i) {
    list.cards.forEach(function (card, j) {
      card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
      card.idMembers = card.members.map((v) => v.id);
      card.idLabels = card.labels.map((v) => v.id);
      delete card.members;
      delete card.labels;
      zip.file(
        `list${i + 1}_card${j + 1}.json`,
        JSON.stringify(card, null, 2)
      );
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
