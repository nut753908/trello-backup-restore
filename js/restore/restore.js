// cf: custom field

import { getCurBoard } from "./board.js";
import { getMapIdLabel, getMapIdCf } from "./board.js";
import { loopList } from "./loop.js";
import { storeError } from "../common/error.js";
import { selectFile } from "../common/file.js";
import { protect } from "../common/protect.js";

const restore = (file) => async (t) => {
  try {
    await t.hideAlert();
    t.alert({ message: "Restoring, please wait..." });
    const { board, lists } = JSON.parse(await file.text());
    const token = await t.getRestApi().getToken();
    const { idBoard, idMembers, labels, cfs, isFree } = await getCurBoard(t);
    const addLabels = await t.get("board", "shared", "addLabels", true);
    const addCfs = await t.get("board", "shared", "addCfs", true);
    const toRight = await t.get("board", "shared", "toRight", true);
    const mapIdLabel = await getMapIdLabel(
      token,
      idBoard,
      board.labels,
      labels,
      addLabels
    );
    const { mapIdCf, mapIdCfo } = isFree
      ? {}
      : await getMapIdCf(token, idBoard, board.customFields, cfs, addCfs);
    await loopList(
      lists,
      token,
      idBoard,
      idMembers,
      mapIdLabel,
      mapIdCf,
      mapIdCfo,
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
  if (/\.json$/.test(file?.name)) {
    await protect(restore(file))(t);
  }
};

export const selectFileAndRestoreFirefox = async (t) => {
  const file = await selectFile();
  if (/\.json$/.test(file?.name)) {
    await restore(file)(t);
  }
  t.closePopup();
};
