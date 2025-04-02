// cf: custom field

/* global JSZip */
import { loopDir } from "./loop.js";
import { storeError } from "../common/error.js";
import { selectFile } from "../common/file.js";
import { protect } from "../common/protect.js";

const getCur = async (t) => {
  const board = await t.board("id", "customFields");
  return {
    idBoard: board.id,
    idCfs: board.customFields.map((cf) => cf.id),
  };
};

const restore = (file) => async (t) => {
  try {
    await t.hideAlert();
    t.alert({ message: "Restoring, please wait..." });
    const newZip = new JSZip();
    const zip = await newZip.loadAsync(file);
    const token = await t.getRestApi().getToken();
    const cur = await getCur(t);
    const toRight = await t.get("board", "shared", "toRight", true);
    await loopDir(zip, token, cur, toRight);
    await t.hideAlert();
    t.alert({ message: "Restoration complete 🎉" });
  } catch (e) {
    console.error(e);
    await t.hideAlert();
    t.alert({ message: "❌ Failed to restore" });
    storeError(t, e);
  }
};

export const selectFileAndRestore = async (t) => {
  t.closePopup();
  const file = await selectFile();
  if (/\.zip$/.test(file?.name)) {
    await protect(restore(file))(t);
  }
};

export const selectFileAndRestoreFirefox = async (t) => {
  const file = await selectFile();
  if (/\.zip$/.test(file?.name)) {
    await restore(file)(t);
  }
  t.closePopup();
};
