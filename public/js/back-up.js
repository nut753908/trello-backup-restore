/* global JSZip */

var download = function (blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export var backUpCardButtonCallback = async function (t) {
  const list = await t.list("id", "name");
  const card = await t
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
    });
  var zip = new JSZip();
  zip.file("list1.json", JSON.stringify(list, null, 2));
  zip.file("list1_card1.json", JSON.stringify(card, null, 2));
  const blob = await zip.generateAsync({ type: "blob" });
  download(blob, "card.zip");
};
