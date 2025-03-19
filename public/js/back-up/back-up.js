import { createZipBlob } from "/js/back-up/zip.js";

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

const download = (blob, name) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

const createFilename = (t, type) =>
  ({
    card: (t) => t.card("name"),
    list: (t) => t.list("name"),
    lists: (t) => t.board("name"),
  }
    [type](t)
    .get("name")
    .then((n) => n.replace(/[<>:"\/\\|?*]/g, ""))
    .then((n) => `${type}_${n}.zip`));

export const backUp = (type) => async (t) => {
  t.alert({ message: `Backing up ${type}` });
  const lists = await getLists[type](t);
  const blob = await createZipBlob(lists);
  const name = await createFilename(t, type);
  download(blob, name);
};
