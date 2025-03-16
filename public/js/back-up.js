/* global JSZip */

const download = (blob, name) => {
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

const backUp = async (t, type) => {
  const zip = new JSZip();
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

export const backUpCardButtonCallback = async (t) => {
  await backUp(t, "card");
};

export const backUpListActionCallback = async (t) => {
  await backUp(t, "list");
};

export const backUpListsBoardButtonCallback = async (t) => {
  await backUp(t, "lists");
};
