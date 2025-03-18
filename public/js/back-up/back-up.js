import { createZipBlob } from "/js/back-up/zip.js";

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

const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export const backUp = (type) => async (t) => {
  t.alert({ message: `Backing up ${type}` });
  const lists = await getLists[type](t);
  const blob = await createZipBlob(lists);
  download(blob, `${type}.zip`);
};
