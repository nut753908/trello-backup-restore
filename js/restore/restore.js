// cf: custom field

/* global JSZip */
import { getCurBoard } from "./board.js";
import { loopDir } from "./loop.js";
import { storeError } from "../common/error.js";
import { selectFile } from "../common/file.js";
import { protect } from "../common/protect.js";

const restore = (file) => async (t) => {
  try {
    await t.hideAlert();
    t.alert({ message: "Restoring, please wait..." });
    const newZip = new JSZip();
    const zip = await newZip.loadAsync(file);
    const token = await t.getRestApi().getToken();
    const { idBoard, idMembers, labels, cfs } = await getCurBoard(t);
    const addLabels = await t.get("board", "shared", "addLabels", true);
    const addCfs = await t.get("board", "shared", "addCfs", true);
    const toRight = await t.get("board", "shared", "toRight", true);
    await loopDir(
      zip,
      token,
      idBoard,
      idMembers,
      labels,
      cfs,
      addLabels,
      addCfs,
      toRight
    );
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
