import { selectFileAndRestore } from "../restore/restore.js";
import { APP_NAME } from "./env.js";

export const popupRestore = (t) =>
  t.popup({
    callback: selectFileAndRestore,
    title: "Restore",
    url: "./restore.html",
    height: 42,
  });

export const popupAuthorize = (t) =>
  t.popup({
    title: "Authorize",
    url: "./authorize.html",
    height: 42,
  });

export const popupSettings = (t) =>
  t.popup({
    title: `${APP_NAME} Settings`,
    url: "./settings.html",
    height: 250,
  });
