/* global JSZip */
import { loopDir } from "./loop.js";
import { storeError } from "../common/error.js";

export const unzip = (file) => async (t) => {
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
    console.error(e);
    await t.hideAlert();
    t.alert({ message: "❌ Failed to restore" });
    storeError(t, e);
  }
};
