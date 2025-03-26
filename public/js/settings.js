// BC: Back up Card
// BL: Back up List
// BLs: Back up Lists
// R: Restore

/* global TrelloPowerUp */
import { downloadError } from "/js/common/error.js";

const t = TrelloPowerUp.iframe();
Object.entries({
  withFile: false,
  toLeft: false,
  toRight: true,
  showBC: true,
  showBL: true,
  showBLs: true,
  showR: true,
}).forEach(async ([k, v]) => {
  const elm = document.getElementById(k);
  elm.checked = await t.get("board", "shared", k, v);
  elm.addEventListener("click", (e) =>
    t.set("board", "shared", k, e.target.checked)
  );
});
document
  .getElementById("toLeft")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "toRight", !e.target.checked)
  );
document
  .getElementById("toRight")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "toLeft", !e.target.checked)
  );
document
  .querySelector("button")
  .addEventListener("click", () => downloadError(t), false);
