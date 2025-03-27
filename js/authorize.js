/* global TrelloPowerUp */
import { APP_KEY, APP_NAME, APP_AUTHOR } from "./common/env.js";

const t = TrelloPowerUp.iframe({
  appKey: APP_KEY,
  appName: APP_NAME,
  appAuthor: APP_AUTHOR,
});
const button = document.querySelector("button");
button.hidden = false;
button.addEventListener(
  "click",
  async () => {
    await t.getRestApi().clearToken();
    await t.getRestApi().authorize({ scope: "read,write" });
    t.notifyParent("done");
  },
  false
);
