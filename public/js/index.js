/* global TrelloPowerUp */
import {
  APP_KEY,
  APP_NAME,
  APP_AUTHOR,
  BACKUP_ICON,
  RESTORE_ICON,
} from "/js/common/env.js";
import { protect } from "/js/common/protect.js";
import { check } from "/js/common/check.js";
import { backUp } from "/js/back-up/back-up.js";
import { popupRestore } from "/js/common/popup.js";

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
