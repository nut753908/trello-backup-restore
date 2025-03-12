/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

var FILE_DOWNLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_download_16dp_1F1F1F.svg?v=1741327113830";
var FILE_UPLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_upload_16dp_1F1F1F.svg?v=1741327106140";

TrelloPowerUp.initialize({
  "card-buttons": function (t, options) {
    return [
      {
        icon: FILE_DOWNLOAD_ICON,
        text: "Backup",
      },
    ];
  },
});
