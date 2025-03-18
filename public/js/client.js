/* global TrelloPowerUp */

import { protect } from "/js/protect.js";
import {
  backUpCardButtonCallback,
  backUpListActionCallback,
  backUpListsBoardButtonCallback,
} from "/js/back-up.js";
import { restoreBoardButtonCallback } from "/js/restore/authorize.js";
import { APP_KEY, APP_NAME, APP_AUTHOR } from "/js/env.js";

const FILE_DOWNLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_download_32dp_1F1F1F.svg?v=1742271240648";
const FILE_UPLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_upload_32dp_1F1F1F.svg?v=1742271236878";

TrelloPowerUp.initialize(
  {
    "card-buttons": (t) => {
      return [
        {
          icon: FILE_DOWNLOAD_ICON,
          text: "Back up",
          callback: protect(backUpCardButtonCallback),
        },
      ];
    },
    "list-actions": (t) => {
      return [
        {
          text: "Back up list",
          callback: protect(backUpListActionCallback),
        },
      ];
    },
    "board-buttons": (t) => {
      return [
        {
          icon: FILE_DOWNLOAD_ICON,
          text: "Back up lists",
          callback: protect(backUpListsBoardButtonCallback),
        },
        {
          icon: FILE_UPLOAD_ICON,
          text: "Restore",
          callback: protect(restoreBoardButtonCallback),
        },
      ];
    },
  },
  {
    appKey: APP_KEY,
    appName: APP_NAME,
    appAuthor: APP_AUTHOR,
  }
);
