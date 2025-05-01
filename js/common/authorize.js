import { popupAuthorize } from "./popup.js";

export const isAuthorized = async (t) => {
  const token = await t.getRestApi().getToken();
  return !!token && token !== "&error=Token%20request%20rejected";
};

export const authorize = (func) => async (t) => {
  if (await isAuthorized(t)) {
    await func(t);
  } else {
    await popupAuthorize(t);
  }
};
