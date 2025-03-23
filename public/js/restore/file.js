import { backoff } from "/js/restore/backoff.js";
import {
  createList,
  createCard,
  createAttachment,
  updateCard,
  createChecklist,
  createCheckitem,
} from "/js/restore/api.js";

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
export const getIdA = (file) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((a) => a.id);

// a: attachment
export const fileToAttachment = (aFile, fileFile, token, idCard) =>
  aFile
    .async("string")
    .then(JSON.parse)
    .then((a) => ["name", "url"].reduce((o, k) => ({ ...o, [k]: a?.[k] }), {}))
    .then(async (a) => {
      a.setCover = false;
      if (fileFile) {
        a.file = new File(
          [await fileFile.async("blob")],
          a.url
            ? decodeURI(a.url.split("/").pop())
            : decodeURI(a.name.split("/").pop())
        );
        delete a.url;
      }
      return a;
    })
    .then((body) => backoff(() => createAttachment(token, idCard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

const coverKeys = ["color", "idAttachment", "url", "size", "brightness"];

// a: attachment
export const fileToCover = (file, token, idCard, mapIdA) => {
  if (!file) {
    return;
  }
  file
    .async("string")
    .then(JSON.parse)
    .then((cover) =>
      coverKeys.reduce((o, k) => ({ ...o, [k]: cover?.[k] }), {})
    )
    .then((cover) => {
      cover.idAttachment = mapIdA[cover.idAttachment] ?? null;
      return { cover };
    })
    .then((body) => backoff(() => updateCard(token, idCard, body)));
};

// cl: checklist
export const fileToChecklist = (file, token, idCard) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((cl) => ["name"].reduce((o, k) => ({ ...o, [k]: cl?.[k] }), {}))
    .then((name) => backoff(() => createChecklist(token, idCard, name)))
    .then((res) => res.json())
    .then((json) => json?.id);

// ci: checkitem
const ciKeys = ["name", "checked", "due", "dueReminder", "idMember"];

// ci: checkitem
export const fileToCheckitem = (file, token, idCl) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((ci) => ciKeys.reduce((o, k) => ({ ...o, [k]: ci?.[k] }), {}))
    .then((name) => backoff(() => createCheckitem(token, idCl, name)))
    .then((res) => res.json())
    .then((json) => json?.id);
