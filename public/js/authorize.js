import { restorePopupCallback } from "/js/restore.js";

var main = async function (t, withAuth) {
  const token = await t.getRestApi().getToken();
  if (/^[0-9a-fA-Z]{76}$/.test(token)) {
    await t.popup({
      callback: restorePopupCallback,
      title: "Restore",
      url: "/restore.html",
      height: 40,
    });
  } else if (withAuth) {
    await t.popup({
      callback: authorizePopupCallback,
      title: "Authorize",
      url: "/authorize.html",
      height: 40,
    });
  }
};

var authorizePopupCallback = async function (t) {
  await t.closePopup();
  await main(t, false);
};

export var restoreBoardButtonCallback = async function (t) {
  await main(t, true);
};
