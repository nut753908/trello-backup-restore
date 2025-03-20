import { APP_KEY } from "/js/env.js";

export const createList = (token, idBoard, name) =>
  fetch(
    `https://api.trello.com/1/boards/${idBoard}/lists?name=${name}&pos=bottom&key=${APP_KEY}&token=${token}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );

export const createCard = (token, idList, body) =>
  fetch(
    `https://api.trello.com/1/cards?idList=${idList}&pos=bottom&key=${APP_KEY}&token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }
  );

export const createAttachment = (token, idCard, body) =>
  fetch(
    `https://api.trello.com/1/cards/${idCard}/attachments?&key=${APP_KEY}&token=${token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }
  );
