/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
const file = document.getElementById("file");
t.get("board", "shared", "withFile", false).then((c) => (file.checked = c));
document
  .getElementById("file")
  .addEventListener("click", (e) =>
    t.set("board", "shared", "withFile", e.target.checked)
  );
