/* global TrelloPowerUp */

const t = TrelloPowerUp.iframe();
document
  .querySelector("button")
  .addEventListener("click", () => t.notifyParent("done"), false);
