import { backoff } from "../common/backoff.js";
import { APP_KEY } from "../common/env.js";

export const getOffset = async (token, idBoard, toRight) => {
  const res = await backoff(() =>
    fetch(
      `https://api.trello.com/1/boards/${idBoard}/lists` +
        `?filter=open&key=${APP_KEY}&token=${token}`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    )
  );
  if (!res.ok) {
    throw new Error(
      JSON.stringify({ status: res.status, url: res.url.split("?")[0] })
    );
  }
  const lists = await res.json();
  return toRight
    ? lists.map((l) => l.pos).reduce((p1, p2) => Math.max(p1, p2)) + 1
    : lists.map((l) => l.pos).reduce((p1, p2) => Math.min(p1, p2)) - 1;
};
