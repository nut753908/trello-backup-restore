import { download } from "/js/common/download.js";

export const storeError = async (t, e) => {
  const message = e.message ?? "";
  const stack = e.stack ?? "";
  const date = new Date().toISOString();
  const error = { message, stack, date };
  if (stack.indexOf(message) !== -1) {
    delete error.message;
  }
  await t.set("member", "private", "error", error);
  console.error(error);
};

export const downloadError = async (t) => {
  const error = await t.get("member", "private", "error", {});
  const blob = new Blob([JSON.stringify(error, null, 2)], {
    type: "application/json",
  });
  download(blob, "error.json");
};
