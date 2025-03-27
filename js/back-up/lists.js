import { backoff } from "../common/backoff.js";
import { APP_KEY } from "../common/env.js";

const getRawLists = {
  card: async (t) => [
    {
      ...(await t.list("id", "name")),
      cards: [await t.card("all")],
    },
  ],
  list: async (t) => [await t.list("all")],
  lists: (t) => t.lists("all"),
};

const addIJ = async (t, type, lists) => {
  const _lists = type === "lists" ? lists : await t.lists("all");
  const mapI = _lists.reduce((o, l, i) => ({ ...o, [l.id]: i }), {});
  const mapJ = _lists
    .map((l) => l.cards.reduce((o, c, j) => ({ ...o, [c.id]: j }), {}))
    .reduce((o, map) => ({ ...o, ...map }), {});
  lists.forEach((l) => {
    l.i = mapI[l.id];
    l.cards.forEach((c) => {
      c.j = mapJ[c.id];
    });
  });
};

const addParams = async (t, lists) => {
  const token = await t.getRestApi().getToken();
  const idBoard = t.getContext().board;
  const res = await backoff(() =>
    fetch(
      `https://api.trello.com/1/boards/${idBoard}/cards` +
        `?fields=cover&checklists=all&stickers=true` +
        `&key=${APP_KEY}&token=${token}`
    )
  );
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ status: res.status, url: res.url.split("?")[0] })
    );
  }
  const cards = await res.json();
  const map = cards.reduce((o, c) => ({ ...o, [c.id]: c }), {});
  lists.forEach((l) => {
    l.cards.forEach((c) => {
      c.cover = map[c.id].cover;
      c.checklists = map[c.id].checklists;
      c.stickers = map[c.id].stickers;
    });
  });
};

export const getLists = async (t, type) => {
  const lists = await getRawLists[type](t);
  await addIJ(t, type, lists);
  await addParams(t, lists);
  return lists;
};
