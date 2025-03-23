/* global JSZip */
import { loopList } from "/js/restore/loop.js";

export const unzip = (file) => async (t) => {
  t.alert({ message: "Restoring, please wait..." });
  const newZip = new JSZip();
  const zip = await newZip.loadAsync(file);
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  await loopList(zip, token, idBoard);
  await t.hideAlert();
  t.alert({ message: "Restoration complete 🎉" });
};
