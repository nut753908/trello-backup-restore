import { APP_KEY } from "/js/env.js";

export const createList = (token, idBoard, name) =>
  fetch(`https://api.trello.com/1/boards/${idBoard}/lists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name,
      pos: "bottom",
      key: APP_KEY,
      token,
    }),
  });

export const createCard = (token, idList, body) =>
  fetch(`https://api.trello.com/1/cards`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      idList,
      pos: "bottom",
      key: APP_KEY,
      token,
    }),
  });

export const createAttachment = (token, idCard, body) =>
  fetch(`https://api.trello.com/1/cards/${idCard}/attachments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      key: APP_KEY,
      token,
    }),
  });
