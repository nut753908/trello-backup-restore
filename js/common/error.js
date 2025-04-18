import { download } from "./file.js";

export const storeError = async (t, e) => {
  const message = e.message ?? "";
  const stack = e.stack ?? "";
  const date = new Date().toISOString();
  const error = { message, stack, date };
  if (stack.indexOf(message) !== -1) {
    delete error.message;
  }
  await t.set("board", "shared", "error", error);
};

export const downloadError = async (t) => {
  const error = await t.get("board", "shared", "error", {});
  const blob = new Blob([JSON.stringify(error)], {
    type: "application/json",
  });
  download(blob, "error.json");
};
