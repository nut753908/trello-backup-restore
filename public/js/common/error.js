export const storeError = async (t, e) => {
  const message = e.message ?? "";
  const stack = e.stack ?? "";
  const date = new Date().toISOString();
  const error = { message, stack, date };
  if (stack.indexOf(message) !== -1) {
    delete error.message;
  }
  t.set("member", "private", "error", error);
  console.error(error);
};
