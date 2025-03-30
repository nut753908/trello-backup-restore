/* global TrelloPowerUp */
import { APP_KEY, APP_NAME, APP_AUTHOR } from "./common/env.js";
import { selectFileAndRestoreFirefox } from "./restore/restore.js";

const t = TrelloPowerUp.iframe({
  appKey: APP_KEY,
  appName: APP_NAME,
  appAuthor: APP_AUTHOR,
});
const button = document.querySelector("button");
button.addEventListener(
  "click",
  async () => {
    button.hidden = true;
    document.getElementById("warn").hidden = false;
    t.sizeTo(document.body);
    await selectFileAndRestoreFirefox(t);
  },
  false
);
