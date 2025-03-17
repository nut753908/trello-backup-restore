import { APP_KEY } from "/js/env.js";

export const createList = (token, idBoard, name) => {
  return fetch(
    `https://api.trello.com/1/boards/${idBoard}/lists?name=${name}&key=${APP_KEY}&token=${token}&pos=bottom`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export const createCard = (token, idList, body) => {
  return fetch(
    `https://api.trello.com/1/cards?idList=${idList}&key=${APP_KEY}&token=${token}&pos=bottom`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }
  );
};
