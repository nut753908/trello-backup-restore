export const protect = (func) => async (t) => {
  try {
    window.onbeforeunload = async () => {
      await t.set("member", "private", "busy", false);
    };
    if (await t.get("member", "private", "busy", false)) {
      return;
    }
    await t.set("member", "private", "busy", true);
    await func(t);
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await t.set("member", "private", "busy", false);
  }
};
