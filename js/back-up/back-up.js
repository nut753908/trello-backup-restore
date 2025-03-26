import { createZipBlob } from "/back-up/zip.js";
import { download } from "/common/download.js";
import { storeError } from "/common/error.js";

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
  try {
    t.alert({ message: `Backing up ${type}` });
    const blob = await createZipBlob(t, type);
    const name = await createFilename(t, type);
    download(blob, name);
  } catch (e) {
    console.error(e);
    await t.hideAlert();
    t.alert({ message: `❌ Failed to back up ${type}` });
    storeError(t, e);
  }
};
