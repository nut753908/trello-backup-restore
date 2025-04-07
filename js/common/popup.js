import { selectFileAndRestore } from "../restore/restore.js";
import { APP_NAME } from "./env.js";

export const popupRestore = async (t) => {
  await t.back();
  await t.popup({
    callback: selectFileAndRestore,
    title: "Restore",
    url: "/restore.html",
    height: 42,
  });
};

export const popupRestoreFirefox = async (t) => {
  await t.back();
  await t.popup({
    title: "Restore",
    url: "/restore-firefox.html",
    height: 42,
  });
};

export const popupAuthorize = async (t) => {
  await t.back();
  await t.popup({
    title: "Authorize",
    url: "/authorize.html",
    height: 42,
  });
};

export const popupSettings = (t) =>
  t.popup({
    title: `${APP_NAME} Settings`,
    url: "/settings.html",
    height: 382,
  });
