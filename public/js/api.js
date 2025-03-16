import { APP_KEY } from "/js/env.js";

export var createList = function (token, idBoard, name, pos = "bottom") {
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

export var createCard = function (token, idList, body, pos = "bottom") {
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
