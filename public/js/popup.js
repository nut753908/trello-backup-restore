import { restore } from "/js/restore/restore.js";

export const popupRestore = (t) =>
  t.popup({
    callback: restore,
    title: "Restore",
    url: "/restore.html",
    height: 40,
  });

export const popupAuth = (t) =>
  t.popup({
    title: "Authorize",
    url: "/authorize.html",
    height: 40,
  });
