import { APP_KEY } from "/js/env.js";

export const createList = (token, idBoard, name, pos = "bottom") => {
  return fetch(
    `https://api.trello.com/1/boards/${idBoard}/lists?name=${name}&key=${APP_KEY}&token=${token}&pos=${pos}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export const createCard = (token, idList, body, pos = "bottom") => {
  return fetch(
    `https://api.trello.com/1/cards?idList=${idList}&key=${APP_KEY}&token=${token}&pos=${pos}`,
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
