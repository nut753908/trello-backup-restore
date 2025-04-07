import { getLists } from "./lists.js";
import { filterBoard } from "./filter.js";
import { loopList } from "./loop.js";
import { download } from "../common/file.js";
import { storeError } from "../common/error.js";

const createJsonBlob = async (t, type) => {
  const board = await t.board("all");
  const lists = await getLists(t, type);
  const obj = {
    board: filterBoard(board),
    lists: loopList(lists),
  };
  return new Blob([JSON.stringify(obj, null, 2)], {
    type: "application/json",
  });
};

const createFilename = (t, type) => {
  const getName = {
    card: (t) => t.card("name"),
    list: (t) => t.list("name"),
    lists: (t) => t.board("name"),
  };
  return getName[type](t)
    .get("name")
    .then((n) => n.replace(/[<>:"/\\|?*]/g, ""))
    .then((n) => `${type}_${n}.json`);
};

export const backUp = (type) => async (t) => {
  try {
    await t.hideAlert();
    t.alert({ message: `Backing up ${type}` });
    const blob = await createJsonBlob(t, type);
    const name = await createFilename(t, type);
    download(blob, name);
  } catch (e) {
    console.error(e);
    await t.hideAlert();
    t.alert({ message: `❌ Failed to back up ${type}` });
    storeError(t, e);
  }
};
