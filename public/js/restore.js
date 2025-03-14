import { APP_KEY } from "/js/env.js";

var getBoard = function (id, key, token) {
  fetch(`https://api.trello.com/1/boards/${id}?key=${key}&token=${token}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((response) => {
      console.log(
        `Get board response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

var updateBoard = function (id, key, token) {
  fetch(`https://api.trello.com/1/boards/${id}?key=${key}&token=${token}`, {
    method: "PUT",
  })
    .then((response) => {
      console.log(
        `Update board response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

export var restoreBoardButtonCallback = async function (t) {
  await t
    .getRestApi()
    .getToken()
    .then(async function (token) {
      if (/^[0-9a-fA-Z]{76}$/.test(token)) {
        const idBoard = t.getContext().board;
        await getBoard(idBoard, APP_KEY, token);
        await updateBoard(idBoard, APP_KEY, token);
        {
          const blob = new Blob(["a"], { type: "text/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "a.txt";
          a.click();
          URL.revokeObjectURL(url);
        }
      } else {
        await t.popup({
          title: "Authorize",
          url: "/authorize.html",
        });
      }
    });
};
