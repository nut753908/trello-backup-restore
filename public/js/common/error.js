export const storeError = async (t, e) => {
  const message = e.message ?? "";
  const stack = e.stack ?? "";
  const date = new Date().toISOString();
  const error = { message, stack, date };
  t.set("member", "private", "errorForBackupRestore", error);
  console.error(error);
};
