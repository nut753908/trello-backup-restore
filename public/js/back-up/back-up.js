import { createZipBlob } from "/js/back-up/zip.js";

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
  const blob = await createZipBlob(t, type);
  // const name = await createFilename(t, type);
  // download(blob, name);
};
