import { backoff } from "/js/restore/backoff.js";
import {
  createList,
  createCard,
  createAttachment,
  createCover,
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
export const getAttachmentId = (file) =>
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
export const coverToCard = (file, token, idCard, idsOldA, idsNewA) => {
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
      if (cover.idAttachment !== null) {
        const i = idsOldA.indexOf(cover.idAttachment);
        cover.idAttachment = i !== -1 ? idsNewA[i] : null;
      }
      return { cover };
    })
    .then((body) => backoff(() => createCover(token, idCard, body)));
};
