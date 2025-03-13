var downloadJSON = function (data, name) {
  const blob = new Blob([data], { type: "text/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
};

export var backUpCardButtonCallback = async function (t) {
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
