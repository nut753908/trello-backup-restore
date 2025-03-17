export const protect = (func) => async (t) => {
  window.onbeforeunload = () => {
    t.set("member", "private", "busyForBackupRestore", false);
  };
  if (await t.get("member", "private", "busyForBackupRestore", false)) {
    return;
  }
  await t.set("member", "private", "busyForBackupRestore", true);
  try {
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 500)),
      func(t),
    ]);
  } finally {
    await t.set("member", "private", "busyForBackupRestore", false);
  }
};
