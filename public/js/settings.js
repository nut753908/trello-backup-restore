/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
Object.entries({
  withFile: false,
  toLeft: false,
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
