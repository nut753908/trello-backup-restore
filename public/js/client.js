/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

var FILE_DOWNLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_download_16dp_1F1F1F.svg?v=1741327113830";
var FILE_UPLOAD_ICON =
  "https://cdn.glitch.global/0b64f33b-22b9-4fbd-8d4e-fdb824ae590b/file_upload_16dp_1F1F1F.svg?v=1741327106140";

var downloadJSON = function (data, name) {
  const blob = new Blob([data], { type: "text/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

var backUpCardButtonCallback = async function (t) {
  const listAndCard = {
    list: await t.list("id", "name"),
    card: await t
      .card(
        "id",
        "name",
        "due",
        "start",
        "dueComplete",
        "address",
        "locationName",
        "coordinates",
        "members",
        "labels"
      )
      .then(function (card) {
        card.idMembers = card.members.map((v) => v.id);
        card.idLabels = card.labels.map((v) => v.id);
        delete card.members;
        delete card.labels;
        return card;
      }),
  };
  downloadJSON(JSON.stringify(listAndCard, null, 2), "list-and-card.json");
};

TrelloPowerUp.initialize({
  "card-buttons": function (t, options) {
    return [
      {
        icon: FILE_DOWNLOAD_ICON,
        text: "Back up",
        callback: backUpCardButtonCallback,
      },
    ];
  },
});
