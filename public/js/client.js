/* global TrelloPowerUp */

import {
  backUpCardButtonCallback,
  backUpListActionCallback,
} from "/js/back-up.js";
import { restoreBoardButtonCallback } from "/js/authorize.js";
import { APP_KEY, APP_NAME, APP_AUTHOR } from "/js/env.js";

var FILE_DOWNLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_download_16dp_1F1F1F.svg?v=1741327113830";
var FILE_UPLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_upload_16dp_1F1F1F.svg?v=1741327106140";

TrelloPowerUp.initialize(
  {
    "card-buttons": function (t) {
      return [
        {
          icon: FILE_DOWNLOAD_ICON,
          text: "Back up",
          callback: backUpCardButtonCallback,
        },
      ];
    },
    "list-actions": function (t) {
      return [
        {
          text: "Back up list",
          callback: backUpListActionCallback,
        },
      ];
    },
    "board-buttons": function (t) {
      return [
        {
          icon: FILE_UPLOAD_ICON,
          text: "Restore",
          callback: restoreBoardButtonCallback,
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
