/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const withFile = document.getElementById("withFile");
const toLeft = document.getElementById("toLeft");
t.get("board", "shared", "withFile", false).then((c) => (withFile.checked = c));
t.get("board", "shared", "toLeft", false).then((c) => (toLeft.checked = c));
document
  .getElementById("withFile")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "withFile", e.target.checked)
  );
document
  .getElementById("toLeft")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "toLeft", e.target.checked)
  );
