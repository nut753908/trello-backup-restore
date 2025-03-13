import { APP_KEY } from "/js/env.js";

var authorize = async function (t) {
  const authorized = await t.getRestApi().isAuthorized();
  if (!authorized) {
    await t.getRestApi().authorize({ scope: "read,write" });
  }
  const token = await t.getRestApi().getToken();
  if (!token) {
    throw new Error("No token");
  }
  return token;
};

var getList = async function (id, key, token) {
  return fetch(
    `https://api.trello.com/1/lists/${id}?key=${key}&token=${token}`,
    {
      method: "GET",
    }
  )
    .then((response) => {
      console.log(
        `Get list response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

var updateList = async function (id, key, token) {
  return fetch(
    `https://api.trello.com/1/lists/${id}?key=${key}&token=${token}`,
    {
      method: "PUT",
    }
  )
    .then((response) => {
      console.log(
        `Update list response: ${response.status} ${response.statusText}`
      );
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};

export var restoreBoardButtonCallback = function (t) {
  authorize(t)
    .then(async function (token) {
      const id = t.getContext().list;
      await getList(id, APP_KEY, token);
      await updateList(id, APP_KEY, token);
    })
    .catch(function (err) {
      console.log(err);
    });
};
