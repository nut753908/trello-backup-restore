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
  fetch("https://api.trello.com/1/cards", {
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

export const createAttachment = (token, idCard, body) => {
  const formData = new FormData();
  Object.entries(body).forEach(([k, v]) => formData.append(k, v));
  formData.append("key", APP_KEY);
  formData.append("token", token);
  return fetch(`https://api.trello.com/1/cards/${idCard}/attachments`, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });
};

export const updateCard = (token, idCard, body) =>
  fetch(`https://api.trello.com/1/cards/${idCard}`, {
    method: "PUT",
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

export const createChecklist = (token, idCard, body) =>
  fetch("https://api.trello.com/1/checklists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      idCard,
      pos: "bottom",
      key: APP_KEY,
      token,
    }),
  });

export const createCheckitem = (token, idCl, body) =>
  fetch(`https://api.trello.com/1/checklists/${idCl}/checkItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      ...body,
      pos: "bottom",
      key: APP_KEY,
      token,
    }),
  });
