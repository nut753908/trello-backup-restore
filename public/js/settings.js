/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const withFile = document.getElementById("withFile");
t.get("board", "shared", "withFile", false).then((c) => (withFile.checked = c));
document
  .getElementById("withFile")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "withFile", e.target.checked)
  );
