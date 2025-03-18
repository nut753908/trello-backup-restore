import { restore } from "/js/restore/restore.js";

const popup = async (t, withAuth) => {
  const token = await t.getRestApi().getToken();
  if (/^[0-9a-fA-Z]{76}$/.test(token)) {
    await t.popup({
      callback: restore,
      title: "Restore",
      url: "/popup/restore.html",
      height: 40,
    });
  } else if (withAuth) {
    await t.popup({
      callback: popup2,
      title: "Authorize",
      url: "/popup/authorize.html",
      height: 40,
    });
  }
};

const popup2 = async (t) => {
  await t.closePopup();
  await popup(t, false);
};

export const popup1 = async (t) => {
  await popup(t, true);
};
