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
import { popupRestore, popupSettings } from "/js/common/popup.js";

TrelloPowerUp.initialize(
  {
    "card-buttons": async (t) => {
      const r = [];
      if (await t.get("board", "shared", "showBC", true)) {
        r.push({
          icon: BACKUP_ICON,
          text: "Back up",
          callback: protect(check(backUp("card"))),
        });
      }
      return r;
    },
    "list-actions": async (t) => {
      const r = [];
      if (await t.get("board", "shared", "showBL", true)) {
        r.push({
          text: "Back up list",
          callback: protect(check(backUp("list"))),
        });
      }
      return r;
    },
    "board-buttons": async (t) => {
      const r = [];
      if (await t.get("board", "shared", "showBLs", true)) {
        r.push({
          icon: BACKUP_ICON,
          text: "Back up lists",
          callback: protect(check(backUp("lists"))),
        });
      }
      if (await t.get("board", "shared", "showR", true)) {
        r.push({
          icon: RESTORE_ICON,
          text: "Restore",
          callback: protect(check(popupRestore)),
        });
      }
      return r;
    },
    "show-settings": popupSettings,
  },
  {
    appKey: APP_KEY,
    appName: APP_NAME,
    appAuthor: APP_AUTHOR,
  }
);
