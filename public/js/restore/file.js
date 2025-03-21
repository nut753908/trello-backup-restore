import { backoff } from "/js/restore/backoff.js";
import { createList, createCard, createAttachment } from "/js/restore/api.js";

export const fileToList = (file, token, idBoard) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((list) => list?.name)
    .then((name) => backoff(() => createList(token, idBoard, name)))
    .then((res) => res.json())
    .then((json) => json?.id);

const cardKeys = [
  "name",
  "desc",
  "due",
  "start",
  "dueComplete",
  "idMembers",
  "idLabels",
  "address",
  "locationName",
  "coordinates",
];

export const fileToCard = (cardFile, descFile, token, idList) =>
  cardFile
    .async("string")
    .then(JSON.parse)
    .then((card) => cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {}))
    .then(async (card) => {
      if (descFile) {
        card.desc = await descFile.async("string");
      }
      return card;
    })
    .then((body) => backoff(() => createCard(token, idList, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

// a: attachment
export const fileToAttachment = (aFile, fileFiles, token, idCard) =>
  aFile
    .async("string")
    .then(JSON.parse)
    .then((a) => ["name", "url"].reduce((o, k) => ({ ...o, [k]: a?.[k] }), {}))
    .then(async (a) => {
      a.setCover = false;
      if (fileFiles.length >= 1) {
        a.name = fileFiles[0].name.match(
          /^list\d+_card\d+_attachment\d+_file_(.+)/
        )[1];
        a.file = await fileFiles[0].async("blob");
        delete a.url;
      }
      return a;
    })
    .then((body) => backoff(() => createAttachment(token, idCard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);
