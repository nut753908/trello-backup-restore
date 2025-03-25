/* global JSZip */
import { backoff } from "/js/common/backoff.js";
import { APP_KEY } from "/js/common/env.js";
import { boardToFile } from "/js/back-up/file.js";
import { loopList } from "/js/back-up/loop.js";

const getLists = {
  card: async (t) => [
    {
      ...(await t.list("id", "name")),
      cards: [await t.card("all")],
    },
  ],
  list: async (t) => [await t.list("all")],
  lists: (t) => t.lists("all"),
};

const addParams = async (idBoard, token, lists) => {
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

export const createZipBlob = async (t, type) => {
  const token = await t.getRestApi().getToken();
  const board = await t.board("all");
  const lists = await getLists[type](t);
  await addParams(board.id, token, lists);
  const withFile = await t.get("board", "shared", "withFile", false);
  const zip = new JSZip();
  boardToFile(board, zip);
  await loopList(lists, zip, token, withFile);
  return zip.generateAsync({ type: "blob" });
};
