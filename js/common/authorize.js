import { popupAuthorize } from "/js/common/popup.js";

export const isAuthorized = async (t) => {
  const token = await t.getRestApi().getToken();
  return /^[0-9a-fA-Z]{76}$/.test(token);
};

export const authorize = (func) => async (t) => {
  if (await isAuthorized(t)) {
    await func(t);
  } else {
    await popupAuthorize(t);
  }
};
