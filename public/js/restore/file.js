// a: attachment
// af: attachment file
// cl: checklist
// ci: checkitem
// cfi: custom field item

import { backoff } from "/js/restore/backoff.js";
import {
  createList,
  createCard,
  createA,
  updateCard,
  createCl,
  createCi,
  updateCfi,
} from "/js/restore/api.js";
import {
  listKeys,
  cardKeys,
  aKeys,
  coverKeys,
  clKeys,
  ciKeys,
  cfiKeys,
} from "/js/restore/keys.js";

export const fileToList = (file, token, idBoard) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((list) => listKeys.reduce((o, k) => ({ ...o, [k]: list?.[k] }), {}))
    .then((body) => backoff(() => createList(token, idBoard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

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

export const fileToA = (aFile, afFile, token, idCard) =>
  aFile
    .async("string")
    .then(JSON.parse)
    .then((a) => aKeys.reduce((o, k) => ({ ...o, [k]: a?.[k] }), {}))
    .then(async (a) => {
      a.setCover = false;
      if (afFile) {
        a.file = new File(
          [await afFile.async("blob")],
          a.url
            ? decodeURI(a.url.split("/").pop())
            : decodeURI(a.name.split("/").pop())
        );
        delete a.url;
      }
      return a;
    })
    .then((body) => backoff(() => createA(token, idCard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

export const fileToCover = (file, token, idCard, mapIdA) => {
  if (file) {
    file
      .async("string")
      .then(JSON.parse)
      .then((cover) =>
        coverKeys.reduce((o, k) => ({ ...o, [k]: cover?.[k] }), {})
      )
      .then((cover) => {
        cover.idAttachment = mapIdA[cover.attachmentPos];
        cover.url = cover.unsplashUrl;
        delete cover.attachmentPos;
        delete cover.unsplashUrl;
        return { cover };
      })
      .then((body) => backoff(() => updateCard(token, idCard, body)));
  }
};

export const fileToCl = (file, token, idCard) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((cl) => clKeys.reduce((o, k) => ({ ...o, [k]: cl?.[k] }), {}))
    .then((body) => backoff(() => createCl(token, idCard, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

export const fileToCi = (file, token, idCl) =>
  file
    .async("string")
    .then(JSON.parse)
    .then((ci) => ciKeys.reduce((o, k) => ({ ...o, [k]: ci?.[k] }), {}))
    .then((body) => backoff(() => createCi(token, idCl, body)))
    .then((res) => res.json())
    .then((json) => json?.id);

export const filesToCfi = async (files, token, idCard) => {
  if (files.length > 0) {
    Promise.all(
      files.map((file) =>
        file
          .async("string")
          .then(JSON.parse)
          .then((cfi) => cfiKeys.reduce((o, k) => ({ ...o, [k]: cfi?.[k] }), {}))
      )
    )
      .then((cfis) => ({ customFieldItems: cfis }))
      .then((body) => backoff(() => updateCfi(token, idCard, body)));
  }
};
