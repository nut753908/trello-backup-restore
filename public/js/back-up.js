/* global JSZip */

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

const cardLoop = (list, zip, i) => {
  list.cards.forEach((card, j) => {
    card = cardKeys.reduce((o, k) => ({ ...o, [k]: card[k] }), {});
    card.idMembers = card.members.map((v) => v.id);
    card.idLabels = card.labels.map((v) => v.id);
    delete card.members;
    delete card.labels;
    zip.file(`list${i + 1}_card${j + 1}.json`, JSON.stringify(card, null, 2));
  });
};

const listLoop = (lists, zip) => {
  lists.forEach((list, i) => {
    cardLoop(list, zip, i);
    delete list.cards;
    zip.file(`list${i + 1}.json`, JSON.stringify(list, null, 2));
  });
};

const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const backUp = async (t, type) => {
  t.alert({ message: `Backing up ${type}` });
  const lists = await getLists[type](t);
  const zip = new JSZip();
  listLoop(lists, zip);
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, `${type}.zip`);
};

export const backUpCardButtonCallback = (t) => {
  backUp(t, "card");
};

export const backUpListActionCallback = (t) => {
  backUp(t, "list");
};

export const backUpListsBoardButtonCallback = (t) => {
  backUp(t, "lists");
};
