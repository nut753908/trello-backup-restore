/* global TrelloPowerUp */

import { protect } from "/js/protect.js";
import { backUp } from "/js/back-up/back-up.js";
import { popup1 } from "/js/restore/popup.js";
import { APP_KEY, APP_NAME, APP_AUTHOR } from "/js/env.js";

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
        callback: protect(backUp("card")),
      },
    ],
    "list-actions": (t) => [
      {
        text: "Back up list",
        callback: protect(backUp("list")),
      },
    ],
    "board-buttons": (t) => [
      {
        icon: BACKUP_ICON,
        text: "Back up lists",
        callback: protect(backUp("lists")),
      },
      {
        icon: RESTORE_ICON,
        text: "Restore",
        callback: protect(popup1),
      },
    ],
  },
  {
    appKey: APP_KEY,
    appName: APP_NAME,
    appAuthor: APP_AUTHOR,
  }
);
