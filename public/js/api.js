export var createList = function (idBoard, name, key, token, pos = "bottom") {
  return fetch(
    `https://api.trello.com/1/boards/${idBoard}/lists?name=${name}&key=${key}&token=${token}&pos=${pos}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );
};

export var createCard = function (idList, body, key, token, pos = "bottom") {
  return fetch(
    `https://api.trello.com/1/cards?idList=${idList}&key=${key}&token=${token}&pos=${pos}`,
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
