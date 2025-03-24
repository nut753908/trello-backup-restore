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

const addParams = (idBoard, token, lists) =>
  backoff(() =>
    fetch(
      `https://api.trello.com/1/boards/${idBoard}/cards` +
        `?fields=cover&checklists=all&stickers=true` +
        `&key=${APP_KEY}&token=${token}`
    )
  )
    .then((res) => res.json())
    .then((json) => json.reduce((o, c) => ({ ...o, [c.id]: c }), {}))
    .then((map) => {
      lists.forEach((l) => {
        l.cards.forEach((c) => {
          c.cover = map[c.id].cover;
          c.checklists = map[c.id].checklists;
          c.stickers = map[c.id].stickers;
        });
      });
    });

export const createZipBlob = async (t, type) => {
  const token = await t.getRestApi().getToken();
  const board = await t.board("id", "name");
  const lists = await getLists[type](t);
  await addParams(board.id, token, lists);
  const zip = new JSZip();
  boardToFile(board, zip);
  await loopList(lists, zip, token);
  return zip.generateAsync({ type: "blob" });
};
