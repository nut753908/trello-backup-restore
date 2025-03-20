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
  "id",
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

export const fileToCard = (file, descFile, token, idList) =>
  file
    .async("string")
    .then(JSON.parse)
    .then(async (card) => {
      if (descFile) {
        card.desc = await descFile.async("string");
      }
      return card;
    })
    .then((card) => cardKeys.reduce((o, k) => ({ ...o, [k]: card?.[k] }), {}))
    .then((body) => backoff(() => createCard(token, idList, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

export const fileToAttachment = (file, token, idCard) =>
  file
    .async("string")
    .then(JSON.parse)
    // a: attachment
    .then((a) => ["name", "url"].reduce((o, k) => ({ ...o, [k]: a?.[k] }), {}))
    .then((body) => backoff(() => createAttachment(token, idCard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);
