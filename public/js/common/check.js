import { popupAuth } from "/js/common/popup.js";

export const check = (func) => async (t) => {
  const token = await t.getRestApi().getToken();
  if (/^[0-9a-fA-Z]{76}$/.test(token)) {
    await func(t);
  } else {
    await popupAuth(t);
  }
};
