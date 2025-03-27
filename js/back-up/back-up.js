/* global JSZip */
import { getLists } from "./lists.js";
import { boardToFile } from "./file.js";
import { loopList } from "./loop.js";
import { download } from "../common/file.js";
import { storeError } from "../common/error.js";

const createZipBlob = async (t, type) => {
  const board = await t.board("all");
  const lists = await getLists(t, type);
  const zip = new JSZip();
  boardToFile(board, zip);
  loopList(lists, zip);
  return zip.generateAsync({ type: "blob" });
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
  try {
    t.alert({ message: `Backing up ${type}` });
    const blob = await createZipBlob(t, type);
    const name = await createFilename(t, type);
    download(blob, name);
  } catch (e) {
    await t.hideAlert();
    t.alert({ message: `❌ Failed to back up ${type}` });
    storeError(t, e);
  }
};
