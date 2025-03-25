import { restore } from "/js/restore/restore.js";
import { APP_NAME } from "/js/common/env.js";

export const popupRestore = (t) =>
  t.popup({
    callback: restore,
    title: "Restore",
    url: "/restore.html",
    height: 42,
  });

export const popupAuth = (t) =>
  t.popup({
    title: "Authorize",
    url: "/authorize.html",
    height: 42,
  });

export const popupSettings = (t) =>
  t.popup({
    title: `${APP_NAME} Settings`,
    url: "./settings.html",
    height: 250,
  });
