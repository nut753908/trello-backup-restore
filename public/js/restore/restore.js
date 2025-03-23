import { protect } from "/js/common/protect.js";
import { unzip } from "/js/restore/unzip.js";

const selectFile = () =>
  new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".zip";
    input.addEventListener("change", () => resolve(input.files[0]), false);
    input.addEventListener("cancel", () => resolve(null), false);
    input.click();
  });

export const restore = async (t) => {
  const file = await selectFile();
  t.closePopup();
  if (/\.zip$/.test(file?.name)) {
    await protect(unzip(file))(t);
  }
};
