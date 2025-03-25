/* global JSZip */
import { loopDir } from "/js/restore/loop.js";
import { storeError } from "/js/common/error.js";

export const unzip = (file) => async (t) => {
  try {
    t.alert({ message: "Restoring, please wait..." });
    const newZip = new JSZip();
    const zip = await newZip.loadAsync(file);
    const token = await t.getRestApi().getToken();
    const idBoard = t.getContext().board;
    const withFile = await t.get("board", "shared", "withFile", false);
    const toLeft = await t.get("board", "shared", "toLeft", false);
    await loopDir(zip, token, idBoard, withFile, toLeft);
    await t.hideAlert();
    t.alert({ message: "Restoration complete 🎉" });
  } catch (e) {
    console.error(e);
    await t.hideAlert();
    t.alert({ message: "❌ Failed to restore" });
    storeError(t, e);
  }
};
