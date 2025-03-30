// BC: Back up Card
// BL: Back up List
// BLs: Back up Lists
// R: Restore

/* global TrelloPowerUp */
import {
  APP_KEY,
  APP_NAME,
  APP_AUTHOR,
  BACKUP_ICON,
  RESTORE_ICON,
} from "./common/env.js";
import { protect } from "./common/protect.js";
import { isAuthorized, authorize } from "./common/authorize.js";
import { backUp } from "./back-up/back-up.js";
import {
  popupRestore,
  popupRestoreFirefox,
  popupAuthorize,
  popupSettings,
} from "./common/popup.js";

const isFirefox = window.navigator.userAgent.indexOf("Firefox") !== -1;

TrelloPowerUp.initialize(
  {
    "card-buttons": async (t) => {
      const r = [];
      if (await t.get("board", "shared", "showBC", true)) {
        r.push({
          icon: BACKUP_ICON,
          text: "Back up",
          callback: protect(authorize(backUp("card"))),
        });
      }
      return r;
    },
    "list-actions": async (t) => {
      const r = [];
      if (await t.get("board", "shared", "showBL", true)) {
        r.push({
          text: "Back up list",
          callback: protect(authorize(backUp("list"))),
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
          callback: protect(authorize(backUp("lists"))),
        });
      }
      if (await t.get("board", "shared", "showR", true)) {
        r.push({
          icon: RESTORE_ICON,
          text: "Restore",
          callback: protect(
            authorize(isFirefox ? popupRestoreFirefox : popupRestore)
          ),
        });
      }
      return r;
    },
    "authorization-status": async (t) => ({
      authorized: await isAuthorized(t),
    }),
    "show-authorization": popupAuthorize,
    "show-settings": popupSettings,
  },
  {
    appKey: APP_KEY,
    appName: APP_NAME,
    appAuthor: APP_AUTHOR,
  }
);
