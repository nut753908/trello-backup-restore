/* global JSZip */
import { loopDir } from "./loop.js";
import { storeError } from "../common/error.js";
import { selectFile } from "../common/file.js";
import { protect } from "../common/protect.js";

const restore = (file) => async (t) => {
  try {
    t.alert({ message: "Restoring, please wait..." });
    const newZip = new JSZip();
    const zip = await newZip.loadAsync(file);
    const token = await t.getRestApi().getToken();
    const idBoard = t.getContext().board;
    const toRight = await t.get("board", "shared", "toRight", true);
    await loopDir(zip, token, idBoard, toRight);
    await t.hideAlert();
    t.alert({ message: "Restoration complete 🎉" });
  } catch (e) {
    await t.hideAlert();
    t.alert({ message: "❌ Failed to restore" });
    storeError(t, e);
  }
};

export const selectFileAndRestore = async (t) => {
  const file = await selectFile();
  t.closePopup();
  if (/\.zip$/.test(file?.name)) {
    await protect(restore(file))(t);
  }
};
