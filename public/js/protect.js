const args = ["member", "private", "busyForBackupRestore"];

export const protect = (func) => async (t) => {
  window.onbeforeunload = () => {
    t.set(...args, false);
  };
  if (await t.get(...args, false)) {
    return;
  }
  await t.set(...args, true);
  await Promise.all([
    new Promise((resolve) => setTimeout(resolve, 500)),
    func(t),
  ]).finally(() => {
    t.set(...args, false);
  });
};
