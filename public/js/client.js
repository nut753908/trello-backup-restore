/* global TrelloPowerUp */

import { protect } from "/js/common/protect.js";
import { check } from "/js/common/check.js";
import { backUp } from "/js/back-up/back-up.js";
import { popupRestore } from "/js/common/popup.js";
import { APP_KEY, APP_NAME, APP_AUTHOR } from "/js/common/env.js";

const BACKUP_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_download_32dp_1F1F1F.svg?v=1742271240648";
const RESTORE_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_upload_32dp_1F1F1F.svg?v=1742271236878";

TrelloPowerUp.initialize(
  {
    "card-buttons": (t) => [
      {
        icon: BACKUP_ICON,
        text: "Back up",
        callback: protect(check(backUp("card"))),
      },
    ],
    "list-actions": (t) => [
      {
        text: "Back up list",
        callback: protect(check(backUp("list"))),
      },
    ],
    "board-buttons": (t) => [
      {
        icon: BACKUP_ICON,
        text: "Back up lists",
        callback: protect(check(backUp("lists"))),
      },
      {
        icon: RESTORE_ICON,
        text: "Restore",
        callback: protect(check(popupRestore)),
      },
    ],
  },
  {
    appKey: APP_KEY,
    appName: APP_NAME,
    appAuthor: APP_AUTHOR,
  }
);
