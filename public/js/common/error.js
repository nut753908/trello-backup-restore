export const storeError = async (t, e) => {
  const stack = e.stack ?? "";
  const message = e.message ?? "";
  const date = new Date().toISOString();
  const error = { message, stack, date };
  if (stack.indexOf(message) !== -1) {
    delete error.message;
  }
  t.set("member", "private", "errorForBackupRestore", error);
  console.error(error);
};
